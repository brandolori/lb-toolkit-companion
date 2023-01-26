import React, { useEffect, useState } from 'react'
import { AppState, Button, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native'
import ClipList from './ClipList'
import { Picker } from '@react-native-picker/picker'
import Clipboard from '@react-native-clipboard/clipboard'
import { Clip, DateFilter, fetchClips, pushClip } from './azureTables'

const Home = ({ navigation }) => {
    const [dateFilter, setDateFilter] = useState<DateFilter>("today")
    const [text, setText] = useState("")

    const onSubmit = async () => {
        setText("")
        await pushClip(text)
    }

    const putClipboardInField = async () => {
        const content = await Clipboard.getString()
        setText(content)
    }

    const onFocus = async () => {
        const putClipboardPromise = putClipboardInField()
        const fetchPromise = fetchAndUpdateClips()
        return Promise.all([putClipboardPromise, fetchPromise])
    }

    const [clips, setClips] = useState<Clip[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const fetchAndUpdateClips = async () => {
        setRefreshing(true)
        const data = await fetchClips(dateFilter)
        setClips(data)
        setRefreshing(false)
    }

    useEffect(() => {
        putClipboardInField()
        const subscription = AppState.addEventListener("focus", onFocus)
        return () => subscription.remove()
    }, [])

    useEffect(() => {
        fetchAndUpdateClips()
    }, [dateFilter])

    return (
        <SafeAreaView style={{ backgroundColor: "#1a1b1e" }}>
            <StatusBar
                barStyle='light-content'
                backgroundColor="#1a1b1e"
            />
            <View style={{ height: "100%", marginHorizontal: 10, paddingBottom: 10 }}>
                <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
                    <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>

                            <Text>
                                Showing clips from:
                            </Text>
                            <Picker
                                style={{ width: "50%" }}
                                selectedValue={dateFilter}
                                onValueChange={itemValue =>
                                    setDateFilter(itemValue)
                                }>
                                <Picker.Item label="Today" value="today" />
                                <Picker.Item label="This Week" value="this week" />
                                <Picker.Item label="This Month" value="this month" />
                                <Picker.Item label="All" value="all" />
                            </Picker>
                        </View>
                        <Button title='🔧' color="#25262b" onPress={() =>
                            navigation.navigate('Config')} />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <ClipList clips={clips} refreshing={refreshing} updateClips={fetchAndUpdateClips} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
                    <TextInput
                        style={{ flex: 1 }}
                        onChangeText={setText}
                        onSubmitEditing={onSubmit}
                        value={text}
                    />
                    <Button
                        color="#25262b"
                        title="Send"
                        onPress={async () => {
                            await onSubmit()
                            await fetchAndUpdateClips()
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home

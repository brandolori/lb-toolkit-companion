import React, { useEffect, useState } from 'react';
import { AppState, Button, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import ClipList, { Clip, DateFilter } from './ClipList';
import { Picker } from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';
import { getTableClient } from './azureTable';
import { odata } from '@azure/data-tables';

const fetchClips = async (dateFilter?: DateFilter) => {
  const days = dateFilter == "today" ? 1 :
    dateFilter == "this week" ? 7 :
      dateFilter == "this month" ? 30 : 100000
  const filterDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000) // 1 days ago

  const data = []
  const tableClient = getTableClient()
  const lister = tableClient.listEntities({
    queryOptions: {
      filter: odata`Timestamp ge ${filterDate}`,
    }
  })

  for await (const entity of lister) {
    data.push({
      date: entity.timestamp,
      id: entity.rowKey,
      source: entity.partitionKey,
      text: entity.text
    })
  }

  return data.sort((a, b) => a.date > b.date ? -1 : 1)
}

const pushClip = async (clip: string) => {
  if (!clip)
    return
  await getTableClient().createEntity({
    partitionKey: "phone",
    rowKey: Date.now().toString(),
    text: clip
  })
}

const App = () => {
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
        <View style={{ marginTop: 20, marginHorizontal: 10, marginBottom: 5 }}>
          <View >
            <Text style={{ fontWeight: "bold", fontSize: 32 }}>✂️ lb-toolkit clipboard</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center" }}>
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
        </View>
        <View style={{ flex: 1 }}>
          <ClipList clips={clips} refreshing={refreshing} updateClips={fetchAndUpdateClips} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
          <TextInput
            style={{ flex: 1 }}
            onChangeText={(ev) => setText(ev)}
            onSubmitEditing={onSubmit}
            value={text}
          />
          <Button
            color="#25262b"
            title="Paste"
            onPress={() => putClipboardInField()}
          />
          <View style={{ width: 10 }} />
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

export default App;

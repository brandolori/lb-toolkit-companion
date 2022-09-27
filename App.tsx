import React, { useEffect, useState } from 'react';
import { AppState, Button, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import ClipList, { DateFilter, pushClip } from './ClipList';
import { Picker } from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';

const App = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("today")
  const [text, setText] = useState("")

  const onSubmit = () => {
    setText("")
    pushClip(text)
  }

  const putClipboardInField = async () => {
    const content = await Clipboard.getString()
    setText(content)
  }


  useEffect(() => {
    putClipboardInField()
    const subscription = AppState.addEventListener("focus", putClipboardInField)
    return () => subscription.remove()
  }, [])

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
          <ClipList dateFilter={dateFilter} />
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
            onPress={() => onSubmit()}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default App;

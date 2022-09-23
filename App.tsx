import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, View, VirtualizedList } from 'react-native';

import Clipboard, { DateFilter } from './Clipboard';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("today")
  const [text, setText] = useState("")

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
          <Clipboard dateFilter={dateFilter} />
        </View>
        <TextInput
          onChangeText={(ev) => setText(ev)}
          value={text}
        />
      </View>
    </SafeAreaView>
  )
}

export default App;

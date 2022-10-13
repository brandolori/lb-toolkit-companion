import React, { useEffect, useState } from "react"
import { SafeAreaView, StatusBar, Text, TextInput, View } from "react-native"
import { getSetting, setSetting, settingStrings } from "./settings"

const Config = () => {

    const settingStates = settingStrings.map(el => {
        const [state, setState] = useState<string>()
        return {
            key: el,
            state,
            setState,
            updateAndSetState: async (value: string) => {
                await setSetting(el, value)
                setState(value)
            }
        }
    })

    useEffect(() => {
        settingStates.forEach(async el => el.setState(await getSetting(el.key)))
    })


    return <SafeAreaView style={{ backgroundColor: "#1a1b1e" }}>
        <StatusBar
            barStyle='light-content'
            backgroundColor="#1a1b1e" />
        <View style={{ height: "100%", marginHorizontal: 10, paddingBottom: 10, marginVertical: 5 }}>
            {settingStates.map(el =>
                <View style={{ paddingVertical: 10 }} key={el.key}>
                    <View>
                        <Text>{el.key}</Text>
                    </View>

                    <TextInput

                        keyboardType="visible-password"
                        style={{
                            borderRadius: 8,
                            padding: 8,
                            backgroundColor: "#25262b"
                        }}
                        onChangeText={el.updateAndSetState}
                        value={el.state}
                    />
                </View>
            )}
        </View>
    </SafeAreaView>
}

export default Config
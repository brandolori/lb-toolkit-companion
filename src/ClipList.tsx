import React from "react"
import { ScrollView, View, Text, TouchableNativeFeedback, ToastAndroid, RefreshControl } from "react-native"
import Clipboard from '@react-native-clipboard/clipboard';

export type Clip = {
    id: string,
    date: string,
    text: string,
    source: "pc" | "phone"
}

export type DateFilter = "today" | "this week" | "this month" | "all"

const subtextColor = "#909296"

type ClipListProps = {
    refreshing: boolean,
    updateClips: () => void,
    clips: Clip[]
}

const showToast = () => {
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
}

export default ({ refreshing, updateClips, clips }: ClipListProps) => {

    return <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={updateClips} />}
    >
        {clips.map(el =>
            <View key={el.id} style={{ marginVertical: 10, borderRadius: 10, overflow: "hidden" }}>

                <TouchableNativeFeedback
                    onPress={() => {
                        Clipboard.setString(el.text)
                        showToast()
                    }}
                    background={TouchableNativeFeedback.Ripple("white", false)}
                    useForeground={true}
                >
                    <View style={{ backgroundColor: "#25262b" }}>
                        <View style={{ margin: 15 }}>

                            <Text style={{ fontSize: 15, color: "white" }} >
                                {el.text.substring(0, 200)}
                                {el.text.length > 200 && "..."}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginVertical: 15 }}>
                            <Text style={{ fontWeight: "bold", color: subtextColor }} >
                                {new Date(el.date).toLocaleString("en-uk")}
                            </Text>
                            <Text style={{ fontWeight: "bold", color: subtextColor }} >
                                {
                                    el.source == "pc"
                                        ? "PC"
                                        : el.source == "phone"
                                            ? "PHONE"
                                            : "UNKNOWN"
                                }
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )}
    </ScrollView >
}
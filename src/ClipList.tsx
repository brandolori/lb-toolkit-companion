import React from "react"
import { ScrollView, View, Text, TouchableNativeFeedback, ToastAndroid, RefreshControl, Linking, StyleSheet } from "react-native"
import Clipboard from '@react-native-clipboard/clipboard'
import { Clip } from "./azureTables"

const showToast = () => {
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
}

const styles = StyleSheet.create({
    scrollView: { marginVertical: 10, borderRadius: 10, overflow: "hidden" },
    clipText: { fontSize: 15, color: "white" },
    clipFooter: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginVertical: 15 },
    clipFooterContent: { fontWeight: "bold", color: "#909296" }
})

type ClipListProps = {
    refreshing: boolean,
    updateClips: () => void,
    clips: Clip[]
}

export default ({ refreshing, updateClips, clips }: ClipListProps) => {

    return <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={updateClips} />}
    >
        {clips.map(el =>
            <View key={el.id} style={styles.scrollView}>

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

                            <Text
                                style={{ ...styles.clipText, textDecorationLine: el.isUrl ? "underline" : "none" }}
                                onPress={el.isUrl ? (() => Linking.openURL(el.text)) : undefined} >
                                {el.text.substring(0, 200)}
                                {el.text.length > 200 && "..."}
                            </Text>
                        </View>
                        <View style={styles.clipFooter}>
                            <Text style={styles.clipFooterContent} >
                                {new Date(el.date).toLocaleString("en-uk")}
                            </Text>
                            <Text style={styles.clipFooterContent} >
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
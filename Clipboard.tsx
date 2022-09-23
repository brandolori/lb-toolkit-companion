import React, { useEffect, useState } from "react"
import { ScrollView, View, Text, useColorScheme, TouchableNativeFeedback, ToastAndroid, RefreshControl } from "react-native"

import { AzureSASCredential, TableClient, odata } from "@azure/data-tables";
import Clipboard from '@react-native-clipboard/clipboard';
import { getTableClient } from "./azureTable";

type ClipSource = "pc" | "phone"

export type DateFilter = "today" | "this week" | "this month" | "all"

type Clip = {
    id: string,
    date: string,
    text: string,
    source: ClipSource
}

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

const subtextColor = "#909296"

export default ({ dateFilter }: { dateFilter: DateFilter }) => {
    const [clips, setClips] = useState<Clip[]>([])
    const [loading, setLoading] = useState(true)

    const updateClips = async () => {
        setLoading(true)
        const data = await fetchClips(dateFilter)
        setClips(data)
        setLoading(false)
    }

    useEffect(() => {
        updateClips()
    }, [dateFilter])

    const showToast = () => {
        ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    };

    return <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={updateClips} />}
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
                                {el.text}
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
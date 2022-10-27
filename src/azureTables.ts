import { AzureSASCredential, odata, TableClient } from "@azure/data-tables"
import { getSetting } from "./settings"

export type DateFilter = "today" | "this week" | "this month" | "all"

export type Clip = {
    id: string,
    date: string,
    text: string,
    source: ClipSource
    isUrl: boolean
}

type ClipSource = "pc" | "phone"

const getTableClient = async () => {
    const account = await getSetting("azureStorageAccount")
    const SASToken = await getSetting("azureSASToken")
    const tableName = await getSetting("azureTableName")
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(SASToken)
    )
}

const fetchClips = async (dateFilter?: DateFilter): Promise<Clip[]> => {
    const days = dateFilter == "today" ? 1 :
        dateFilter == "this week" ? 7 :
            dateFilter == "this month" ? 30 : 100000
    const filterDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000) // 1 days ago

    const data: Clip[] = []
    const client = await getTableClient()
    const lister = client.listEntities({
        queryOptions: {
            filter: odata`Timestamp ge ${filterDate}`,
        }
    })

    for await (const entity of lister) {
        data.push({
            date: entity.timestamp,
            id: entity.rowKey,
            source: entity.partitionKey as ClipSource,
            text: entity.text as string,
            isUrl: entity.isUrl as boolean ?? false
        })
    }

    return data.sort((a, b) => a.date > b.date ? -1 : 1)
}

const pushClip = async (clip: string) => {
    if (!clip)
        return
    const client = await getTableClient()

    let isUrl = false
    try {
        const url = new URL(clip)
        if (url.protocol == "https:" || url.protocol == "http:")
            isUrl = true
    } catch (e) { }

    client.createEntity({
        partitionKey: "phone",
        rowKey: Date.now().toString(),
        text: clip,
        isUrl
    })
}


export { getTableClient, fetchClips, pushClip }
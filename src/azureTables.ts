import { AzureSASCredential, odata, TableClient } from "@azure/data-tables";
import { DateFilter } from "./ClipList";

const getTableClient = () => {
    const account = "lbtoolkitclips"
    const SASToken = "?sv=2021-06-08&ss=t&srt=sco&sp=rwdlacu&se=2099-10-13T16:41:03Z&st=2022-10-13T08:41:03Z&spr=https&sig=S9nw7XCIxhgzNm0oT8y8Co2jGyvtq0MwD3Gva1XpXQw%3D"
    const tableName = "clips"
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(SASToken)
    );

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

const pushClip = async (clip: string) => {
    if (!clip)
        return
    await getTableClient().createEntity({
        partitionKey: "phone",
        rowKey: Date.now().toString(),
        text: clip
    })
}


export { getTableClient, fetchClips, pushClip }
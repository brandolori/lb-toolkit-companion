import { AzureSASCredential, TableClient } from "@azure/data-tables";

const getTableClient = () => {
    const account = "lbtoolkitkeyboard"
    const SASToken = "?sv=2021-06-08&ss=t&srt=sco&sp=rwdlacu&se=2052-09-12T15:48:19Z&st=2022-09-12T07:48:19Z&spr=https&sig=OK5t7De%2B9ElUfVtxC%2BBq0OiZasMbz%2BIbgnidHMBRDYY%3D"
    const tableName = "cpliboard"
    return new TableClient(
        `https://${account}.table.core.windows.net`,
        tableName,
        new AzureSASCredential(SASToken)
    );

}

export { getTableClient }
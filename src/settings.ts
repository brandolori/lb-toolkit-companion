import AsyncStorage from "@react-native-async-storage/async-storage"

export const settingStrings = [
    "azureStorageAccount",
    "azureSASToken",
    "azureTableName",
] as const

export type Setting = typeof settingStrings[number]

export const getSetting = (key: Setting) => AsyncStorage.getItem(key)

export const setSetting = (key: Setting, value: string) => AsyncStorage.setItem(key, value)
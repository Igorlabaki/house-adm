import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN_STORAGE } from "./storage-config";


export async function storageAccessTokenSave(access_token: any){
    await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE, JSON.stringify(access_token))
}

export async function removeAccessTokenSave(){
    await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE)
}

export async function getAccessTokenSave(){
    const storage = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE);


    const access_token = await storage ? JSON.parse(storage) : {};

    return access_token
}
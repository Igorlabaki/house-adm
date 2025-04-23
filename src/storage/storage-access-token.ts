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
    if (!storage) return null;
    
    try {
        return JSON.parse(storage);
    } catch (error) {
        console.error('Erro ao parsear token:', error);
        return null;
    }
}
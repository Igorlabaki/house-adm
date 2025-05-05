import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE } from "./storage-config";
import { User } from "@store/auth/authSlice";


export async function storageUserSave(user: User){
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function removeUserSave(){
    await AsyncStorage.removeItem(USER_STORAGE)
}

export async function getUserSave(){
    const storage = await AsyncStorage.getItem(USER_STORAGE);


    const user = await storage ? JSON.parse(storage) : {};

    return user
}
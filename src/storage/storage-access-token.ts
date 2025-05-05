import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN_STORAGE } from "./storage-config";
import { StoredToken } from "../types/auth.types";

export async function storageAccessTokenSave(tokenData: StoredToken): Promise<void> {
  try {
    if (!tokenData || !tokenData.accessToken || !tokenData.session) {
      throw new Error('Dados do token inválidos');
    }

    await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE, JSON.stringify(tokenData));
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    throw error;
  }
}

export async function removeAccessTokenSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE);
  } catch (error) {
    console.error('Erro ao remover token:', error);
  }
}

export async function getAccessTokenSave(): Promise<StoredToken | null> {
  try {
    const storage = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE);
    if (!storage) return null;

    const tokenData = JSON.parse(storage) as StoredToken;
    return tokenData;
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    await removeAccessTokenSave();
    return null;
  }
}

// Função auxiliar para verificar se é necessário refresh
export async function shouldRefreshToken(): Promise<boolean> {
  try {
    const tokenData = await getAccessTokenSave();
    if (!tokenData) return true;

    const expirationDate = new Date(tokenData.session.expiresAt);
    const now = new Date();
    
    // Retorna true se faltar menos de 5 minutos para expirar
    const fiveMinutes = 5 * 60 * 1000;
    return expirationDate.getTime() - now.getTime() < fiveMinutes;
  } catch {
    return true;
  }
}
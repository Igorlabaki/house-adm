import { api } from './axios';
import { StoredToken } from '../types/auth.types';
import { storageAccessTokenSave, getAccessTokenSave, removeAccessTokenSave } from '../storage/storage-access-token';
import { store } from '../store';
import { NotificationService } from './notificationService';

class AuthService {
  private refreshPromise: Promise<StoredToken | null> | null = null;
  private notificationService = NotificationService.getInstance();

  async authenticate(email: string, password: string): Promise<StoredToken> {
    try {
      const fcmToken = await this.notificationService.getPushToken();
      const payload: any = { email, password };
      if (fcmToken) payload.fcmToken = fcmToken;

      const response = await api.post('/auth/authenticate', payload);

      const tokenData = response.data;
      
      // Validação da estrutura do token antes de salvar
      if (!this.isValidTokenData(tokenData)) {
        throw new Error('Formato de resposta inválido do servidor');
      }

      await storageAccessTokenSave(tokenData);
      return tokenData;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }

  private isValidTokenData(data: any): data is StoredToken {
    return (
      data &&
      typeof data.accessToken === 'string' &&
      data.session &&
      typeof data.session.id === 'string' &&
      typeof data.session.expiresAt === 'string' &&
      typeof data.session.isValid === 'boolean' &&
      data.session.user &&
      typeof data.session.user.id === 'string' &&
      typeof data.session.user.email === 'string' &&
      typeof data.session.user.username === 'string'
    );
  }

  private async refreshToken(currentAccessToken: string): Promise<StoredToken | null> {
    try {
      const response = await api.post<StoredToken>('/auth/refresh', undefined, {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`
        }
      });

      const tokenData = response.data;
      
      if (!this.isValidTokenData(tokenData)) {
        throw new Error('Formato de resposta inválido do servidor');
      }

      await storageAccessTokenSave(tokenData);
      return tokenData;
    } catch (error) {
      await removeAccessTokenSave();
      return null;
    }
  }

  async getValidToken(): Promise<string | null> {
    try {
      const tokenData = await getAccessTokenSave();
      if (!tokenData || !this.isValidTokenData(tokenData)) {
        await removeAccessTokenSave();
        return null;
      }

      // Se a sessão é válida e não está expirada
      const expirationDate = new Date(tokenData.session.expiresAt);
      if (tokenData.session.isValid && expirationDate > new Date()) {
        return tokenData.accessToken;
      }

      // Se já existe um refresh em andamento, aguarda ele
      if (this.refreshPromise) {
        const newTokenData = await this.refreshPromise;
        return newTokenData?.accessToken || null;
      }

      // Inicia novo processo de refresh
      this.refreshPromise = this.refreshToken(tokenData.accessToken);
      const newTokenData = await this.refreshPromise;
      this.refreshPromise = null;
      
      return newTokenData?.accessToken || null;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      this.refreshPromise = null;
      await removeAccessTokenSave();
      return null;
    }
  }

  async logout(): Promise<void> {
    await removeAccessTokenSave();
  }
}

export const authService = new AuthService(); 
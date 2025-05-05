import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SERVER_URL } from '@env';
import { getAccessTokenSave } from '../storage/storage-access-token';

// Get browser
export const api = getAPIClient();

// Get SSR
export function getAPIClient() {
  const api = axios.create({
    baseURL: SERVER_URL?.endsWith('/') ? SERVER_URL.slice(0, -1) : SERVER_URL,
    timeout: 10000
  });

  const publicRoutes = [
    'auth/authenticate'
  ];

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isPublicRoute = publicRoutes.some(route => 
        config.url?.includes(route)
      );

      if (!isPublicRoute) {
        try {
          const tokenData = await getAccessTokenSave();
          if (tokenData?.accessToken) {
            config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
          }
        } catch (error) {
          // Se falhar em obter token válido, deixa a requisição seguir
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (!error.response) {
        return Promise.reject({
          message: 'Erro de conexão com o servidor',
          code: 'NETWORK_ERROR'
        });
      }

      return Promise.reject(error.response);
    }
  );

  return api;
}

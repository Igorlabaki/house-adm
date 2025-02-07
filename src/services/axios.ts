import axios from 'axios';
import { SERVER_URL } from '@env';
import { getAccessTokenSave } from 'storage/storage-access-token';
// Get browser
export const api = getAPIClient();

// Get SSR
export function getAPIClient(ctx?: any) {
  const api = axios.create({
    baseURL: SERVER_URL
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // O servidor respondeu com um status de erro
        return Promise.reject(error.response);
      } else if (error.request) {
        // A solicitação foi feita, mas não recebeu resposta
        return Promise.reject({ error: "Network Error" });
      } else {
        // Algo aconteceu ao configurar a solicitação que desencadeou um erro
        return Promise.reject(error);
      }
    }
  );

  const publicRoutes = [
    'auth/',
  ];

  api.interceptors.request.use(
    async (config) => {
      // Verifica se a rota atual começa com algum dos prefixos públicos
      const isPublicRoute = publicRoutes.some((route) => config.url?.startsWith(route));

      if (!isPublicRoute) {
        const token = await getAccessTokenSave();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
  return api;
}

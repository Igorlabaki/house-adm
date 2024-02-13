import axios from 'axios';

// Get browser
export const api = getAPIClient();

// Get SSR
export function getAPIClient(ctx?: any) {
  const api = axios.create({
    baseURL: process.env.AXIOS_BASE_URL,
  });
/* 
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
  ); */

  return api;
}

import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@chamados:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const urlRequisicao = error.config?.url || '';
      const ehRotaDeLogin = urlRequisicao.includes('/auth/login') || urlRequisicao.includes('/auth/sso/microsoft');
      if (!ehRotaDeLogin && window.location.pathname !== '/login') {
        localStorage.removeItem('@chamados:token');
        localStorage.removeItem('@chamados:user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
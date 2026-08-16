import axios from 'axios';
import { API_URL } from '../utils/constants';
import { secureStorage } from '../utils/storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: 1800000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = secureStorage.getItem('@chamados:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const locale = localStorage.getItem('NEXT_LOCALE') || navigator.language || 'pt-BR';
    config.headers['X-Locale'] = locale;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const urlRequisicao = error.config?.url;
      const ehRotaDeLogin = urlReissuer.includes('/auth/login') || urlRequisicao.includes('/auth/sso/microsoft');
      
      if (!ehRotaDeLogin && window.location.pathname !== '/login') {
        secureStorage.removeItem('@chamados:token');
        secureStorage.removeItem('@chamados:user');
        
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
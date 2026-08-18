import api from './api';

export const authService = {
  async loginSsoMicrosoft(tokenMicrosoft) {
    const { data } = await api.post('/api/auth/sso/microsoft', { tokenMicrosoft });
    return data;
  },

  async verificarSetupStatus() {
    const { data } = await api.get('/api/auth/setup-status');
    return data;
  },

  async setupInicial(dados) {
    const { data } = await api.post('/api/auth/setup-inicial', dados);
    return data;
  },

  async loginCredenciais(email, senha) {
    const { data } = await api.post('/api/auth/login', { email, senha });
    return data;
  },

  async obterUsuarioAtual() {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};
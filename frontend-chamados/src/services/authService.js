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
    try {
      const { data } = await api.post('/api/auth/login', { email, senha });
      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const mensagemErro = error.response.data.error || 'Credenciais inválidas.';
        
        throw new Error(mensagemErro);
      }
      throw new Error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  },

  async obterUsuarioAtual() {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};
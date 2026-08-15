import api from './api';

export const ssoRegrasService = {
  async listar({ page = 1, limit = 10, busca = '' } = {}) {
    const { data } = await api.get('/api/sso', {
      params: { page, limit, busca }
    });
    return data;
  },
  async criar(dados) {
    const { data } = await api.post('/api/sso', dados);
    return data;
  },
  async deletar(id) {
    await api.delete(`/api/sso/${id}`);
  }
};
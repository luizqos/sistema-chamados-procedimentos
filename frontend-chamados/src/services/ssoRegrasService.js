import api from './api';

export const ssoRegrasService = {
  async listar() {
    const { data } = await api.get('/api/sso');
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
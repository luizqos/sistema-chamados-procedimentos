import api from './api';

export const procedimentoService = {
  async listar({ busca = '', page = 1, limit = 15 } = {}) {
    const { data } = await api.get('/api/procedimentos', {
      params: { busca, page, limit }
    });
    return data;
  },

  async obterPorId(id) {
    const { data } = await api.get(`/api/procedimentos/${id}`);
    return data;
  },

  async criar(dados) {
    const { data } = await api.post('/api/procedimentos', dados);
    return data;
  },

  async deletar(id) {
    const { data } = await api.delete(`/api/procedimentos/${id}`);
    return data;
  },

  async enviarAnexo(procedimentoId, arquivo) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const { data } = await api.post(`/api/procedimentos/${procedimentoId}/anexos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
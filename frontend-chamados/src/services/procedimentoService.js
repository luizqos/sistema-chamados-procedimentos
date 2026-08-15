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

  async enviarAnexo(procedimentoId, arquivo, onProgress) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const { data } = await api.post(`/api/procedimentos/${procedimentoId}/anexos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 1800000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            percent: percentCompleted,
            loaded: progressEvent.loaded,
            total: progressEvent.total
          });
        }
      }
    });
    return data;
  },

  async atualizarProcedimento(id, dados) {
    const response = await api.put(`/api/procedimentos/${id}`, dados);
    return response.data;
  }


};
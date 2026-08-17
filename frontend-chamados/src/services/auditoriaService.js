import api from './api';

export const auditoriaService = {
  async listar({ page = 1, limit = 15, busca = '' } = {}) {
    const { data } = await api.get('/api/auditoria', {
      params: { page, limit, busca }
    });
    return data;
  }
};
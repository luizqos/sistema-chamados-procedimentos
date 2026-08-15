import api from './api';

export const procedimentoPermissaoService = {
  async listarPermissoes(procedimentoId) {
    const response = await api.get(`/api/procedimentoPermissoes/${procedimentoId}/permissoes`);
    return response.data;
  },

  async salvarPermissao(procedimentoId, usuarioId, nivel) {
    const response = await api.post(`/api/procedimentoPermissoes/${procedimentoId}/permissoes`, {
      usuarioId: Number(usuarioId),
      nivel
    });
    return response.data;
  },

  async removerPermissao(procedimentoId, usuarioId) {
    const response = await api.delete(`/api/procedimentoPermissoes/${procedimentoId}/permissoes/${usuarioId}`);
    return response.data;
  }
};
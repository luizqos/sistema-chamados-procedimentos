import api from './api';

export const usuarioService = {
  async listar() {
    const { data } = await api.get('/api/usuarios');
    return data;
  },
  async criar(dados) {
    const { data } = await api.post('/api/usuarios', dados);
    return data;
  },
  async atualizar(id, dados) {
    const { data } = await api.put(`/api/usuarios/${id}`, dados);
    return data;
  },
  async alterarRole(usuarioId, roleId) {
    const { data } = await api.patch(`/api/usuarios/${usuarioId}/role`, { roleId });
    return data;
  },
  async alternarStatus(usuarioId, ativo) {
    const { data } = await api.patch(`/api/usuarios/${usuarioId}/status`, { ativo });
    return data;
  }
};
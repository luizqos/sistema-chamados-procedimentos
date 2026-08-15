const permissaoRepository = require('../repositories/permissaoRepository');

class PermissaoService {
  async listar(procedimentoId) {
    return await permissaoRepository.listarPorProcedimento(procedimentoId);
  }

  async concederOuAtualizar(procedimentoId, usuarioId, nivel) {
    if (!['VISUALIZAR', 'EDITAR'].includes(nivel)) {
      const error = new Error('Nível de permissão inválido.');
      error.statusCode = 400;
      throw error;
    }
    return await permissaoRepository.salvar(procedimentoId, usuarioId, nivel);
  }

  async remover(procedimentoId, usuarioId) {
    return await permissaoRepository.deletar(procedimentoId, usuarioId);
  }

  async concederOuAtualizarEmLote(procedimentoId, usuariosIds, nivel) {
  if (!['VISUALIZAR', 'EDITAR'].includes(nivel)) {
    const error = new Error('Nível de permissão inválido.');
    error.statusCode = 400;
    throw error;
  }
  if (!Array.isArray(usuariosIds) || usuariosIds.length === 0) {
    const error = new Error('Selecione ao menos um usuário.');
    error.statusCode = 400;
    throw error;
  }
  return await permissaoRepository.salvarMuitos(procedimentoId, usuariosIds, nivel);
}
}

module.exports = new PermissaoService();
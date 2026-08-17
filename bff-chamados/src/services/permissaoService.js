const permissaoRepository = require('../repositories/permissaoRepository');
const auditoriaService = require('./auditoriaService');

class PermissaoService {
  async listar(procedimentoId) {
    return await permissaoRepository.listarPorProcedimento(procedimentoId);
  }

  async concederOuAtualizar(procedimentoId, usuarioId, nivel, usuarioLogado) {
    if (!['VISUALIZAR', 'EDITAR'].includes(nivel)) {
      const error = new Error('Nível de permissão inválido.');
      error.statusCode = 400;
      throw error;
    }

    const permissaoAntiga = await permissaoRepository.verificarPermissaoUsuario(procedimentoId, usuarioId);
    const resultado = await permissaoRepository.salvar(procedimentoId, usuarioId, nivel);

    const acaoLog = permissaoAntiga ? 'UPDATE' : 'CREATE';
    await auditoriaService.registrarLog(usuarioLogado, acaoLog, 'ProcedimentoPermissao', `${procedimentoId}-${usuarioId}`, permissaoAntiga, resultado);

    return resultado;
  }

  async remover(procedimentoId, usuarioId, usuarioLogado) {
    const permissaoAntiga = await permissaoRepository.verificarPermissaoUsuario(procedimentoId, usuarioId);
    const resultado = await permissaoRepository.deletar(procedimentoId, usuarioId);

    await auditoriaService.registrarLog(usuarioLogado, 'DELETE', 'ProcedimentoPermissao', `${procedimentoId}-${usuarioId}`, permissaoAntiga, null);

    return resultado;
  }

  async concederOuAtualizarEmLote(procedimentoId, usuariosIds, nivel, usuarioLogado) {
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

    const resultado = await permissaoRepository.salvarMuitos(procedimentoId, usuariosIds, nivel);

    await auditoriaService.registrarLog(usuarioLogado, 'UPDATE', 'ProcedimentoPermissaoLote', procedimentoId, null, { usuariosIds, nivel });

    return resultado;
  }
}

module.exports = new PermissaoService();
const auditoriaRepository = require('../repositories/auditoriaRepository');

class AuditoriaService {
  async registrarLog(usuarioLogado, acao, entidade, registro_id, dados_antigos = null, dados_novos = null) {
    try {
      await auditoriaRepository.criar({
        usuario_id: usuarioLogado?.id || null,
        acao: acao.toUpperCase(),
        entidade,
        registro_id,
        dados_antigos,
        dados_novos
      });
    } catch (error) {
      console.error('Falha silenciosa ao registrar auditoria:', error.message);
    }
  }

  async listarLogs(page, limit, busca) {
    return await auditoriaRepository.listarPaginado(page, limit, busca);
  }
}

module.exports = new AuditoriaService();
const permissaoService = require('../services/permissaoService');

class PermissaoController {
  async listar(req, res) {
    try {
      const { procedimentoId } = req.params;
      const permissoes = await permissaoService.listar(procedimentoId);
      return res.json(permissoes);
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao listar permissões.' });
    }
  }

  async salvar(req, res) {
    try {
      const { procedimentoId } = req.params;
      const { usuarioId, nivel } = req.body;
      const resultado = await permissaoService.concederOuAtualizar(procedimentoId, usuarioId, nivel);
      return res.status(201).json(resultado);
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao salvar permissão.' });
    }
  }

  async deletar(req, res) {
    try {
      const { procedimentoId, usuarioId } = req.params;
      await permissaoService.remover(procedimentoId, usuarioId);
      return res.status(204).send();
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao remover permissão.' });
    }
  }

  async salvarLote(req, res) {
    try {
      const { procedimentoId } = req.params;
      const { usuariosIds, nivel } = req.body;
      const resultado = await permissaoService.concederOuAtualizarEmLote(procedimentoId, usuariosIds, nivel);
      return res.status(201).json(resultado);
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao salvar permissões.' });
    }
  }
}

module.exports = new PermissaoController();
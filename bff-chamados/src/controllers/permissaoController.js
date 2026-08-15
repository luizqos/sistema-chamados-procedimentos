const permissaoService = require('../services/permissaoService');

class PermissaoController {
  async listar(req, res) {
    try {
      const { id } = req.params;
      const permissoes = await permissaoService.listar(id);
      return res.json(permissoes);
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao listar permissões.' });
    }
  }

  async salvar(req, res) {
    try {
      const { id } = req.params;
      const { usuarioId, nivel } = req.body;
      const resultado = await permissaoService.concederOuAtualizar(id, usuarioId, nivel);
      return res.status(201).json(resultado);
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao salvar permissão.' });
    }
  }

  async deletar(req, res) {
    try {
      const { id, usuarioId } = req.params;
      await permissaoService.remover(id, usuarioId);
      return res.status(204).send();
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({ error: err.message || 'Erro ao remover permissão.' });
    }
  }
}

module.exports = new PermissaoController();
const usuarioService = require('../services/usuarioService');

class UsuarioController {
  async criar(req, res) {
    try {
      const novoUsuario = await usuarioService.criarUsuario(req.body);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Erro interno ao cadastrar usuário.' });
    }
  }

  async listar(req, res) {
    try {
      const { page = 1, limit = 10, busca = '' } = req.query;
      const resultado = await usuarioService.listarUsuarios(
        Number(page),
        Number(limit),
        busca
      );
      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizarRole(req, res) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;
      const usuarioAtualizado = await usuarioService.alterarRole(id, roleId);
      return res.json(usuarioAtualizado);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async alternarStatus(req, res) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;
      const usuarioLogadoId = req.usuario.id;

      const usuario = await usuarioService.alterarStatusUsuario(id, ativo, usuarioLogadoId);
      return res.json(usuario);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuarioAtualizado = await usuarioService.atualizar(id, req.body);
      return res.json(usuarioAtualizado);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Erro ao atualizar usuário.' });
    }
  }
}

module.exports = new UsuarioController();
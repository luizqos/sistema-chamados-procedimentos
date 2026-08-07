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
      const usuarios = await usuarioService.listarUsuarios();
      return res.json(usuarios);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
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
}

module.exports = new UsuarioController();
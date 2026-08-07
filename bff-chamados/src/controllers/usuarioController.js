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
}

module.exports = new UsuarioController();
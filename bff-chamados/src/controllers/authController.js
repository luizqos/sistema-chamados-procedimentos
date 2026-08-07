const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.autenticar({ email, senha });
      return res.status(200).json(resultado);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Erro interno ao autenticar.' });
    }
  }

  async me(req, res) {
    try {
      const usuario = await authService.me(req.usuario.id);
      return res.status(200).json(usuario);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message || 'Erro ao obter dados do perfil.' });
    }
  }
}

module.exports = new AuthController();
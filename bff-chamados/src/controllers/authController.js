const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.login(email, senha);
      return res.json(resultado);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async me(req, res) {
    try {
      const usuarioId = req.user.id;
      const usuario = await usuarioRepository.buscarPorId(usuarioId);

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({ error: 'Sessão inválida ou usuário inativo.' });
      }

      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
    }
  }

  async verificarSetup(req, res) {
    try {
      const status = await authService.verificarStatusSistema();
      return res.json(status);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async setupInicial(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const admin = await authService.cadastrarAdminInicial({ nome, email, senha });
      return res.status(201).json(admin);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
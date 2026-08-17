const ssoService = require('../services/ssoService');
const authService = require('../services/authService');

class SsoController {
  async loginMicrosoft(req, res) {
    try {
      const { tokenMicrosoft } = req.body;

      if (!tokenMicrosoft) {
        return res.status(400).json({ error: 'Token da Microsoft não fornecido.' });
      }

      const usuario = await ssoService.autenticarMicrosoft(tokenMicrosoft);

      const permissoesChaves = usuario.role?.permissoes
        ? usuario.role.permissoes.map((p) => p.permissao?.chave || p.chave).filter(Boolean)
        : [];

      const usuarioFormatado = {
        id: usuario.id,
        nome: usuario.nome || usuario.email,
        email: usuario.email,
        role: {
          id: usuario.role?.id,
          nome: usuario.role?.nome || 'OPERADOR',
        },
        permissoes: permissoesChaves,
      };

      const token = authService.gerarTokenInterno(usuarioFormatado);

      return res.json({
        token,
        usuario: usuarioFormatado,
      });
    } catch (error) {
      console.error('Erro no controller SSO:', error);

      const statusCode = error.message.includes('Acesso negado') || error.message.includes('bloqueado') ? 403 : 500;
      return res.status(statusCode).json({ error: error.message || 'Erro ao processar SSO.' });
    }
  }

  async listar(req, res) {
    try {
      const { page = 1, limit = 10, busca = '' } = req.query;
      const resultado = await ssoService.listarRegrasPaginadas(
        Number(page),
        Number(limit),
        busca
      );
      return res.json(resultado);
    } catch (err) {
      return res.status(500).json({ error: 'Erro interno ao buscar as regras de SSO.' });
    }
  }

  async criar(req, res) {
    try {
      const regra = await ssoService.criarRegra(req.body, req.usuario);
      res.status(201).json(regra);
    } catch (err) {
      if (err.message.includes('Já existe') || err.message.includes('obrigatórios')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Erro interno ao criar a regra de SSO.' });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await ssoService.deletarRegra(id, req.usuario);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Erro interno ao deletar a regra de SSO.' });
    }
  }
}

module.exports = new SsoController();
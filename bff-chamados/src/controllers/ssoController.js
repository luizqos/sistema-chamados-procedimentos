const ssoService = require('../services/ssoService');
const authService = require('../services/authService');

async function loginMicrosoft(req, res) {
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
    return res.status(500).json({ error: error.message || 'Erro ao processar SSO.' });
  }
}

module.exports = { loginMicrosoft };
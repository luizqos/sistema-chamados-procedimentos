const jwt = require('jsonwebtoken');
const ssoRepository = require('../repositories/ssoRepository');
const authService = require('./authService');

class SsoService {
  async autenticarMicrosoft(tokenMicrosoft) {
    const payload = await this.validarTokenMicrosoft(tokenMicrosoft);

    const ssoId = payload.sub || payload.oid;
    const email = (payload.email || payload.preferred_username || '').toLowerCase();
    const nome = payload.name || payload.given_name || email.split('@')[0];

    if (!ssoId || !email) {
      throw new Error('Não foi possível identificar o usuário nos dados fornecidos pelo SSO.');
    }

    let usuario = await ssoRepository.buscarPorSsoId(ssoId);

    if (!usuario) {
      usuario = await ssoRepository.buscarPorEmail(email);

      if (usuario) {
        usuario = await ssoRepository.vincularSsoId(usuario.id, ssoId);
      }
    }

    if (usuario) {
      if (usuario.ativo === false) {
        throw new Error('Acesso restrito. Entre em contato com o administrador do sistema.');
      }
      return usuario;
    }

    const rolePadrao = await ssoRepository.buscarRolePorNome('OPERADOR');
    
    if (!rolePadrao) {
      throw new Error('Role padrão OPERADOR não encontrada no banco de dados.');
    }

    return await ssoRepository.criarUsuarioSso({
      nome,
      email,
      ssoId,
      roleId: rolePadrao.id
    });
  }

  async validarTokenMicrosoft(token) {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new Error('Token da Microsoft inválido ou malformatado.');
    }
    return decoded;
  }
}

module.exports = new SsoService();
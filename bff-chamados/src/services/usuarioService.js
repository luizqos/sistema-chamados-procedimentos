const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');

class UsuarioService {
  async criarUsuario({ nome, email, senha, roleId, ssoId }) {
    if (!nome || !email || (!senha && !ssoId)) {
      const error = new Error('Nome, e-mail e uma forma de autenticação (senha ou ssoId) são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      const error = new Error('Este e-mail já está cadastrado.');
      error.statusCode = 400;
      throw error;
    }

    let roleIdFinal = roleId;

    if (!roleIdFinal) {
      const rolePadrao = await usuarioRepository.buscarRolePorNome('OPERADOR');
      if (!rolePadrao) {
        const error = new Error('Role padrão OPERADOR não foi encontrada no banco de dados.');
        error.statusCode = 500;
        throw error;
      }
      roleIdFinal = rolePadrao.id;
    }

    const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;

    return await usuarioRepository.criar({
      nome,
      email,
      senha: senhaHash,
      ssoId: ssoId || null,
      roleId: Number(roleIdFinal),
    });
  }
}

module.exports = new UsuarioService();
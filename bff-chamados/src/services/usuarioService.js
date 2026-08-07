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

  async listarUsuarios() {
    return await usuarioRepository.listarTodos();
  }

  async alterarRole(usuarioId, roleId) {
    if (!usuarioId || !roleId) {
      const error = new Error('ID do usuário e ID do perfil são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioExiste = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuarioExiste) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return await usuarioRepository.atualizarRole(usuarioId, roleId);
  }

  async alterarStatusUsuario(id, ativo, usuarioLogadoId) {
    if (Number(id) === Number(usuarioLogadoId) && !ativo) {
      const error = new Error('Você não pode desativar sua própria conta.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioExiste = await usuarioRepository.buscarPorId(id);
    if (!usuarioExiste) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return await usuarioRepository.alternarStatus(id, ativo);
  }
}

module.exports = new UsuarioService();
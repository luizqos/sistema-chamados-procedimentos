const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');

class UsuarioService {
  async criarUsuario({ nome, email, senha, role }) {
    if (!nome || !email || !senha) {
      const error = new Error('Nome, e-mail e senha são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      const error = new Error('Este e-mail já está cadastrado.');
      error.statusCode = 400;
      throw error;
    }

    const roleFinal = role === 'ADMIN' ? 'ADMIN' : 'OPERADOR';

    const senhaHash = await bcrypt.hash(senha, 10);

    return await usuarioRepository.criar({
      nome,
      email,
      senha: senhaHash,
      role: roleFinal,
    });
  }
}

module.exports = new UsuarioService();
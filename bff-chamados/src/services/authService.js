const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');

class AuthService {
  async autenticar({ email, senha }) {
    if (!email || !senha) {
      const error = new Error('E-mail e senha são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      const error = new Error('Credenciais inválidas.');
      error.statusCode = 401;
      throw error;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      const error = new Error('Credenciais inválidas.');
      error.statusCode = 401;
      throw error;
    }

    const secret = process.env.JWT_SECRET || 'chave_secreta_padrao';
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        nome: usuario.nome,
      },
      secret,
      { expiresIn: '8h' }
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
      token,
    };
  }

  async login(email, senha) {
    const usuario = await usuarioRepository.buscarPorEmailComPermissoes(email);

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      const error = new Error('Credenciais inválidas.');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role.nome },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: this._formatarRetornoUsuario(usuario),
    };
  }

  async me(usuarioId) {
    const usuario = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuario) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return usuario;
  }

  async obterSessao(usuarioId) {
    const usuario = await usuarioRepository.buscarPorIdComPermissoes(usuarioId);

    if (!usuario) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return this._formatarRetornoUsuario(usuario);
  }

  _formatarRetornoUsuario(usuario) {
    const permissoesArray = usuario.role?.permissoes
      ? usuario.role.permissoes.map((item) => item.permissao.chave)
      : [];

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: {
        id: usuario.role.id,
        nome: usuario.role.nome,
      },
      permissoes: permissoesArray,
    };
  }
}

module.exports = new AuthService();
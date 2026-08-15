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
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    await usuarioRepository.atualizarDataUltimoLogin(usuario.id);
    
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

  async verificarStatusSistema() {
    const totalAdmins = await usuarioRepository.contarAdmins();
    return {
      precisaSetupInicial: totalAdmins === 0
    };
  }

  async cadastrarAdminInicial({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      const error = new Error('Nome, e-mail e senha são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const totalAdmins = await usuarioRepository.contarAdmins();
    if (totalAdmins > 0) {
      const error = new Error('Acesso negado: O sistema já possui um administrador cadastrado.');
      error.statusCode = 403;
      throw error;
    }

    const roleAdmin = await usuarioRepository.buscarRolePorNome('ADMIN');
    if (!roleAdmin) {
      const error = new Error('Role ADMIN não encontrada no banco de dados. Execute a seed de roles.');
      error.statusCode = 500;
      throw error;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await usuarioRepository.criar({
      nome,
      email,
      senha: senhaHash,
      roleId: roleAdmin.id
    });
  }

  gerarTokenInterno(usuario) {
    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role?.nome || usuario.role || 'OPERADOR',
    };

    const secret = process.env.JWT_SECRET || 'sua_chave_secreta';

    return jwt.sign(payload, secret, {
      expiresIn: '8h',
    });
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
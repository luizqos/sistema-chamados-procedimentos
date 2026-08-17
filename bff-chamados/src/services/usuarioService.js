const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuarioRepository');
const auditoriaService = require('./auditoriaService'); 

class UsuarioService {
  async criarUsuario({ nome, email, senha, roleId, ssoId }, usuarioLogado) {
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
    const novoUsuario = await usuarioRepository.criar({
      nome,
      email,
      senha: senhaHash,
      ssoId: ssoId || null,
      roleId: Number(roleIdFinal),
    });

    const { senha: _, ...dadosParaLog } = novoUsuario;
    await auditoriaService.registrarLog(usuarioLogado, 'CREATE', 'Usuario', novoUsuario.id, null, dadosParaLog);

    return novoUsuario;
  }

  async listarUsuarios(page = 1, limit = 10, busca = '') {
    return await usuarioRepository.listarPaginado(page, limit, busca);
  }

  async alterarRole(usuarioId, roleId, usuarioLogado) {
    if (!usuarioId || !roleId) {
      const error = new Error('ID do usuário e ID do perfil são obrigatórios.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioAntigo = await usuarioRepository.buscarPorId(usuarioId);
    if (!usuarioAntigo) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const usuarioAtualizado = await usuarioRepository.atualizarRole(usuarioId, roleId);

    const { senha: _, ...dadosAntigosSeguros } = usuarioAntigo;
    const { senha: __, ...dadosNovosSeguros } = usuarioAtualizado;
    
    await auditoriaService.registrarLog(usuarioLogado, 'UPDATE', 'Usuario', usuarioId, dadosAntigosSeguros, dadosNovosSeguros);

    return usuarioAtualizado;
  }

  async alterarStatusUsuario(id, ativo, usuarioLogadoId, usuarioLogadoObj) {
    if (Number(id) === Number(usuarioLogadoId) && !ativo) {
      const error = new Error('Você não pode desativar sua própria conta.');
      error.statusCode = 400;
      throw error;
    }

    const usuarioAntigo = await usuarioRepository.buscarPorId(id);
    if (!usuarioAntigo) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const usuarioAtualizado = await usuarioRepository.alternarStatus(id, ativo);

    const { senha: _, ...dadosAntigosSeguros } = usuarioAntigo;
    const { senha: __, ...dadosNovosSeguros } = usuarioAtualizado;

    await auditoriaService.registrarLog(usuarioLogadoObj, 'UPDATE', 'Usuario', id, dadosAntigosSeguros, dadosNovosSeguros);

    return usuarioAtualizado;
  }

  async atualizar(id, dados, usuarioLogado) {
    const idNum = Number(id);
    const usuarioAntigo = await usuarioRepository.buscarPorId(idNum);

    if (!usuarioAntigo) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    if (dados.email && dados.email !== usuarioAntigo.email) {
      if (usuarioAntigo.ultimo_login !== null && usuarioAntigo.ultimo_login !== undefined) {
        const error = new Error('O e-mail não pode mais ser alterado pois este usuário já realizou login no sistema.');
        error.statusCode = 400;
        throw error;
      }
      const emailEmUso = await usuarioRepository.buscarPorEmail(dados.email);
      if (emailEmUso && Number(emailEmUso.id) !== idNum) {
        const error = new Error('Este e-mail já está em uso por outro usuário.');
        error.statusCode = 400;
        throw error;
      }
    }

    const dadosParaAtualizar = {
      nome: dados.nome,
      email: dados.email,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : undefined,
      roleId: dados.roleId ? Number(dados.roleId) : undefined,
    };

    if (dados.senha && dados.senha.trim() !== '') {
      dadosParaAtualizar.senha = await bcrypt.hash(dados.senha, 10);
    }

    const usuarioAtualizado = await usuarioRepository.atualizarUsuario(idNum, dadosParaAtualizar);

    const { senha: _, ...dadosAntigosSeguros } = usuarioAntigo;
    const { senha: __, ...dadosNovosSeguros } = usuarioAtualizado;

    await auditoriaService.registrarLog(usuarioLogado, 'UPDATE', 'Usuario', idNum, dadosAntigosSeguros, dadosNovosSeguros);

    return usuarioAtualizado;
  }
}

module.exports = new UsuarioService();
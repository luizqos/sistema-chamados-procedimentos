const ssoRepository = require('../repositories/ssoRepository');
const jwt = require('jsonwebtoken');

class SsoService {
  async autenticarMicrosoft(tokenMicrosoft) {
    const payload = await this.validarTokenMicrosoft(tokenMicrosoft);

    const ssoId = payload.sub || payload.oid;
    const email = (payload.email || payload.preferred_username || '').toLowerCase();
    const nome = payload.name || payload.given_name || email.split('@')[0];

    if (!ssoId || !email) {
      throw new Error('Não foi possível identificar o usuário nos dados fornecidos pelo SSO.');
    }

    const userDomain = email.split('@')[1];
    const regras = await ssoRepository.buscarRegrasAplicaveis(email, userDomain);

    const emailBloqueado = regras.find(r => r.tipo === 'EMAIL' && r.acao === 'BLOQUEAR');
    if (emailBloqueado) {
      throw new Error('Acesso negado: Seu e-mail foi bloqueado pelo administrador.');
    }

    const dominioBloqueado = regras.find(r => r.tipo === 'DOMINIO' && r.acao === 'BLOQUEAR');
    if (dominioBloqueado) {
      throw new Error(`Acesso negado: O domínio @${userDomain} está temporariamente bloqueado.`);
    }

    const exigePermissao = await ssoRepository.oSistemaExigePermissaoExplicita();

    if (exigePermissao) {
      const temPermissao = regras.find(r => r.acao === 'PERMITIR');
      if (!temPermissao) {
        throw new Error(`Acesso negado: O domínio @${userDomain} ou seu e-mail não possuem permissão explícita para entrar no sistema.`);
      }
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
    try {
      const decoded = jwt.decode(token);
      if (!decoded) throw new Error();
      return decoded;
    } catch (err) {
      throw new Error('Token da Microsoft inválido ou malformatado.');
    }
  }

  async listarRegras() {
    return await ssoRepository.listarRegras();
  }

  async criarRegra(dados) {
    const { tipo, valor, acao } = dados;

    if (!tipo || !valor || !acao) {
      throw new Error('Os campos tipo, valor e ação são obrigatórios.');
    }

    try {
      const valorNormalizado = valor.toLowerCase().trim();

      return await ssoRepository.criarRegra({
        tipo,
        valor: valorNormalizado,
        acao
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new Error('Já existe uma regra cadastrada para este valor.');
      }
      throw err;
    }
  }

  async deletarRegra(id) {
    if (!id) throw new Error('O ID da regra é obrigatório.');
    return await ssoRepository.deletarRegra(id);
  }

  async listarRegrasPaginadas(page = 1, limit = 10, busca = '') {
    return await ssoRepository.listarPaginado(page, limit, busca);
  }
}

module.exports = new SsoService();
const prisma = require('../config/prisma');

class SsoRepository {
  get includeRoleEPermissoes() {
    return {
      role: {
        include: {
          permissoes: {
            include: {
              permissao: true,
            },
          },
        },
      },
    };
  }

  async buscarPorSsoId(ssoId) {
    return await prisma.usuario.findUnique({
      where: { ssoId },
      include: this.includeRoleEPermissoes,
    });
  }

  async buscarPorEmail(email) {
    return await prisma.usuario.findFirst({
      where: { email: { equals: email.toLowerCase() } },
      include: this.includeRoleEPermissoes,
    });
  }

  async vincularSsoId(usuarioId, ssoId) {
    return await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { ssoId },
      include: this.includeRoleEPermissoes,
    });
  }

  async criarUsuarioSso({ nome, email, ssoId, roleId }) {
    return await prisma.usuario.create({
      data: {
        nome,
        email: email.toLowerCase(),
        ssoId,
        roleId: Number(roleId),
        senha: null,
      },
      include: this.includeRoleEPermissoes,
    });
  }

  async buscarRolePorNome(nome) {
    return await prisma.role.findFirst({
      where: { nome },
    });
  }

  async buscarRegrasAplicaveis(email, dominio) {
    return await prisma.ssoRegra.findMany({
      where: {
        OR: [
          { tipo: 'EMAIL', valor: email.toLowerCase() },
          { tipo: 'DOMINIO', valor: dominio.toLowerCase() }
        ]
      }
    });
  }

  async oSistemaExigePermissaoExplicita() {
    const total = await prisma.ssoRegra.count({
      where: { acao: 'PERMITIR' }
    });
    return total > 0;
  }

  async listarRegras() {
    return await prisma.ssoRegra.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async criarRegra(dados) {
    return await prisma.ssoRegra.create({
      data: {
        tipo: dados.tipo,
        valor: dados.valor.toLowerCase(),
        acao: dados.acao
      }
    });
  }

  async deletarRegra(id) {
    return await prisma.ssoRegra.delete({
      where: { id: Number(id) }
    });
  }

  async listarPaginado(page = 1, limit = 10, busca = '') {
    const skip = (page - 1) * limit;

    const where = busca ? {
      valor: { contains: busca, mode: 'insensitive' }
    } : {};

    const [dados, total] = await Promise.all([
      prisma.ssoRegra.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.ssoRegra.count({ where })
    ]);

    return {
      dados,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page)
    };
  }
}

module.exports = new SsoRepository();
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
}

module.exports = new SsoRepository();
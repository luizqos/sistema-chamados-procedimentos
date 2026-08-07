const prisma = require('../config/prisma');

class UsuarioRepository {
  async buscarPorEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async buscarPorEmailComPermissoes(email) {
    return await prisma.usuario.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissoes: {
              include: {
                permissao: true,
              },
            },
          },
        },
      },
    });
  }

  async buscarRolePorNome(nome) {
    return await prisma.role.findUnique({
      where: { nome },
    });
  }

  async buscarPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async buscarPorIdComPermissoes(id) {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        role: {
          include: {
            permissoes: {
              include: {
                permissao: true,
              },
            },
          },
        },
      },
    });
  }

  async criar(dados) {
    return await prisma.usuario.create({
      data: dados,
      select: {
        id: true,
        nome: true,
        email: true,
        ssoId: true,
        created_at: true,
        role: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
  }
}

module.exports = new UsuarioRepository();
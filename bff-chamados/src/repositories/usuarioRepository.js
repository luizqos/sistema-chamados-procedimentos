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
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        ultimo_login: true, // <-- Adicionado para permitir a validação na service
        role: true,
        created_at: true,
      },
    });
  }

  async contarUsuarios() {
    return await prisma.usuario.count();
  }

  async contarAdmins() {
    return await prisma.usuario.count({
      where: {
        role: {
          nome: 'ADMIN'
        }
      }
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

  async listarTodos() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        ultimo_login: true,
        created_at: true,
        role: {
          select: { id: true, nome: true }
        }
      },
      orderBy: { id: 'asc' }
    });
  }

  async alternarStatus(id, ativo) {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: { ativo: Boolean(ativo) },
      select: {
        id: true,
        nome: true,
        ativo: true,
        role: { select: { id: true, nome: true } }
      }
    });
  }

  async atualizarRole(usuarioId, roleId) {
    return await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { roleId: Number(roleId) },
      select: {
        id: true,
        nome: true,
        email: true,
        role: {
          select: { id: true, nome: true }
        }
      }
    });
  }

  async atualizarDataUltimoLogin(id) {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: { ultimo_login: new Date() },
    });
  }

  async atualizarUsuario(id, dados) {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: dados,
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        role: {
          select: { id: true, nome: true }
        }
      }
    });
  }

  async listarPaginado(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [dados, total] = await Promise.all([
      prisma.usuario.findMany({
        skip,
        take: Number(limit),
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          created_at: true,
          ultimo_login: true,
          role: { select: { id: true, nome: true } }
        },
        orderBy: { id: 'asc' }
      }),
      prisma.usuario.count()
    ]);

    return {
      dados,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    };
  }
}

module.exports = new UsuarioRepository();
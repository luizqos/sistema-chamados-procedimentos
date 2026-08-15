const prisma = require('../config/prisma');

class PermissaoRepository {
  async listarPorProcedimento(procedimentoId) {
    return await prisma.procedimentoPermissao.findMany({
      where: { procedimentoId: Number(procedimentoId) },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true }
        }
      }
    });
  }

  async salvar(procedimentoId, usuarioId, nivel) {
    return await prisma.procedimentoPermissao.upsert({
      where: {
        procedimentoId_usuarioId: {
          procedimentoId: Number(procedimentoId),
          usuarioId: Number(usuarioId)
        }
      },
      update: { nivel },
      create: {
        procedimentoId: Number(procedimentoId),
        usuarioId: Number(usuarioId),
        nivel
      }
    });
  }

  async deletar(procedimentoId, usuarioId) {
    return await prisma.procedimentoPermissao.delete({
      where: {
        procedimentoId_usuarioId: {
          procedimentoId: Number(procedimentoId),
          usuarioId: Number(usuarioId)
        }
      }
    });
  }

  async verificarPermissaoUsuario(procedimentoId, usuarioId) {
    return await prisma.procedimentoPermissao.findUnique({
      where: {
        procedimentoId_usuarioId: {
          procedimentoId: Number(procedimentoId),
          usuarioId: Number(usuarioId)
        }
      }
    });
  }

  async salvarMuitos(procedimentoId, usuariosIds, nivel) {
    const operacoes = usuariosIds.map(usuarioId =>
      prisma.procedimentoPermissao.upsert({
        where: {
          procedimentoId_usuarioId: {
            procedimentoId: Number(procedimentoId),
            usuarioId: Number(usuarioId)
          }
        },
        update: { nivel },
        create: {
          procedimentoId: Number(procedimentoId),
          usuarioId: Number(usuarioId),
          nivel
        }
      })
    );
    return await prisma.$transaction(operacoes);
  }
}

module.exports = new PermissaoRepository();
const prisma = require('../config/prisma');

class ProcedimentoRepository {
  async listar({ busca, page = 1, limit = 15 }) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 15;
    const skip = (parsedPage - 1) * parsedLimit;

    const where = busca ? {
      OR: [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
      ]
    } : {};

    const [items, total] = await Promise.all([
      prisma.procedimento.findMany({
        where,
        skip,
        take: parsedLimit,
        orderBy: { id: 'desc' },
        include: {
          usuario: {
            select: { id: true, nome: true, email: true }
          }
        }
      }),
      prisma.procedimento.count({ where })
    ]);

    return { items, total };
  }

  async buscarPorId(id) {
    return await prisma.procedimento.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true }
        },
        anexos: true
      }
    });
  }

  async obterPorId(id) {
    return await prisma.procedimento.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true }
        },
        anexos: true
      }
    });
  }

  async criar(dados) {
    return await prisma.procedimento.create({ data: dados });
  }

  async deletar(id) {
    return await prisma.procedimento.delete({ where: { id: Number(id) } });
  }

  async criarAnexo(dadosAnexo) {
    return await prisma.procedimentoAnexo.create({ data: dadosAnexo });
  }

  async atualizar(id, dados) {
    return await prisma.procedimento.update({
      where: { id: Number(id) },
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        script_passo_a_passo: dados.script_passo_a_passo,
        publico: Boolean(dados.publico),
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true }
        },
        anexos: true
      }
    });
  }
}

module.exports = new ProcedimentoRepository();
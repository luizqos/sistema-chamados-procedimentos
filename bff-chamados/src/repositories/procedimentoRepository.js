const prisma = require('../config/prisma');

class ProcedimentoRepository {
  async listar({ busca, page = 1, limit = 15 }) {
    const skip = (page - 1) * limit;

    const where = busca && busca.trim() !== '' ? {
      OR: [
        { titulo: { contains: busca } },
        { descricao: { contains: busca } },
        { script_passo_a_passo: { contains: busca } }
      ]
    } : {};

    const [items, total] = await Promise.all([
      prisma.procedimento.findMany({
        where,
        orderBy: { updated_at: 'desc' },
        skip,
        take: Number(limit),
        select: {
          id: true,
          titulo: true,
          descricao: true,
          updated_at: true,
          usuario_id: true // <--- Incluído para a listagem saber quem criou
        }
      }),
      prisma.procedimento.count({ where })
    ]);

    return {
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total
    };
  }

  async obterPorId(id) {
    return await prisma.procedimento.findUnique({
      where: { id: Number(id) },
      include: { anexos: true }
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
}

module.exports = new ProcedimentoRepository();
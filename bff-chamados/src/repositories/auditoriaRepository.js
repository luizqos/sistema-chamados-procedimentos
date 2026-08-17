const prisma = require('../config/prisma');

class AuditoriaRepository {
  async criar({ usuario_id, acao, entidade, registro_id, dados_antigos, dados_novos }) {
    return await prisma.auditoriaLog.create({
      data: {
        usuario_id: usuario_id ? Number(usuario_id) : null,
        acao,
        entidade,
        registro_id: String(registro_id),
        dados_antigos: dados_antigos || null,
        dados_novos: dados_novos || null
      }
    });
  }

  async listarPaginado(page = 1, limit = 15, busca = '') {
    const skip = (page - 1) * limit;
    
    const where = busca ? {
      OR: [
        { entidade: { contains: busca, mode: 'insensitive' } },
        { acao: { contains: busca, mode: 'insensitive' } },
        { registro_id: { contains: busca, mode: 'insensitive' } }
      ]
    } : {};

    const [dados, total] = await Promise.all([
      prisma.auditoriaLog.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: {
          usuario: { select: { id: true, nome: true, email: true } }
        }
      }),
      prisma.auditoriaLog.count({ where })
    ]);

    return { dados, total, totalPages: Math.ceil(total / limit) || 1, currentPage: Number(page) };
  }
}

module.exports = new AuditoriaRepository();
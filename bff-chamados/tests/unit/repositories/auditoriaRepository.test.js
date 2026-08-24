const auditoriaRepository = require('../../../src/repositories/auditoriaRepository');
const prisma = require('../../../src/config/prisma');

describe('Auditoria Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar registro de log convertendo os IDs corretamente', async () => {
      prisma.auditoriaLog.create.mockResolvedValue({ id: 1 });

      await auditoriaRepository.criar({
        usuario_id: '15', 
        acao: 'CREATE',
        entidade: 'Usuario',
        registro_id: 99,
        dados_antigos: null,
        dados_novos: { a: 1 }
      });

      expect(prisma.auditoriaLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 15,
          registro_id: '99',
          dados_novos: { a: 1 }
        })
      });
    });
  });

  describe('listarPaginado', () => {
    it('deve buscar sem filtro com skip e take corretos', async () => {
      prisma.auditoriaLog.findMany.mockResolvedValue([{ id: 1 }]);
      prisma.auditoriaLog.count.mockResolvedValue(1);

      const res = await auditoriaRepository.listarPaginado(2, 10, '');

      expect(prisma.auditoriaLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 })
      );
      expect(res.currentPage).toBe(2);
      expect(res.totalPages).toBe(1);
    });

    it('deve montar a cláusula OR insensitive quando há busca', async () => {
      prisma.auditoriaLog.findMany.mockResolvedValue([]);
      prisma.auditoriaLog.count.mockResolvedValue(0);

      await auditoriaRepository.listarPaginado(1, 15, 'CREATE');

      expect(prisma.auditoriaLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { entidade: { contains: 'CREATE', mode: 'insensitive' } },
              { acao: { contains: 'CREATE', mode: 'insensitive' } },
              { registro_id: { contains: 'CREATE', mode: 'insensitive' } }
            ]
          }
        })
      );
    });
  });
});
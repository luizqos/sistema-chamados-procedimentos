const procedimentoRepository = require('../../../src/repositories/procedimentoRepository');
const prisma = require('../../../src/config/prisma');

describe('Procedimento Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar procedimento por ID com includes', async () => {
    prisma.procedimento.findUnique.mockResolvedValue({ id: 5 });
    await procedimentoRepository.obterPorId(5);
    expect(prisma.procedimento.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });

  it('deve criar procedimento', async () => {
    prisma.procedimento.create.mockResolvedValue({ id: 1 });
    await procedimentoRepository.criar({ titulo: 'T' });
    expect(prisma.procedimento.create).toHaveBeenCalled();
  });

  it('deve deletar procedimento', async () => {
    prisma.procedimento.delete.mockResolvedValue({ id: 1 });
    await procedimentoRepository.deletar(1);
    expect(prisma.procedimento.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve criar anexo', async () => {
    prisma.procedimentoAnexo.create.mockResolvedValue({ id: 2 });
    await procedimentoRepository.criarAnexo({ tipo: 'imagem' });
    expect(prisma.procedimentoAnexo.create).toHaveBeenCalled();
  });

  it('deve atualizar procedimento garantindo conversão de boolean publico', async () => {
    prisma.procedimento.update.mockResolvedValue({ id: 1 });
    await procedimentoRepository.atualizar(1, { titulo: 'N', publico: 'true' });
    
    expect(prisma.procedimento.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ publico: true, titulo: 'N' })
      })
    );
  });
  
  it('deve deletar anexo', async () => {
    prisma.procedimentoAnexo.delete.mockResolvedValue(true);
    await procedimentoRepository.deletarAnexo(5);
    expect(prisma.procedimentoAnexo.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });
  
  describe('listar', () => {
    it('deve listar procedimentos como ADMIN com termo de busca', async () => {
      prisma.procedimento.findMany.mockResolvedValue([{ id: 1 }]);
      prisma.procedimento.count.mockResolvedValue(1);

      const res = await procedimentoRepository.listar({ 
        busca: 'termo', page: 1, limit: 10, usuarioLogado: { role: { nome: 'ADMIN' } } 
      });

      expect(prisma.procedimento.findMany).toHaveBeenCalled();
      expect(res.total).toBe(1);
    });

    it('deve listar procedimentos como OPERADOR sem termo de busca', async () => {
      prisma.procedimento.findMany.mockResolvedValue([]);
      prisma.procedimento.count.mockResolvedValue(0);

      const res = await procedimentoRepository.listar({ 
        usuarioLogado: { id: 2, role: 'OPERADOR' } 
      });

      expect(prisma.procedimento.findMany).toHaveBeenCalled();
      expect(res.items).toEqual([]);
    });
  });

  describe('buscarPorId', () => {
    it('deve buscarPorId corretamente', async () => {
      prisma.procedimento.findUnique.mockResolvedValue({ id: 2 });
      await procedimentoRepository.buscarPorId(2);
      expect(prisma.procedimento.findUnique).toHaveBeenCalled();
    });
  });
});
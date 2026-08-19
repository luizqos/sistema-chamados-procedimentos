const permissaoRepository = require('../../../src/repositories/permissaoRepository');
const prisma = require('../../../src/config/prisma');

describe('Permissao Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar por procedimento', async () => {
    prisma.procedimentoPermissao.findMany.mockResolvedValue([]);
    await permissaoRepository.listarPorProcedimento(1);
    expect(prisma.procedimentoPermissao.findMany).toHaveBeenCalled();
  });

  it('deve salvar permissao (upsert)', async () => {
    prisma.procedimentoPermissao.upsert.mockResolvedValue({ id: 1 });
    await permissaoRepository.salvar(1, 2, 'EDITAR');
    expect(prisma.procedimentoPermissao.upsert).toHaveBeenCalled();
  });

  it('deve deletar permissao', async () => {
    prisma.procedimentoPermissao.delete.mockResolvedValue(true);
    await permissaoRepository.deletar(1, 2);
    expect(prisma.procedimentoPermissao.delete).toHaveBeenCalled();
  });

  it('deve verificar permissao usuario', async () => {
    prisma.procedimentoPermissao.findUnique.mockResolvedValue({ id: 1 });
    await permissaoRepository.verificarPermissaoUsuario(1, 2);
    expect(prisma.procedimentoPermissao.findUnique).toHaveBeenCalled();
  });

  it('deve salvar muitos', async () => {
    prisma.$transaction.mockResolvedValue([{ id: 1 }]);
    prisma.procedimentoPermissao.upsert.mockResolvedValue({});
    await permissaoRepository.salvarMuitos(1, [2, 3], 'VISUALIZAR');
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
const ssoRepository = require('../../../src/repositories/ssoRepository');
const prisma = require('../../../src/config/prisma');

describe('SSO Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar por SSO ID', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
    await ssoRepository.buscarPorSsoId('123');
    expect(prisma.usuario.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { ssoId: '123' } }));
  });

  it('deve vincular SSO ID', async () => {
    prisma.usuario.update.mockResolvedValue({ id: 1 });
    await ssoRepository.vincularSsoId(1, '123');
    expect(prisma.usuario.update).toHaveBeenCalled();
  });

  it('deve criar usuário SSO', async () => {
    prisma.usuario.create.mockResolvedValue({ id: 2 });
    await ssoRepository.criarUsuarioSso({ nome: 'A', email: 'a@a', ssoId: '123', roleId: 1 });
    expect(prisma.usuario.create).toHaveBeenCalled();
  });

  it('deve buscar regras aplicáveis', async () => {
    prisma.ssoRegra.findMany.mockResolvedValue([]);
    await ssoRepository.buscarRegrasAplicaveis('a@a', 'a');
    expect(prisma.ssoRegra.findMany).toHaveBeenCalled();
  });

  it('deve verificar se sistema exige permissão', async () => {
    prisma.ssoRegra.count.mockResolvedValue(1);
    const res = await ssoRepository.oSistemaExigePermissaoExplicita();
    expect(res).toBe(true);
  });

  it('deve deletar regra', async () => {
    prisma.ssoRegra.delete.mockResolvedValue(true);
    await ssoRepository.deletarRegra(1);
    expect(prisma.ssoRegra.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve listar paginado', async () => {
    prisma.ssoRegra.findMany.mockResolvedValue([{ id: 1 }]);
    prisma.ssoRegra.count.mockResolvedValue(1);
    const res = await ssoRepository.listarPaginado(1, 10, '');
    expect(res.dados.length).toBe(1);
  });
});
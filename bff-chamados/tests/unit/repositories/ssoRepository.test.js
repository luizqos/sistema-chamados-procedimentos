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

  it('deve listarPaginado usando os parametros default (sem argumentos)', async () => {
    prisma.ssoRegra.findMany.mockResolvedValue([]);
    prisma.ssoRegra.count.mockResolvedValue(0);
    await ssoRepository.listarPaginado();
    expect(prisma.ssoRegra.findMany).toHaveBeenCalled();
  });

  describe('Testes de Filtro e Exceções Faltantes', () => {
    it('deve listarPaginado COM termo de busca no campo valor', async () => {
      prisma.ssoRegra.findMany.mockResolvedValue([]);
      prisma.ssoRegra.count.mockResolvedValue(0);

      await ssoRepository.listarPaginado(1, 10, 'gmail');

      // Valida a busca exata que a sua regra de negócio implementa
      expect(prisma.ssoRegra.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            valor: { contains: 'gmail', mode: 'insensitive' }
          }
        })
      );
    });

    it('deve repassar erro ao falhar em buscarPorSsoId (linha 26)', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('Falha de Conexão'));
      await expect(ssoRepository.buscarPorSsoId('123')).rejects.toThrow('Falha de Conexão');
    });

    it('deve repassar erro ao falhar em criarUsuarioSso (linha 54)', async () => {
      prisma.usuario.create.mockRejectedValue(new Error('Falha de Conexão'));

      const payloadFake = { nome: 'A', email: 'a@a.com', ssoId: '1', roleId: 1 };

      await expect(ssoRepository.criarUsuarioSso(payloadFake)).rejects.toThrow('Falha de Conexão');
    });
  });
});
const usuarioRepository = require('../../../src/repositories/usuarioRepository');
const prisma = require('../../../src/config/prisma');

jest.mock('../../../src/config/prisma');

describe('Usuario Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar por email', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ email: 'a@a.com' });
    const res = await usuarioRepository.buscarPorEmail('a@a.com');
    expect(res.email).toBe('a@a.com');
    expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@a.com' }, include: { role: true }
    });
  });

  it('deve buscar por email com permissões', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
    await usuarioRepository.buscarPorEmailComPermissoes('b@b.com');
    expect(prisma.usuario.findUnique).toHaveBeenCalled();
  });

  it('deve buscar role por nome', async () => {
    prisma.role.findUnique.mockResolvedValue({ nome: 'ADMIN' });
    await usuarioRepository.buscarRolePorNome('ADMIN');
    expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { nome: 'ADMIN' } });
  });

  it('deve criar usuário', async () => {
    prisma.usuario.create.mockResolvedValue({ id: 1 });
    await usuarioRepository.criar({ nome: 'Teste' });
    expect(prisma.usuario.create).toHaveBeenCalled();
  });

  it('deve contar admins', async () => {
    prisma.usuario.count.mockResolvedValue(5);
    const res = await usuarioRepository.contarAdmins();
    expect(res).toBe(5);
  });

  it('deve listar paginado e calcular o total de páginas', async () => {
    prisma.usuario.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    prisma.usuario.count.mockResolvedValue(12);

    const res = await usuarioRepository.listarPaginado(2, 10, 'Luiz');

    expect(res.dados.length).toBe(2);
    expect(res.total).toBe(12);
    expect(res.totalPages).toBe(2);
    expect(res.currentPage).toBe(2);
  });

  it('deve alternar status', async () => {
    prisma.usuario.update.mockResolvedValue({ ativo: false });
    await usuarioRepository.alternarStatus(1, false);
    expect(prisma.usuario.update).toHaveBeenCalledWith(expect.objectContaining({ data: { ativo: false } }));
  });

  it('deve atualizar usuario', async () => {
    prisma.usuario.update.mockResolvedValue({ id: 1 });
    await usuarioRepository.atualizarUsuario(1, { nome: 'Novo' });
    expect(prisma.usuario.update).toHaveBeenCalled();
  });

  describe('buscas extras e listagem', () => {
    it('deve buscarPorIdComPermissoes', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
      await usuarioRepository.buscarPorIdComPermissoes(1);
      expect(prisma.usuario.findUnique).toHaveBeenCalled();
    });

    it('deve listarTodos', async () => {
      prisma.usuario.findMany.mockResolvedValue([{ id: 1 }]);
      await usuarioRepository.listarTodos();
      expect(prisma.usuario.findMany).toHaveBeenCalled();
    });

    it('deve listarPaginado sem termo de busca', async () => {
      prisma.usuario.findMany.mockResolvedValue([]);
      prisma.usuario.count.mockResolvedValue(0);
      await usuarioRepository.listarPaginado(1, 10, '');
      expect(prisma.usuario.findMany).toHaveBeenCalled();
    });

    it('deve buscarPorId sem permissoes', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ id: 1 });
      await usuarioRepository.buscarPorId(1);
      expect(prisma.usuario.findUnique).toHaveBeenCalled();
    });
  });

  it('deve listarPaginado COM termo de busca (testando os branches de filtro)', async () => {
    prisma.usuario.findMany.mockResolvedValue([]);
    prisma.usuario.count.mockResolvedValue(0);
    await usuarioRepository.listarPaginado(1, 10, 'Luiz');
    
    expect(prisma.usuario.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [
          { nome: { contains: 'Luiz', mode: 'insensitive' } },
          { email: { contains: 'Luiz', mode: 'insensitive' } }
        ]
      }
    }));
  });
});
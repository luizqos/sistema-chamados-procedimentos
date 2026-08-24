const usuarioService = require('../../../src/services/usuarioService');
const usuarioRepository = require('../../../src/repositories/usuarioRepository');
const auditoriaService = require('../../../src/services/auditoriaService');
const bcrypt = require('bcryptjs');

jest.mock('../../../src/repositories/usuarioRepository');
jest.mock('../../../src/services/auditoriaService');
jest.mock('bcryptjs');

describe('Usuario Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarUsuario', () => {
    const mockUsuarioLogado = { id: 1, nome: 'Admin' };

    it('deve lançar erro 400 se dados obrigatórios faltarem', async () => {
      await expect(usuarioService.criarUsuario({}, mockUsuarioLogado))
        .rejects.toThrow('Nome, e-mail e uma forma de autenticação (senha ou ssoId) são obrigatórios.');
    });

    it('deve lançar erro 400 se e-mail já existir', async () => {
      usuarioRepository.buscarPorEmail.mockResolvedValue({ id: 2, email: 'teste@empresa.com' });

      await expect(usuarioService.criarUsuario({ nome: 'Teste', email: 'teste@empresa.com', senha: '123' }, mockUsuarioLogado))
        .rejects.toThrow('Este e-mail já está cadastrado.');
    });

    it('deve buscar role OPERADOR caso nenhuma roleId seja informada e criar o usuário', async () => {
      usuarioRepository.buscarPorEmail.mockResolvedValue(null);
      usuarioRepository.buscarRolePorNome.mockResolvedValue({ id: 2, nome: 'OPERADOR' });
      bcrypt.hash.mockResolvedValue('hash123');
      
      const mockRetorno = { id: 3, nome: 'Teste', email: 'teste@teste.com', senha: 'hash' };
      usuarioRepository.criar.mockResolvedValue(mockRetorno);

      const resultado = await usuarioService.criarUsuario({ nome: 'Teste', email: 'teste@teste.com', senha: '123' }, mockUsuarioLogado);

      expect(usuarioRepository.criar).toHaveBeenCalledWith({
        nome: 'Teste', email: 'teste@teste.com', senha: 'hash123', ssoId: null, roleId: 2
      });
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
      expect(resultado.id).toBe(3);
    });
  });

  describe('alterarStatusUsuario', () => {
    it('deve lançar erro 400 se usuário tentar desativar a própria conta', async () => {
      await expect(usuarioService.alterarStatusUsuario(1, false, 1, { id: 1 }))
        .rejects.toThrow('Você não pode desativar sua própria conta.');
    });

    it('deve lançar erro 404 se usuário não for encontrado', async () => {
      usuarioRepository.buscarPorId.mockResolvedValue(null);
      await expect(usuarioService.alterarStatusUsuario(2, false, 1, { id: 1 }))
        .rejects.toThrow('Usuário não encontrado.');
    });

    it('deve alternar status e registrar auditoria com sucesso', async () => {
      const mockUser = { id: 2, ativo: true, senha: '123' };
      usuarioRepository.buscarPorId.mockResolvedValue(mockUser);
      usuarioRepository.alternarStatus.mockResolvedValue({ ...mockUser, ativo: false });

      const result = await usuarioService.alterarStatusUsuario(2, false, 1, { id: 1 });
      
      expect(result.ativo).toBe(false);
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });
  });

  describe('atualizar', () => {
    it('deve impedir a troca de e-mail se o usuário já fez login', async () => {
      const mockUser = { id: 2, email: 'antigo@teste.com', ultimo_login: new Date() };
      usuarioRepository.buscarPorId.mockResolvedValue(mockUser);

      await expect(usuarioService.atualizar(2, { email: 'novo@teste.com' }, { id: 1 }))
        .rejects.toThrow('O e-mail não pode mais ser alterado pois este usuário já realizou login no sistema.');
    });

    it('deve impedir a troca se o novo e-mail já pertencer a outro id', async () => {
      const mockUser = { id: 2, email: 'antigo@teste.com', ultimo_login: null };
      usuarioRepository.buscarPorId.mockResolvedValue(mockUser);
      usuarioRepository.buscarPorEmail.mockResolvedValue({ id: 3 }); 

      await expect(usuarioService.atualizar(2, { email: 'novo@teste.com' }, { id: 1 }))
        .rejects.toThrow('Este e-mail já está em uso por outro usuário.');
    });

    it('deve atualizar o usuário com sucesso, convertendo a senha em hash', async () => {
      const mockUser = { id: 2, email: 'antigo@teste.com', ultimo_login: null };
      usuarioRepository.buscarPorId.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('novaSenhaHash');
      usuarioRepository.atualizarUsuario.mockResolvedValue({ id: 2, email: 'antigo@teste.com' });

      await usuarioService.atualizar(2, { nome: 'Novo', senha: '123' }, { id: 1 });

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(usuarioRepository.atualizarUsuario).toHaveBeenCalledWith(2, expect.objectContaining({
        nome: 'Novo',
        senha: 'novaSenhaHash'
      }));
    });
  });
  
  describe('listarUsuarios', () => {
    it('deve chamar o repository e retornar os dados', async () => {
      const mockRetorno = { dados: [], total: 0 };
      usuarioRepository.listarPaginado.mockResolvedValue(mockRetorno);
      
      const res = await usuarioService.listarUsuarios(1, 10, 'x');
      expect(usuarioRepository.listarPaginado).toHaveBeenCalledWith(1, 10, 'x');
      expect(res).toEqual(mockRetorno);
    });
  });

  describe('alterarRole', () => {
    it('deve lancar erro 400 se faltar id do usuario ou role', async () => {
      await expect(usuarioService.alterarRole(null, 2, { id: 1 }))
        .rejects.toThrow('ID do usuário e ID do perfil são obrigatórios.');
    });

    it('deve lancar erro 404 se usuario nao existir', async () => {
      usuarioRepository.buscarPorId.mockResolvedValue(null);
      await expect(usuarioService.alterarRole(99, 2, { id: 1 }))
        .rejects.toThrow('Usuário não encontrado.');
    });

    it('deve alterar a role e salvar no log', async () => {
      usuarioRepository.buscarPorId.mockResolvedValue({ id: 2, senha: 'x' });
      usuarioRepository.atualizarRole.mockResolvedValue({ id: 2, role: { id: 3 } });

      const res = await usuarioService.alterarRole(2, 3, { id: 1 });
      expect(usuarioRepository.atualizarRole).toHaveBeenCalledWith(2, 3);
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
      expect(res.role.id).toBe(3);
    });
  });

  describe('Testes de Branches Faltantes (usuarioService)', () => {
    it('criarUsuario deve lançar erro se role OPERADOR sumir do banco', async () => {
      usuarioRepository.buscarPorEmail.mockResolvedValue(null);
      usuarioRepository.buscarRolePorNome.mockResolvedValue(null); // Banco sem a role
      
      await expect(usuarioService.criarUsuario({ nome: 'A', email: 'a@a', senha: '1' }, { id: 1 }))
        .rejects.toThrow('Role padrão OPERADOR não foi encontrada no banco de dados.');
    });

    it('atualizar deve permitir alteração de email se o usuário NUNCA tiver feito login', async () => {
      const mockUser = { id: 2, email: 'antigo@teste.com', ultimo_login: null }; // Sem login
      usuarioRepository.buscarPorId.mockResolvedValue(mockUser);
      usuarioRepository.buscarPorEmail.mockResolvedValue(null); // Email novo livre
      usuarioRepository.atualizarUsuario.mockResolvedValue({ id: 2 });

      await usuarioService.atualizar(2, { email: 'novo_livre@teste.com' }, { id: 1 });
      expect(usuarioRepository.atualizarUsuario).toHaveBeenCalled();
    });
  });
});
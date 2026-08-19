const authService = require('../../../src/services/authService');
const usuarioRepository = require('../../../src/repositories/usuarioRepository');
const auditoriaService = require('../../../src/services/auditoriaService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/repositories/usuarioRepository');
jest.mock('../../../src/services/auditoriaService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('login', () => {
    it('deve lançar erro 401 se o usuário não existir', async () => {
      usuarioRepository.buscarPorEmailComPermissoes.mockResolvedValue(null);

      await expect(authService.login('teste@teste.com', '123'))
        .rejects.toThrow('Credenciais inválidas.');
    });

    it('deve lançar erro 401 se a senha não bater', async () => {
      usuarioRepository.buscarPorEmailComPermissoes.mockResolvedValue({ senha: 'hash' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('teste@teste.com', '123'))
        .rejects.toThrow('Credenciais inválidas.');
    });

    it('deve retornar token e usuário formatado em caso de sucesso', async () => {
      const mockUsuario = {
        id: 1,
        nome: 'Luiz',
        email: 'luiz@teste.com',
        senha: 'hash',
        role: { id: 1, nome: 'ADMIN', permissoes: [] }
      };

      usuarioRepository.buscarPorEmailComPermissoes.mockResolvedValue(mockUsuario);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');
      usuarioRepository.atualizarDataUltimoLogin.mockResolvedValue(true);

      const resultado = await authService.login('luiz@teste.com', 'senha');

      expect(resultado.token).toBe('fake-token');
      expect(resultado.usuario.email).toBe('luiz@teste.com');
      expect(usuarioRepository.atualizarDataUltimoLogin).toHaveBeenCalledWith(1);
    });
  });

  describe('cadastrarAdminInicial', () => {
    it('deve lançar erro 400 se faltar dados', async () => {
      await expect(authService.cadastrarAdminInicial({ nome: 'Luiz' }))
        .rejects.toThrow('Nome, e-mail e senha são obrigatórios.');
    });

    it('deve lançar erro 403 se já existir um admin cadastrado no sistema', async () => {
      usuarioRepository.contarAdmins.mockResolvedValue(1); // Finge que já existe 1 admin

      await expect(authService.cadastrarAdminInicial({ nome: 'A', email: 'a@a', senha: '123' }))
        .rejects.toThrow('Acesso negado: O sistema já possui um administrador cadastrado.');
    });

    it('deve cadastrar com sucesso se não houver admins e os dados estiverem ok', async () => {
      usuarioRepository.contarAdmins.mockResolvedValue(0);
      usuarioRepository.buscarRolePorNome.mockResolvedValue({ id: 1, nome: 'ADMIN' });
      bcrypt.hash.mockResolvedValue('senhaHash');
      
      const mockNovoAdmin = { id: 1, nome: 'Luiz' };
      usuarioRepository.criar.mockResolvedValue(mockNovoAdmin);

      const resultado = await authService.cadastrarAdminInicial({ 
        nome: 'Luiz', email: 'admin@a.com', senha: '123' 
      });

      expect(usuarioRepository.criar).toHaveBeenCalledWith({
        nome: 'Luiz',
        email: 'admin@a.com',
        senha: 'senhaHash',
        roleId: 1
      });
      expect(resultado).toEqual(mockNovoAdmin);
    });
  });

  describe('autenticar', () => {
    it('deve lançar erro se faltar email ou senha', async () => {
      await expect(authService.autenticar({ email: '' }))
        .rejects.toThrow('E-mail e senha são obrigatórios.');
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
      usuarioRepository.buscarPorEmail.mockResolvedValue(null);
      await expect(authService.autenticar({ email: 'a@a', senha: '123' }))
        .rejects.toThrow('Credenciais inválidas.');
    });

    it('deve lançar erro se a senha for incorreta', async () => {
      usuarioRepository.buscarPorEmail.mockResolvedValue({ senha: 'hash' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.autenticar({ email: 'a@a', senha: '123' }))
        .rejects.toThrow('Credenciais inválidas.');
    });

    it('deve retornar token e usuário em caso de sucesso', async () => {
      const mockUser = { id: 1, email: 'a@a', senha: '123', role: 'ADMIN', nome: 'A' };
      usuarioRepository.buscarPorEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await authService.autenticar({ email: 'a@a', senha: '123' });

      expect(result).toHaveProperty('token', 'token');
      expect(result.usuario).toHaveProperty('email', 'a@a');
    });
  });

  describe('me e obterSessao', () => {
    it('me() deve lançar erro se usuário não for encontrado', async () => {
      usuarioRepository.buscarPorId.mockResolvedValue(null);
      await expect(authService.me(1)).rejects.toThrow('Usuário não encontrado.');
    });

    it('me() deve retornar o usuário', async () => {
      usuarioRepository.buscarPorId.mockResolvedValue({ id: 1 });
      const res = await authService.me(1);
      expect(res.id).toBe(1);
    });

    it('obterSessao() deve lançar erro se usuário não for encontrado', async () => {
      usuarioRepository.buscarPorIdComPermissoes.mockResolvedValue(null);
      await expect(authService.obterSessao(1)).rejects.toThrow('Usuário não encontrado.');
    });

    it('obterSessao() deve formatar e retornar a sessão', async () => {
      usuarioRepository.buscarPorIdComPermissoes.mockResolvedValue({
        id: 1, role: { id: 1, nome: 'ADMIN', permissoes: [] }
      });
      const res = await authService.obterSessao(1);
      expect(res.role.nome).toBe('ADMIN');
    });
  });

  describe('verificarStatusSistema', () => {
    it('deve retornar precisaSetupInicial: true se não houver admins', async () => {
      usuarioRepository.contarAdmins.mockResolvedValue(0);
      const res = await authService.verificarStatusSistema();
      expect(res.precisaSetupInicial).toBe(true);
    });
  });
});
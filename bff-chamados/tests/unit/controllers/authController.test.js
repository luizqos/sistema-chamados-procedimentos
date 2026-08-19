const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');
const usuarioRepository = require('../../../src/repositories/usuarioRepository');

jest.mock('../../../src/services/authService');
jest.mock('../../../src/repositories/usuarioRepository');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: {}, usuario: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar 200 e o resultado do service', async () => {
      req.body = { email: 'admin@teste.com', senha: '123' };
      const mockResult = { token: '123', usuario: {} };
      authService.login.mockResolvedValue(mockResult);

      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('deve capturar erro e retornar o statusCode correspondente', async () => {
      const error = new Error('Falha');
      error.statusCode = 401;
      authService.login.mockRejectedValue(error);

      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('me', () => {
    it('deve retornar 401 se nao houver usuario no request', async () => {
      req.usuario = null; req.usuarioId = null; req.user = null;
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('deve retornar 401 se o usuario estiver inativo no banco', async () => {
      req.usuarioId = 1;
      usuarioRepository.buscarPorId.mockResolvedValue({ ativo: false });
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('deve retornar os dados do usuario', async () => {
      req.usuarioId = 1;
      usuarioRepository.buscarPorId.mockResolvedValue({ id: 1, ativo: true });
      await authController.me(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ativo: true });
    });
  });

  describe('setupInicial', () => {
    it('verificarSetup deve retornar status do sistema', async () => {
      authService.verificarStatusSistema.mockResolvedValue({ precisaSetupInicial: true });
      await authController.verificarSetup(req, res);
      expect(res.json).toHaveBeenCalledWith({ precisaSetupInicial: true });
    });

    it('setupInicial deve criar admin e retornar 201', async () => {
      req.body = { nome: 'Admin', email: 'admin@a', senha: '123' };
      authService.cadastrarAdminInicial.mockResolvedValue({ id: 1 });
      await authController.setupInicial(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
  
  describe('Caminhos de erro extras (catch)', () => {
    it('me deve retornar erro 500 em caso de falha no banco', async () => {
      req.usuarioId = 1;
      usuarioRepository.buscarPorId.mockRejectedValue(new Error('Falha Banco'));
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('verificarSetup deve retornar erro 500', async () => {
      authService.verificarStatusSistema.mockRejectedValue(new Error('Falha'));
      await authController.verificarSetup(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('setupInicial deve retornar o status code do erro', async () => {
      const error = new Error('Invalido');
      error.statusCode = 403;
      authService.cadastrarAdminInicial.mockRejectedValue(error);
      
      await authController.setupInicial(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
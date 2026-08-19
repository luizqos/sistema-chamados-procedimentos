const { autenticar, autorizar, verificarPermissao } = require('../../../src/middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
const prisma = require('../../../src/config/prisma');

jest.mock('../../../src/config/prisma');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('autenticar', () => {
    it('deve retornar 401 se nenhum token for fornecido', () => {
      autenticar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    });

    it('deve aceitar token via header Authorization', () => {
      req.headers.authorization = 'Bearer tokenValido';
      jwt.verify.mockReturnValue({ id: 1, role: 'ADMIN' });

      autenticar(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('tokenValido', 'secret');
      expect(req.usuario).toEqual({ id: 1, role: 'ADMIN' });
      expect(next).toHaveBeenCalled();
    });

    it('deve aceitar token via query parameter', () => {
      req.query.token = 'tokenQueryValido';
      jwt.verify.mockReturnValue({ id: 2, role: 'OPERADOR' });

      autenticar(req, res, next);

      expect(req.usuario.id).toBe(2);
      expect(next).toHaveBeenCalled();
    });

    it('deve retornar 401 se o token for inválido', () => {
      req.headers.authorization = 'Bearer tokenInvalido';
      jwt.verify.mockImplementation(() => { throw new Error('Inválido'); });

      autenticar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
    });
  });

  describe('autorizar', () => {
    it('deve retornar 403 se o usuário não possuir a role permitida', () => {
      req.usuario = { role: 'OPERADOR' };
      const middleware = autorizar(['ADMIN']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado: permissão insuficiente' });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se o usuário tiver a role permitida', () => {
      req.usuario = { role: 'ADMIN' };
      const middleware = autorizar(['ADMIN', 'OPERADOR']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

describe('verificarPermissao', () => {
    it('deve retornar 500 se houver erro ao buscar banco', async () => {
      req.usuario = { id: 1 };
      prisma.usuario.findUnique.mockRejectedValue(new Error('Falha'));
      const middleware = verificarPermissao('CRIAR_USUARIO');
      await middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('deve permitir acesso se usuario for ADMIN', async () => {
      req.usuario = { id: 1 };
      prisma.usuario.findUnique.mockResolvedValue({ 
        role: { nome: 'ADMIN', permissoes: [] } 
      });
      const middleware = verificarPermissao('QUALQUER_COISA');
      await middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('deve barrar acesso se não tiver a chave específica', async () => {
      req.usuario = { id: 1 };
      prisma.usuario.findUnique.mockResolvedValue({ 
        role: { nome: 'OPERADOR', permissoes: [{ permissao: { chave: 'OUTRA' } }] } 
      });
      const middleware = verificarPermissao('CRIAR_USUARIO');
      await middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
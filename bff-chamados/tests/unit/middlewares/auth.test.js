const auth = require('../../../src/middlewares/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware (auth.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    process.env.JWT_SECRET = 'secret';
    jest.clearAllMocks();
  });

  it('deve retornar 401 se nao tiver header de autorizacao', () => {
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticação não fornecido' });
  });

  it('deve retornar 401 se formato do token for invalido (sem espaco)', () => {
    req.headers.authorization = 'BearerTokenTudoJunto';
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('deve retornar 401 se o esquema nao for Bearer', () => {
    req.headers.authorization = 'Basic meutoken123';
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('deve retornar 401 se token for invalido ou expirado', () => {
    req.headers.authorization = 'Bearer token-invalido';
    jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalido'), null));
    
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('deve chamar next e injetar usuarioId se token for valido', () => {
    req.headers.authorization = 'Bearer token-valido';
    jwt.verify.mockImplementation((token, secret, callback) => callback(null, { id: 99 }));
    
    auth(req, res, next);
    expect(req.usuarioId).toBe(99);
    expect(next).toHaveBeenCalled();
  });
});
const ssoController = require('../../../src/controllers/ssoController');
const ssoService = require('../../../src/services/ssoService');
const authService = require('../../../src/services/authService');

jest.mock('../../../src/services/ssoService');
jest.mock('../../../src/services/authService');

describe('SSO Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, usuario: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('loginMicrosoft deve retornar 400 sem token', async () => {
    await ssoController.loginMicrosoft(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('loginMicrosoft deve autenticar com sucesso', async () => {
    req.body.tokenMicrosoft = 'token';
    ssoService.autenticarMicrosoft.mockResolvedValue({ id: 1, email: 'a@a.com' });
    authService.gerarTokenInterno.mockReturnValue('jwt');

    await ssoController.loginMicrosoft(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt' }));
  });

  it('listar deve retornar regras paginadas', async () => {
    ssoService.listarRegrasPaginadas.mockResolvedValue({ dados: [] });
    await ssoController.listar(req, res);
    expect(res.json).toHaveBeenCalledWith({ dados: [] });
  });

  it('criar deve retornar 201', async () => {
    ssoService.criarRegra.mockResolvedValue({ id: 1 });
    await ssoController.criar(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deletar deve retornar 204', async () => {
    req.params.id = 1;
    ssoService.deletarRegra.mockResolvedValue(true);
    await ssoController.deletar(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

describe('Caminhos de Erro (catch)', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('loginMicrosoft deve retornar 403 se o acesso for negado', async () => {
      req.body.tokenMicrosoft = 'token-falso'; 
      ssoService.autenticarMicrosoft.mockRejectedValue(new Error('Acesso negado: domínio bloqueado'));
      
      await ssoController.loginMicrosoft(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('listar deve retornar 500 em caso de erro', async () => {
      ssoService.listarRegrasPaginadas.mockRejectedValue(new Error('Erro DB'));
      await ssoController.listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('criar deve retornar 400 se regra já existir', async () => {
      ssoService.criarRegra.mockRejectedValue(new Error('Já existe'));
      await ssoController.criar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deletar deve retornar 500 em caso de erro', async () => {
      ssoService.deletarRegra.mockRejectedValue(new Error('Erro DB'));
      await ssoController.deletar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
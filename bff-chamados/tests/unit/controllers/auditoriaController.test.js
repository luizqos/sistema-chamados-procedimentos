const auditoriaController = require('../../../src/controllers/auditoriaController');
const auditoriaService = require('../../../src/services/auditoriaService');

jest.mock('../../../src/services/auditoriaService');

describe('Auditoria Controller', () => {
  let req, res;
  beforeEach(() => {
    req = { query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('deve listar auditoria com sucesso', async () => {
    req.query = { page: '1', limit: '10', busca: 'x' };
    auditoriaService.listarLogs.mockResolvedValue({ dados: [] });
    
    await auditoriaController.listar(req, res);
    
    expect(res.json).toHaveBeenCalledWith({ dados: [] });
    expect(auditoriaService.listarLogs).toHaveBeenCalledWith(1, 10, 'x');
  });

  it('deve retornar erro 500 se o serviço falhar', async () => {
    auditoriaService.listarLogs.mockRejectedValue(new Error('Erro DB'));
    await auditoriaController.listar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
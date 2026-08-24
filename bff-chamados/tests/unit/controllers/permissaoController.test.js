const permissaoController = require('../../../src/controllers/permissaoController');
const permissaoService = require('../../../src/services/permissaoService');

jest.mock('../../../src/services/permissaoService');

describe('Permissao Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('listar deve retornar permissoes', async () => {
    req.params.procedimentoId = 1;
    permissaoService.listar.mockResolvedValue([{ id: 1 }]);
    await permissaoController.listar(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('listar deve capturar erro', async () => {
    permissaoService.listar.mockRejectedValue(new Error('Erro DB'));
    await permissaoController.listar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('salvar deve retornar 201', async () => {
    req.params.procedimentoId = 1;
    req.body = { usuarioId: 2, nivel: 'EDITAR' };
    permissaoService.concederOuAtualizar.mockResolvedValue({ id: 1 });
    await permissaoController.salvar(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deletar deve retornar 204', async () => {
    req.params = { procedimentoId: 1, usuarioId: 2 };
    permissaoService.remover.mockResolvedValue(true);
    await permissaoController.deletar(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('salvarLote deve retornar 201', async () => {
    req.params.procedimentoId = 1;
    req.body = { usuariosIds: [1, 2], nivel: 'VISUALIZAR' };
    permissaoService.concederOuAtualizarEmLote.mockResolvedValue(true);
    await permissaoController.salvarLote(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
  
  describe('Caminhos de erro (catch)', () => {
    it('salvar deve capturar erro e retornar status do erro', async () => {
      permissaoService.concederOuAtualizar.mockRejectedValue(new Error('Invalido'));
      await permissaoController.salvar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deletar deve capturar erro', async () => {
      permissaoService.remover.mockRejectedValue(new Error('Invalido'));
      await permissaoController.deletar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('salvarLote deve capturar erro', async () => {
      permissaoService.concederOuAtualizarEmLote.mockRejectedValue(new Error('Invalido'));
      await permissaoController.salvarLote(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
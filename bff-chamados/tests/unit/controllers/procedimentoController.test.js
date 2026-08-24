const procedimentoController = require('../../../src/controllers/procedimentoController');
const procedimentoService = require('../../../src/services/procedimentoService');

jest.mock('../../../src/services/procedimentoService');

describe('Procedimento Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, usuario: { id: 1 }, file: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('deve listar procedimentos', async () => {
    req.query = { busca: 'a', page: 1, limit: 10 };
    procedimentoService.listarProcedimentos.mockResolvedValue({ items: [] });
    await procedimentoController.listar(req, res);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });

  it('deve obter por ID', async () => {
    req.params.id = 1;
    procedimentoService.obterProcedimentoPorId.mockResolvedValue({ id: 1 });
    await procedimentoController.obterPorId(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('deve criar procedimento', async () => {
    procedimentoService.criarProcedimento.mockResolvedValue({ id: 1 });
    await procedimentoController.criar(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deve deletar procedimento', async () => {
    req.params.id = 1;
    procedimentoService.deletarProcedimento.mockResolvedValue(true);
    await procedimentoController.deletar(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Excluído com sucesso' });
  });

  it('deve adicionar anexo', async () => {
    req.params.id = 1;
    procedimentoService.adicionarAnexo.mockResolvedValue({ id: 2 });
    await procedimentoController.adicionarAnexo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deve atualizar procedimento', async () => {
    req.params.id = 1;
    procedimentoService.atualizarProcedimento.mockResolvedValue({ id: 1, titulo: 'A' });
    await procedimentoController.atualizar(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, titulo: 'A' });
  });

  it('deve excluir anexo e retornar 204', async () => {
    req.params.anexoId = 1;
    procedimentoService.excluirAnexo.mockResolvedValue(true);
    await procedimentoController.excluirAnexo(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });
  
  describe('Caminhos de erro (catch)', () => {
    it('listar deve retornar erro 500', async () => {
      procedimentoService.listarProcedimentos.mockRejectedValue(new Error('Falha'));
      await procedimentoController.listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('obterPorId deve retornar erro 404', async () => {
      const erro = new Error('Nao encontrado');
      erro.statusCode = 404;
      procedimentoService.obterProcedimentoPorId.mockRejectedValue(erro);
      await procedimentoController.obterPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('criar deve retornar erro 400', async () => {
      procedimentoService.criarProcedimento.mockRejectedValue(new Error('Invalido'));
      await procedimentoController.criar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deletar deve retornar erro 400', async () => {
      procedimentoService.deletarProcedimento.mockRejectedValue(new Error('Invalido'));
      await procedimentoController.deletar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('adicionarAnexo deve retornar erro 400', async () => {
      procedimentoService.adicionarAnexo.mockRejectedValue(new Error('Invalido'));
      await procedimentoController.adicionarAnexo(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('atualizar deve retornar erro 500', async () => {
      procedimentoService.atualizarProcedimento.mockRejectedValue(new Error('Erro interno'));
      await procedimentoController.atualizar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('excluirAnexo deve retornar erro 500', async () => {
      procedimentoService.excluirAnexo.mockRejectedValue(new Error('Erro interno'));
      await procedimentoController.excluirAnexo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
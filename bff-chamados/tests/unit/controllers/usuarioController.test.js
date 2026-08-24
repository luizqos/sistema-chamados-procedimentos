const usuarioController = require('../../../src/controllers/usuarioController');
const usuarioService = require('../../../src/services/usuarioService');

jest.mock('../../../src/services/usuarioService');

describe('Usuario Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, usuario: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve retornar 201 e o usuário criado', async () => {
      req.body = { nome: 'Teste', email: 'teste@teste.com' };
      usuarioService.criarUsuario.mockResolvedValue({ id: 1, nome: 'Teste' });

      await usuarioController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, nome: 'Teste' });
    });

    it('deve repassar erro 500 caso o serviço falhe sem status', async () => {
      const erro = new Error('Falha');
      usuarioService.criarUsuario.mockRejectedValue(erro);

      await usuarioController.criar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha' });
    });
  });

  describe('listar', () => {
    it('deve listar usuários chamando o serviço com os parâmetros de query', async () => {
      req.query = { page: '2', limit: '5', busca: 'Luiz' };
      usuarioService.listarUsuarios.mockResolvedValue({ dados: [], total: 0 });

      await usuarioController.listar(req, res);

      expect(usuarioService.listarUsuarios).toHaveBeenCalledWith(2, 5, 'Luiz');
      expect(res.json).toHaveBeenCalledWith({ dados: [], total: 0 });
    });
  });

  describe('atualizarRole', () => {
    it('deve retornar o usuário atualizado', async () => {
      req.params = { id: 2 };
      req.body = { roleId: 3 };
      usuarioService.alterarRole.mockResolvedValue({ id: 2, role: { id: 3 } });

      await usuarioController.atualizarRole(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 2, role: { id: 3 } });
    });
  });

  describe('alternarStatus', () => {
    it('deve alternar status e retornar sucesso', async () => {
      req.params = { id: 2 };
      req.body = { ativo: false };
      usuarioService.alterarStatusUsuario.mockResolvedValue({ id: 2, ativo: false });

      await usuarioController.alternarStatus(req, res);

      expect(usuarioService.alterarStatusUsuario).toHaveBeenCalledWith(2, false, 1, req.usuario);
      expect(res.json).toHaveBeenCalledWith({ id: 2, ativo: false });
    });
  });

  describe('atualizar', () => {
    it('deve atualizar e retornar os dados novos', async () => {
      req.params = { id: 2 };
      req.body = { nome: 'Novo' };
      usuarioService.atualizar.mockResolvedValue({ id: 2, nome: 'Novo' });

      await usuarioController.atualizar(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 2, nome: 'Novo' });
    });
  });

  describe('Caminhos de erro (catch)', () => {
    it('listar deve retornar erro 500', async () => {
      usuarioService.listarUsuarios.mockRejectedValue(new Error('Falha'));
      await usuarioController.listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('atualizarRole deve retornar erro 500', async () => {
      usuarioService.alterarRole.mockRejectedValue(new Error('Falha'));
      await usuarioController.atualizarRole(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('alternarStatus deve retornar erro 500', async () => {
      usuarioService.alterarStatusUsuario.mockRejectedValue(new Error('Falha'));
      await usuarioController.alternarStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('atualizar deve retornar erro 500', async () => {
      usuarioService.atualizar.mockRejectedValue(new Error('Falha'));
      await usuarioController.atualizar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
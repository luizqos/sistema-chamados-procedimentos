const permissaoService = require('../../../src/services/permissaoService');
const permissaoRepository = require('../../../src/repositories/permissaoRepository');
const auditoriaService = require('../../../src/services/auditoriaService');

jest.mock('../../../src/repositories/permissaoRepository');
jest.mock('../../../src/services/auditoriaService');

describe('Permissao Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('concederOuAtualizar', () => {
    it('deve lançar erro 400 se o nível for inválido', async () => {
      await expect(permissaoService.concederOuAtualizar(1, 2, 'INVALIDO', { id: 1 }))
        .rejects.toThrow('Nível de permissão inválido.');
    });

    it('deve conceder permissão com sucesso e registrar auditoria de CREATE', async () => {
      permissaoRepository.verificarPermissaoUsuario.mockResolvedValue(null);
      permissaoRepository.salvar.mockResolvedValue({ id: 1 });

      await permissaoService.concederOuAtualizar(1, 2, 'VISUALIZAR', { id: 1 });

      expect(permissaoRepository.salvar).toHaveBeenCalledWith(1, 2, 'VISUALIZAR');
      expect(auditoriaService.registrarLog).toHaveBeenCalledWith(
        { id: 1 }, 'CREATE', 'ProcedimentoPermissao', '1-2', null, { id: 1 }
      );
    });

    it('deve atualizar permissão com sucesso e registrar auditoria de UPDATE', async () => {
      const permissaoAntiga = { nivel: 'VISUALIZAR' };
      permissaoRepository.verificarPermissaoUsuario.mockResolvedValue(permissaoAntiga);
      permissaoRepository.salvar.mockResolvedValue({ nivel: 'EDITAR' });

      await permissaoService.concederOuAtualizar(1, 2, 'EDITAR', { id: 1 });

      expect(auditoriaService.registrarLog).toHaveBeenCalledWith(
        { id: 1 }, 'UPDATE', 'ProcedimentoPermissao', '1-2', permissaoAntiga, { nivel: 'EDITAR' }
      );
    });
  });

  describe('remover', () => {
    it('deve remover a permissão e gerar log de DELETE', async () => {
      permissaoRepository.verificarPermissaoUsuario.mockResolvedValue({ id: 1 });
      permissaoRepository.deletar.mockResolvedValue(true);

      await permissaoService.remover(1, 2, { id: 1 });

      expect(permissaoRepository.deletar).toHaveBeenCalledWith(1, 2);
      expect(auditoriaService.registrarLog).toHaveBeenCalledWith(
        expect.anything(), 'DELETE', expect.any(String), expect.any(String), expect.anything(), null
      );
    });
  });

  describe('concederOuAtualizarEmLote', () => {
    it('deve lançar erro se o array de usuários for vazio', async () => {
      await expect(permissaoService.concederOuAtualizarEmLote(1, [], 'VISUALIZAR', { id: 1 }))
        .rejects.toThrow('Selecione ao menos um usuário.');
    });

    it('deve salvar em lote com sucesso', async () => {
      permissaoRepository.salvarMuitos.mockResolvedValue(true);

      await permissaoService.concederOuAtualizarEmLote(1, [2, 3], 'EDITAR', { id: 1 });

      expect(permissaoRepository.salvarMuitos).toHaveBeenCalledWith(1, [2, 3], 'EDITAR');
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });
  });
});
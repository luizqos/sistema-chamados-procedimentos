const auditoriaService = require('../../../src/services/auditoriaService');
const auditoriaRepository = require('../../../src/repositories/auditoriaRepository');

jest.mock('../../../src/repositories/auditoriaRepository');

describe('Auditoria Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrarLog', () => {
    it('deve registrar log com sucesso mapeando o usuarioLogado', async () => {
      auditoriaRepository.criar.mockResolvedValue(true);
      
      await auditoriaService.registrarLog(
        { id: 99 }, 'CREATE', 'Usuario', 1, { antigo: true }, { novo: true }
      );

      expect(auditoriaRepository.criar).toHaveBeenCalledWith({
        usuario_id: 99,
        acao: 'CREATE',
        entidade: 'Usuario',
        registro_id: 1,
        dados_antigos: { antigo: true },
        dados_novos: { novo: true }
      });
    });

    it('deve registrar log silenciosamente se usuarioLogado for null', async () => {
      auditoriaRepository.criar.mockResolvedValue(true);
      
      await auditoriaService.registrarLog(
        null, 'UPDATE', 'Role', 'abc', null, null
      );

      expect(auditoriaRepository.criar).toHaveBeenCalledWith(
        expect.objectContaining({ usuario_id: null, acao: 'UPDATE' })
      );
    });

    it('deve capturar falha silenciosamente caso o banco caia ao registrar log (não estourar erro na API)', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      auditoriaRepository.criar.mockRejectedValue(new Error('Falha no banco'));
      
      await auditoriaService.registrarLog({ id: 1 }, 'DELETE', 'Teste', 1);

      expect(consoleSpy).toHaveBeenCalledWith('Falha silenciosa ao registrar auditoria:', 'Falha no banco');
      consoleSpy.mockRestore();
    });
  });

  describe('listarLogs', () => {
    it('deve chamar o repository com os parametros corretos', async () => {
      const mockResult = { dados: [], total: 0 };
      auditoriaRepository.listarPaginado.mockResolvedValue(mockResult);

      const res = await auditoriaService.listarLogs(2, 20, 'Luiz');

      expect(auditoriaRepository.listarPaginado).toHaveBeenCalledWith(2, 20, 'Luiz');
      expect(res).toEqual(mockResult);
    });
  });
});
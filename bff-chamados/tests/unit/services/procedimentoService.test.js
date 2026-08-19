const procedimentoService = require('../../../src/services/procedimentoService');
const procedimentoRepository = require('../../../src/repositories/procedimentoRepository');
const permissaoRepository = require('../../../src/repositories/permissaoRepository');
const auditoriaService = require('../../../src/services/auditoriaService');
const fs = require('fs');

jest.mock('../../../src/repositories/procedimentoRepository');
jest.mock('../../../src/repositories/permissaoRepository');
jest.mock('../../../src/services/auditoriaService');
jest.mock('fs');

describe('Procedimento Service', () => {
  const mockUsuarioAdmin = { id: 1, role: 'ADMIN' };
  const mockUsuarioComum = { id: 2, role: 'OPERADOR' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarProcedimento', () => {
    it('deve lançar erro se faltar título ou script', async () => {
      await expect(procedimentoService.criarProcedimento({ titulo: 'A' }, mockUsuarioAdmin))
        .rejects.toThrow('Título e script passo a passo são obrigatórios.');
    });

    it('deve criar com sucesso e gerar log', async () => {
      const mockResult = { id: 1, titulo: 'Teste' };
      procedimentoRepository.criar.mockResolvedValue(mockResult);

      const result = await procedimentoService.criarProcedimento(
        { titulo: 'A', script_passo_a_passo: 'B' }, mockUsuarioAdmin
      );

      expect(result).toEqual(mockResult);
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });
  });

  describe('deletarProcedimento', () => {
    it('deve lançar erro 404 se não achar o procedimento', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue(null);
      await expect(procedimentoService.deletarProcedimento(99, mockUsuarioAdmin))
        .rejects.toThrow('Procedimento não encontrado.');
    });

    it('deve lançar erro 403 se usuário comum não for o criador', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 3 });
      
      await expect(procedimentoService.deletarProcedimento(1, mockUsuarioComum))
        .rejects.toThrow('Acesso negado: Você não tem permissão para excluir este procedimento.');
    });

    it('deve deletar se o usuário comum for o criador', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 2 }); 
      procedimentoRepository.deletar.mockResolvedValue(true);

      await procedimentoService.deletarProcedimento(1, mockUsuarioComum);
      expect(procedimentoRepository.deletar).toHaveBeenCalledWith(1);
    });
  });

  describe('adicionarAnexo', () => {
    const mockFile = { filename: 'teste.png', mimetype: 'image/png', originalname: 't.png', size: 100 };

    it('deve rejeitar acesso se usuário comum não for criador nem tiver permissão de edição', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 3 });
      permissaoRepository.verificarPermissaoUsuario.mockResolvedValue(null);
      
      fs.existsSync.mockReturnValue(true);

      await expect(procedimentoService.adicionarAnexo(1, mockFile, mockUsuarioComum))
        .rejects.toThrow('Acesso negado para adicionar anexo neste procedimento.');
      
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('deve permitir acesso se usuário for comum, mas tiver permissão de EDITAR', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 3 });
      permissaoRepository.verificarPermissaoUsuario.mockResolvedValue({ nivel: 'EDITAR' });
      procedimentoRepository.criarAnexo.mockResolvedValue({ id: 10 });

      const result = await procedimentoService.adicionarAnexo(1, mockFile, mockUsuarioComum);
      
      expect(result.id).toBe(10);
      expect(procedimentoRepository.criarAnexo).toHaveBeenCalled();
    });
  });

  describe('atualizarProcedimento', () => {
    it('deve lançar erro se tentar atualizar com título vazio', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      await expect(procedimentoService.atualizarProcedimento(1, { titulo: '   ' }, mockUsuarioAdmin))
        .rejects.toThrow('O título é obrigatório.');
    });

    it('deve atualizar com sucesso', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 1 });
      procedimentoRepository.atualizar.mockResolvedValue({ id: 1, titulo: 'Novo' });

      const res = await procedimentoService.atualizarProcedimento(1, { titulo: 'Novo' }, mockUsuarioAdmin);
      expect(res.titulo).toBe('Novo');
    });
  });

  describe('excluirAnexo', () => {
    it('deve excluir o anexo do disco (fs) e do banco se tiver permissão', async () => {
      const mockAnexo = { id: 1, procedimento_id: 1, caminho_arquivo: 'uploads/teste.png' };
      procedimentoRepository.obterAnexoPorId.mockResolvedValue(mockAnexo);
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1, usuario_id: 1 });
      
      fs.existsSync.mockReturnValue(true);
      procedimentoRepository.deletarAnexo.mockResolvedValue(true);

      await procedimentoService.excluirAnexo(1, mockUsuarioAdmin);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(procedimentoRepository.deletarAnexo).toHaveBeenCalledWith(1);
    });
  });
  
  describe('listarProcedimentos e obterProcedimentoPorId', () => {
    it('deve listar procedimentos chamando o repositorio', async () => {
      procedimentoRepository.listar.mockResolvedValue({ items: [], total: 0 });
      const res = await procedimentoService.listarProcedimentos({ busca: 'x' }, mockUsuarioAdmin);
      expect(res.total).toBe(0);
    });

    it('deve obter procedimento por id', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue({ id: 1 });
      const res = await procedimentoService.obterProcedimentoPorId(1);
      expect(res.id).toBe(1);
    });

    it('deve lancar erro se nao encontrar procedimento por id', async () => {
      procedimentoRepository.obterPorId.mockResolvedValue(null);
      await expect(procedimentoService.obterProcedimentoPorId(99))
        .rejects.toThrow('Procedimento não encontrado');
    });
  });
});
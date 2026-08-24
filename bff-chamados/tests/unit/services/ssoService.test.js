const ssoService = require('../../../src/services/ssoService');
const ssoRepository = require('../../../src/repositories/ssoRepository');
const auditoriaService = require('../../../src/services/auditoriaService');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/repositories/ssoRepository');
jest.mock('../../../src/services/auditoriaService');
jest.mock('jsonwebtoken');

describe('SSO Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validarTokenMicrosoft', () => {
    it('deve lançar erro se o token for malformatado', async () => {
      jwt.decode.mockReturnValue(null);
      await expect(ssoService.validarTokenMicrosoft('tokenFalso'))
        .rejects.toThrow('Token da Microsoft inválido ou malformatado.');
    });
  });

  describe('criarRegra', () => {
    it('deve lançar erro se faltar dados obrigatórios', async () => {
      await expect(ssoService.criarRegra({ tipo: 'EMAIL' }, { id: 1 }))
        .rejects.toThrow('Os campos tipo, valor e ação são obrigatórios.');
    });

    it('deve criar a regra e chamar a auditoria com sucesso', async () => {
      const mockRegra = { id: 1, tipo: 'DOMINIO', valor: 'empresa.com', acao: 'PERMITIR' };
      ssoRepository.criarRegra.mockResolvedValue(mockRegra);

      const resultado = await ssoService.criarRegra({ tipo: 'DOMINIO', valor: ' Empresa.com ', acao: 'PERMITIR' }, { id: 1 });

      expect(ssoRepository.criarRegra).toHaveBeenCalledWith({
        tipo: 'DOMINIO',
        valor: 'empresa.com',
        acao: 'PERMITIR'
      });
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
      expect(resultado).toEqual(mockRegra);
    });

    it('deve repassar erro se for um erro de duplicidade do prisma', async () => {
      const dbError = new Error('Database Error');
      dbError.code = 'P2002';
      ssoRepository.criarRegra.mockRejectedValue(dbError);

      await expect(ssoService.criarRegra({ tipo: 'DOMINIO', valor: 'x.com', acao: 'PERMITIR' }, { id: 1 }))
        .rejects.toThrow('Já existe uma regra cadastrada para este valor.');
    });
  });

  describe('deletarRegra', () => {
    it('deve deletar a regra com sucesso', async () => {
      ssoRepository.listarRegras.mockResolvedValue([{ id: 1 }]);
      ssoRepository.deletarRegra.mockResolvedValue(true);

      await ssoService.deletarRegra(1, { id: 1 });

      expect(ssoRepository.deletarRegra).toHaveBeenCalledWith(1);
      expect(auditoriaService.registrarLog).toHaveBeenCalled();
    });
  });

  describe('autenticarMicrosoft', () => {
    const mockToken = 'mocked.jwt.token';
    const mockDecoded = { sub: '123', email: 'user@empresa.com', name: 'User' };

    beforeEach(() => {
      jest.spyOn(ssoService, 'validarTokenMicrosoft').mockResolvedValue(mockDecoded);
    });

    it('deve lançar erro se SSO não tiver email/id', async () => {
      jest.spyOn(ssoService, 'validarTokenMicrosoft').mockResolvedValue({});
      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Não foi possível identificar o usuário');
    });

    it('deve barrar se e-mail estiver bloqueado', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([{ tipo: 'EMAIL', acao: 'BLOQUEAR' }]);
      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Acesso negado: Seu e-mail foi bloqueado');
    });

    it('deve barrar se domínio estiver bloqueado', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([{ tipo: 'DOMINIO', acao: 'BLOQUEAR' }]);
      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Acesso negado: O domínio');
    });

    it('deve barrar se exigir permissão e não houver regra de PERMITIR', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]); // sem regras de permitir
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(true);
      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Acesso negado: O domínio');
    });

    it('deve retornar erro se usuário estiver inativo no banco', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]);
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(false);
      ssoRepository.buscarPorSsoId.mockResolvedValue({ id: 1, ativo: false });
      
      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Acesso restrito');
    });

    it('deve autenticar usuário existente via ssoId', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]);
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(false);
      ssoRepository.buscarPorSsoId.mockResolvedValue({ id: 1, ativo: true });
      
      const res = await ssoService.autenticarMicrosoft(mockToken);
      expect(res.id).toBe(1);
    });

    it('deve vincular conta se e-mail já existir, mas não tiver ssoId', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]);
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(false);
      ssoRepository.buscarPorSsoId.mockResolvedValue(null);
      ssoRepository.buscarPorEmail.mockResolvedValue({ id: 1, ativo: true });
      ssoRepository.vincularSsoId.mockResolvedValue({ id: 1, ativo: true });
      
      await ssoService.autenticarMicrosoft(mockToken);
      expect(ssoRepository.vincularSsoId).toHaveBeenCalledWith(1, '123');
    });

    it('deve lançar erro se role OPERADOR não for encontrada na criação', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]);
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(false);
      ssoRepository.buscarPorSsoId.mockResolvedValue(null);
      ssoRepository.buscarPorEmail.mockResolvedValue(null);
      ssoRepository.buscarRolePorNome.mockResolvedValue(null);

      await expect(ssoService.autenticarMicrosoft(mockToken))
        .rejects.toThrow('Role padrão OPERADOR não encontrada');
    });

    it('deve criar um novo usuário no banco com sucesso', async () => {
      ssoRepository.buscarRegrasAplicaveis.mockResolvedValue([]);
      ssoRepository.oSistemaExigePermissaoExplicita.mockResolvedValue(false);
      ssoRepository.buscarPorSsoId.mockResolvedValue(null);
      ssoRepository.buscarPorEmail.mockResolvedValue(null);
      ssoRepository.buscarRolePorNome.mockResolvedValue({ id: 2 });
      ssoRepository.criarUsuarioSso.mockResolvedValue({ id: 5 });

      const res = await ssoService.autenticarMicrosoft(mockToken);
      expect(res.id).toBe(5);
    });
  });
});
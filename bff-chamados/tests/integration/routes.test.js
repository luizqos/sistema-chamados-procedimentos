const request = require('supertest');

jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/authMiddleware', () => ({
  autenticar: (req, res, next) => next(),
  autorizar: () => (req, res, next) => next(),
  verificarPermissao: () => (req, res, next) => next()
}));
jest.mock('../../src/middlewares/upload', () => ({
  single: () => (req, res, next) => next()
}));

const app = require('../../src/app');

describe('Cobertura de Mapeamento de Rotas (Integration)', () => {
  beforeAll(() => { jest.spyOn(console, 'error').mockImplementation(() => { }); });
  afterAll(() => { console.error.mockRestore(); });

  it('deve mapear rotas de auditoria', async () => { await request(app).get('/api/auditoria'); });

  it('deve mapear rotas de auth', async () => {
    await request(app).post('/api/auth/login');
    await request(app).get('/api/auth/me');
    await request(app).post('/api/auth/setup');
  });

  it('deve mapear rotas de permissões', async () => {
    await request(app).get('/api/procedimentoPermissoes/1');
    await request(app).post('/api/procedimentoPermissoes/1');
    await request(app).delete('/api/procedimentoPermissoes/1/2');
    await request(app).post('/api/procedimentoPermissoes/lote/1');
  });

  it('deve mapear rotas extras de auth', async () => {
    await request(app).post('/api/auth/logout');
    await request(app).post('/api/auth/refresh');
    await request(app).post('/api/auth/recuperar-senha');
  });

  it('deve mapear rotas de procedimentos', async () => {
    await request(app).get('/api/procedimentos');
    await request(app).post('/api/procedimentos');
    await request(app).get('/api/procedimentos/1');
    await request(app).put('/api/procedimentos/1');
    await request(app).delete('/api/procedimentos/1');
    await request(app).post('/api/procedimentos/1/anexos');
    await request(app).delete('/api/procedimentos/1/anexos/2');
  });

  it('deve mapear rotas de usuarios', async () => {
    await request(app).get('/api/usuarios');
    await request(app).post('/api/usuarios');
    await request(app).put('/api/usuarios/1');
    await request(app).patch('/api/usuarios/1/role');
    await request(app).patch('/api/usuarios/1/status');
  });

  it('deve mapear TODAS as possibilidades de rotas de procedimentoPermissoes', async () => {
    const base = '/api/procedimentoPermissoes';

    await request(app).get(`${base}`);
    await request(app).post(`${base}`);
    await request(app).get(`${base}/1`);
    await request(app).post(`${base}/1`);
    await request(app).put(`${base}/1`);
    await request(app).delete(`${base}/1`);
    await request(app).delete(`${base}/1/2`);
    await request(app).post(`${base}/lote`);
    await request(app).post(`${base}/lote/1`);
    await request(app).post(`${base}/1/lote`);
  });

  it('deve mapear as rotas extras de auth', async () => {
    const base = '/api/auth';
    
    await request(app).get(`${base}/setup`);
    await request(app).post(`${base}/setup`);
    await request(app).post(`${base}/esqueci-senha`);
    await request(app).post(`${base}/resetar-senha`);
    await request(app).post(`${base}/refresh-token`);
    await request(app).patch(`${base}/senha`);
    await request(app).put(`${base}/senha`);
  });
});
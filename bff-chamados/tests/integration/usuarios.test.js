const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

describe('GET /api/usuarios', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'segredo-falso-para-testes';
  });

  it('deve retornar 401 se nenhum token for fornecido', async () => {
    const response = await request(app).get('/api/usuarios');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token não fornecido');
  });

  it('deve retornar 403 se o usuário não for ADMIN ou OPERADOR', async () => {
    const token = jwt.sign({ id: 99, role: 'VISITANTE' }, process.env.JWT_SECRET);

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });
});
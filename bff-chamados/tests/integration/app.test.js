const request = require('supertest');
const app = require('../../src/app');

describe('App Global Handlers', () => {
  it('deve retornar 404 para uma rota que não existe no sistema', async () => {
    const response = await request(app).get('/api/rota-fantasma-999');
    expect(response.status).toBe(404);
  });
});
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('deve retornar status OK e banco de dados saudável', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('database', 'healthy');
  });
});
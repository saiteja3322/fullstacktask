import request from 'supertest';
import app from '../src/app.js';

describe('Auth Integration API Tests', () => {
  it('GET /health - should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('POST /api/v1/auth/login - should fail with invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'nonexistent@erp.com',
      password: 'WrongPassword123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

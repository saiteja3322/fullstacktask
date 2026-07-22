import request from 'supertest';
import app from '../src/app.js';

describe('Products API Authorization Tests', () => {
  it('GET /api/v1/products - should return 401 Unauthorized without token', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

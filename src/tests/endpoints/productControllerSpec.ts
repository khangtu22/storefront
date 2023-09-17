import supertest from 'supertest';
import app from '../../index';
import { createJWTToken } from '../../middlewares/auth';

const request = supertest(app);
const token: string = createJWTToken(1, 'bearer');

describe('Test Products Controller', function () {
  it('Should return 200 status code on /api/products', async function () {
    const response = await request.get('/api/products');
    expect(response.status).toBe(200);
  });

  it('should return 404 for unknown route', async function () {
    const response = await request.get('/unknown');
    expect(response.status).toBe(404);
  });

  it('Should return a new product after it is created POST: /api/products', async function () {
    const data = {
      name: 'Test',
      price: 40,
      category: 'category a',
    };

    const response = await request
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(data)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).not.toBeNull();
    expect(response.body.name).toBe(data.name);
    expect(response.body.price).toBe(data.price.toString());
    expect(response.body.category).toBe(data.category);

    const getProductResponse = await request
      .get(`/api/products/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getProductResponse.body).toEqual(response.body);
  });

  it('Should return 500 due to lack of JWT token', async function () {
    const data = {
      name: 'Test B',
      price: 40,
      category: 'category B',
    };

    await request.post('/api/products').send(data).expect(500);
  });

  it('Should return products by category GET: /api/products/category/:category', async function () {
    const category = 'category a';

    const response = await request
      .get(`/api/products/category/${category}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((product: any) => {
      expect(product.id).not.toBeNull();
      expect(product.category).toBe(category);
    });
  });
});

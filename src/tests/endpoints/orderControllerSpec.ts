import supertest from 'supertest';
import app from '../../index';
import { createJWTToken } from '../../middlewares/auth';
import { UserRepository } from '../../models/User';
import { ProductRepository } from '../../models/Product';
import { ProductType } from '../../interfaces/Product';

const request = supertest(app);
const token: string = createJWTToken(1, 'bearer');
const userModel: UserRepository = new UserRepository();
const productModel: ProductRepository = new ProductRepository();

describe('Test Order Router', () => {
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const dataUser = {
      firstname: 'TestFirstName',
      lastname: 'TestLastName',
      password: 'TestPassword',
    };
    const dataProduct: ProductType = {
      name: 'Test',
      price: '40',
      category: 'category a',
    };
    const user = await userModel.createUser(dataUser);
    const product = await productModel.createProduct(dataProduct);

    userId = user.id;
    productId = product.id;
  });

  it('Should create a new order', async () => {
    const newOrder = {
      product_id: productId,
      quantity: 12,
      user_id: userId,
      status: 'complete',
    };

    const response = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder);

    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
    expect(response.body.product_id).toBe(newOrder.product_id);
    expect(response.body.quantity).toBe(newOrder.quantity);
    expect(response.body.user_id).toBe(newOrder.user_id);
    expect(response.body.status).toBe(newOrder.status);

    orderId = response.body.id;
  });

  it('Should return all orders for a user', async () => {
    const response = await request
      .get(`/api/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('Should return the current order for a user', async () => {
    const response = await request
      .get(`/api/orders/current/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('Should return active orders for a user', async () => {
    const response = await request
      .get(`/api/orders/active/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('Should return completed orders for a user', async () => {
    const userId = 1;

    const response = await request
      .get(`/api/orders/completed/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('Should update an order status', async () => {
    const orderId = 1;
    const status = 'active';

    const response = await request
      .put('/api/orders')
      .query({ orderId, status })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

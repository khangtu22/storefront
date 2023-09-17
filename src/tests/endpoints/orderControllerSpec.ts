import supertest from 'supertest';
import app from '../../index';
import { createJWTToken } from '../../middlewares/auth';
import { UserRepository } from '../../models/User';
import { ProductRepository } from '../../models/Product';
import { ProductType } from '../../interfaces/Product';
import { OrderResponseDTO } from '../../interfaces/dtos/OrderResponseDTO';

const request = supertest(app);
const token: string = createJWTToken(1, 'bearer');
const userModel: UserRepository = new UserRepository();
const productModel: ProductRepository = new ProductRepository();

describe('Test Order Router', () => {
  let userId: number;
  let productId: number;

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
    const newOrderComplete = {
      product_id: productId,
      quantity: 12,
      user_id: userId,
      status: 'complete',
    };

    const newOrderActive = {
      product_id: productId,
      quantity: 12,
      user_id: userId,
      status: 'active',
    };
    const responseCompleteOrder = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrderComplete);

    const responseActiveOrder = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrderActive);

    const orderResponseComplete: OrderResponseDTO = responseCompleteOrder.body;
    const orderResponseActive: OrderResponseDTO = responseActiveOrder.body;

    expect(responseCompleteOrder.status).toBe(200);
    expect(orderResponseComplete.id).not.toBeNull();
    expect(orderResponseComplete.product_id).toBe(newOrderComplete.product_id);
    expect(orderResponseComplete.quantity).toBe(newOrderComplete.quantity);
    expect(orderResponseComplete.user_id).toBe(newOrderComplete.user_id);
    expect(orderResponseComplete.status).toBe(newOrderComplete.status);
    expect(responseCompleteOrder.body).toBeDefined();

    expect(responseActiveOrder.status).toBe(200);
    expect(orderResponseActive.id).not.toBeNull();
    expect(orderResponseActive.product_id).toBe(newOrderActive.product_id);
    expect(orderResponseActive.quantity).toBe(newOrderActive.quantity);
    expect(orderResponseActive.user_id).toBe(newOrderActive.user_id);
    expect(orderResponseActive.status).toBe(newOrderActive.status);
    expect(responseActiveOrder.body).toBeDefined();
  });

  it('Should return all orders for a user', async () => {
    const response = await request
      .get(`/api/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((order: any) => {
      expect(order.id).not.toBeNull();
      expect(order.user_id).toBe(userId);
    });
  });

  it('Should return the current order for a user', async () => {
    const response = await request
      .get(`/api/orders/current/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).not.toBeNull();
  });

  it('Should return active orders for a user', async () => {
    const response = await request
      .get(`/api/orders/active/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((order: any) => {
      expect(order.id).not.toBeNull();
      expect(order.user_id).toBe(userId);
      expect(order.status).toBe('active');
    });
  });

  it('Should return completed orders for a user', async () => {
    const response = await request
      .get(`/api/orders/completed/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((order: any) => {
      expect(order.id).not.toBeNull();
      expect(order.user_id).toBe(userId);
      expect(order.status).toBe('complete');
    });
  });
});

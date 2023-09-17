import supertest from 'supertest';
import app from '../../index';
import { createJWTToken } from '../../middlewares/auth';
import { UserRepository } from '../../models/User';
import { ProductRepository } from '../../models/Product';
import { ProductType } from '../../interfaces/Product';
import { OrderResponseDTO } from '../../interfaces/dtos/OrderResponseDTO';
import { OrderType } from '../../interfaces/Order';

const request = supertest(app);
const token: string = createJWTToken(1, 'bearer');
const userModel: UserRepository = new UserRepository();
const productModel: ProductRepository = new ProductRepository();

describe('Test Order Router', () => {
  let userId: number;
  let productId: number;
  let productId2: number;

  beforeAll(async () => {
    const dataUser = {
      firstname: 'TestFirstName',
      lastname: 'TestLastName',
      password: 'TestPassword',
    };
    const dataProduct1: ProductType = {
      name: 'Test 1',
      price: '40',
      category: 'category a',
    };

    const dataProduct2: ProductType = {
      name: 'Test 2',
      price: '20',
      category: 'category b',
    };
    const user = await userModel.createUser(dataUser);
    const product1 = await productModel.createProduct(dataProduct1);
    const product2 = await productModel.createProduct(dataProduct2);

    userId = user.id;
    productId = product1.id;
    productId2 = product2.id;
  });

  it('Should create a new order', async () => {
    const newOrderProductType1 = {
      product_id: productId,
      quantity: 10,
    };
    const newOrderProductType2 = {
      product_id: productId2,
      quantity: 20,
    };
    const newOrderActive: OrderType = {
      user_id: userId,
      status: 'active',
      orderProducts: [newOrderProductType1, newOrderProductType2],
    };

    const responseActiveOrder = await request
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrderActive);

    const orderResponseActive: OrderResponseDTO = responseActiveOrder.body;

    expect(responseActiveOrder.status).toBe(200);
    expect(orderResponseActive.id).not.toBeNull();
    expect(orderResponseActive.user_id).toBe(newOrderActive.user_id);
    expect(orderResponseActive.status).toBe(newOrderActive.status);
    expect(orderResponseActive.orderProducts).toBeInstanceOf(Array);
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

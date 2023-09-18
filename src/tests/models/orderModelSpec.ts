import { OrderRepository } from '../../models/Order';
import { OrderType } from '../../interfaces/Order';
import { UserRepository } from '../../models/User';
import pool from '../../database';

describe('OrderRepository', () => {
  let orderModel: OrderRepository;
  let userModel: UserRepository;
  let testUser1Id: number;
  let testUser2Id: number;
  let testOrder1Id: number;

  beforeAll(async () => {
    orderModel = new OrderRepository();
    userModel = new UserRepository();

    const dataUser1 = {
      firstname: 'TestFirstName1',
      lastname: 'TestLastName1',
      password: 'TestPassword1',
    };

    const dataUser2 = {
      firstname: 'TestFirstName2',
      lastname: 'TestLastName2',
      password: 'TestPassword2',
    };

    const testUser1 = await userModel.createUser(dataUser1);
    testUser1Id = testUser1.id;

    const testUser2 = await userModel.createUser(dataUser2);
    testUser2Id = testUser2.id;

    const testOrder1: OrderType = {
      user_id: testUser1Id,
      status: 'complete',
      orderProducts: [],
    };

    const createdOrder = await orderModel.createOrder(testOrder1);
    testOrder1Id = createdOrder.id;
  });

  // getAllOrdersByUserId
  it('gets all orders for a user', async () => {
    const orders = await orderModel.getAllOrdersByUserId(testUser1Id);
    expect(orders.length).toBeGreaterThan(0);
    orders.forEach((order) => {
      expect(order.user_id).toEqual(testUser1Id);
    });
  });

  it('throws error if user not found', async () => {
    try {
      await orderModel.getAllOrdersByUserId(999);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });


  it('should throw an error when no current order is found', async () => {
    const userId = 999;
    try {
      await orderModel.getCurrentOrderByUserId(userId);
      throw new Error('Expected promise to be rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  // getActiveOrdersByUserId
  it('gets active orders for user', async () => {
    // mark test order as active
    await orderModel.updateOrderStatus('active', testOrder1Id);

    const orders = await orderModel.getActiveOrdersByUserId(testUser1Id);
    orders.forEach((order) => {
      expect(order.status).toEqual('active');
    });
  });

  // getCompletedOrdersByUserId
  it('gets completed orders for user', async () => {
    // mark test order as completed
    await orderModel.updateOrderStatus('complete', testOrder1Id);

    const orders = await orderModel.getCompletedOrdersByUserId(testUser1Id);
    orders.forEach((order) => {
      expect(order.status).toEqual('complete');
    });
  });

  // createOrder
  it('creates a new order', async () => {
    const newOrder: OrderType = {
      user_id: testUser1Id,
      status: 'complete',
      orderProducts: [],
    };

    const createdOrder = await orderModel.createOrder(newOrder);
    expect(createdOrder.user_id).toEqual(newOrder.user_id);
    expect(createdOrder.status).toEqual(newOrder.status);
    expect(createdOrder.orderProducts.length).toEqual(
        newOrder.orderProducts.length,
    );
  });

  // updateOrderStatus
  it('updates order status', async () => {
    const updated = await orderModel.updateOrderStatus('active', testOrder1Id);

    expect(updated.status).toEqual('active');
  });
});

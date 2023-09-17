import { OrderType } from '../interfaces/Order';
import pool from '../database';
import { OrderResponseDTO } from '../interfaces/dtos/OrderResponseDTO';
import { OrderProductResponseDTO } from '../interfaces/dtos/OrderProductResponseDTO';

export class OrderRepository {
  private readonly tableName: string = 'orders';

  public async getAllOrdersByUserId(
    userId: number,
  ): Promise<OrderResponseDTO[]> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT *
                   FROM ${this.tableName}
                   WHERE user_id = $1`;
      const result = await conn.query(sql, [userId]);
      const orders: OrderResponseDTO[] = [];

      for (const row of result.rows) {
        const orderId = row.id;

        const orderProductSql =
          'SELECT * FROM order_products WHERE order_id = $1';
        const orderProductResult = await conn.query(orderProductSql, [orderId]);
        const orderProducts: OrderProductResponseDTO[] =
          orderProductResult.rows;

        const order: OrderResponseDTO = {
          id: row.id,
          user_id: row.user_id,
          status: row.status,
          orderProducts: orderProducts,
        };

        orders.push(order);
      }

      conn.release();
      return orders;
    } catch (error) {
      throw new Error(
        `Failed to retrieve all orders for user with ID ${userId}.`,
      );
    }
  }

  public async getCurrentOrderByUserId(
    userId: number,
  ): Promise<OrderResponseDTO> {
    try {
      const conn = await pool.connect();
      const sql = `SELECT *
                   FROM ${this.tableName}
                   WHERE user_id = $1
                   ORDER BY id DESC LIMIT 1`;
      const result = await conn.query(sql, [userId]);

      if (result.rows.length === 0) {
        throw new Error(`No current order found for user with ID ${userId}.`);
      }

      const orderId = result.rows[0].id;

      const orderProductSql =
        'SELECT * FROM order_products WHERE order_id = $1';
      const orderProductResult = await conn.query(orderProductSql, [orderId]);
      const orderProducts: OrderProductResponseDTO[] = orderProductResult.rows;

      const order: OrderResponseDTO = {
        id: result.rows[0].id,
        user_id: result.rows[0].user_id,
        status: result.rows[0].status,
        orderProducts: orderProducts,
      };

      conn.release();
      return order;
    } catch (error) {
      throw new Error(
        `Failed to retrieve the current order for user with ID ${userId}.`,
      );
    }
  }

  public async getActiveOrdersByUserId(
    userId: number,
  ): Promise<OrderResponseDTO[]> {
    try {
      const status = 'active';
      const conn = await pool.connect();
      const sql = `SELECT *
                   FROM ${this.tableName}
                   WHERE user_id = $1
                     AND status = $2`;
      const result = await conn.query(sql, [userId, status]);
      const orders: OrderResponseDTO[] = [];

      for (const row of result.rows) {
        const orderId = row.id;

        const orderProductSql =
          'SELECT * FROM order_products WHERE order_id = $1';
        const orderProductResult = await conn.query(orderProductSql, [orderId]);
        const orderProducts: OrderProductResponseDTO[] =
          orderProductResult.rows;

        const order: OrderResponseDTO = {
          id: row.id,
          user_id: row.user_id,
          status: row.status,
          orderProducts: orderProducts,
        };

        orders.push(order);
      }

      conn.release();
      return orders;
    } catch (error) {
      throw new Error(
        `Failed to retrieve active orders for user with ID ${userId}.`,
      );
    }
  }

  public async getCompletedOrdersByUserId(
    userId: number,
  ): Promise<OrderResponseDTO[]> {
    try {
      const status = 'complete';
      const conn = await pool.connect();
      const sql = `SELECT *
                   FROM ${this.tableName}
                   WHERE user_id = $1
                     AND status = $2`;
      const result = await conn.query(sql, [userId, status]);
      const orders: OrderResponseDTO[] = [];

      for (const row of result.rows) {
        const orderId = row.id;

        const orderProductSql =
          'SELECT * FROM order_products WHERE order_id = $1';
        const orderProductResult = await conn.query(orderProductSql, [orderId]);
        const orderProducts: OrderProductResponseDTO[] =
          orderProductResult.rows;

        const order: OrderResponseDTO = {
          id: row.id,
          user_id: row.user_id,
          status: row.status,
          orderProducts: orderProducts,
        };

        orders.push(order);
      }

      conn.release();
      return orders;
    } catch (error) {
      throw new Error(
        `Failed to retrieve completed orders for user with ID ${userId}.`,
      );
    }
  }

  public async createOrder(order: OrderType): Promise<OrderResponseDTO> {
    try {
      const { user_id, status, orderProducts } = order;

      const conn = await pool.connect();
      await conn.query('BEGIN');

      const orderSql = `INSERT INTO ${this.tableName} (user_id, status)
                        VALUES ($1, $2) RETURNING id`;
      const orderResult = await conn.query(orderSql, [user_id, status]);
      const orderId = orderResult.rows[0].id;

      const orderProductSql = `INSERT INTO order_products (order_id, product_id, quantity)
                               VALUES ($1, $2, $3) RETURNING *`;

      const orderProductResponses: OrderProductResponseDTO[] = [];
      for (const orderProduct of orderProducts) {
        const { product_id, quantity } = orderProduct;
        const orderProductResult = await conn.query(orderProductSql, [
          orderId,
          product_id,
          quantity || 1,
        ]);
        const createdOrderProduct = orderProductResult.rows[0];
        orderProductResponses.push(createdOrderProduct);
      }

      await conn.query('COMMIT'); // Commit the transaction
      conn.release();

      const createdOrder: OrderResponseDTO = {
        id: orderId,
        user_id,
        status,
        orderProducts: orderProductResponses,
      };

      return createdOrder;
    } catch (error) {
      throw new Error('Failed to create the order.');
    }
  }

  public async updateOrderStatus(
    status: string,
    orderId: number,
  ): Promise<OrderResponseDTO> {
    try {
      const conn = await pool.connect();
      const sql = `UPDATE ${this.tableName}
                   SET status = $1
                   WHERE id = $2 RETURNING *`;
      const result = await conn.query(sql, [status, orderId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to update the status for order with ID ${orderId}.`,
      );
    }
  }

  public async deleteOrder(orderId: number): Promise<OrderResponseDTO> {
    try {
      const sql = `DELETE
                   FROM ${this.tableName}
                   WHERE id = $1 RETURNING *`;
      const conn = await pool.connect();
      const result = await conn.query(sql, [orderId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete the order with ID ${orderId}.`);
    }
  }
}

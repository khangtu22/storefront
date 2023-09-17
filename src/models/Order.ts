import { OrderType } from '../interfaces/Order';
import pool from '../database';
import { OrderResponseDTO } from '../interfaces/dtos/OrderResponseDTO';

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
      conn.release();

      return result.rows;
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
      conn.release();

      return result.rows[0];
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
      conn.release();

      return result.rows;
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
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to retrieve completed orders for user with ID ${userId}.`,
      );
    }
  }

  public async createOrder(order: OrderType): Promise<OrderResponseDTO> {
    try {
      const { product_id, quantity, user_id, status } = order;
      console.log(order);

      const conn = await pool.connect();
      const sql = `INSERT INTO ${this.tableName} (product_id, quantity, user_id, status)
                   VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await conn.query(sql, [
        product_id,
        quantity,
        user_id,
        status,
      ]);
      conn.release();

      return result.rows[0];
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

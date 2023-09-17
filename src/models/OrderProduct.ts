import { PoolClient, QueryResult } from 'pg';
import pool from '../database';
import { OrderProductResponseDTO } from '../interfaces/dtos/OrderProductResponseDTO';
import logger from '../middlewares/logger';

export class OrderProductRepository {
  private readonly tableName: string = 'products';

  public async createOrderProduct(
    orderProductId: number,
    orderId: number,
    productId: number,
    quantity: number = 1,
  ): Promise<OrderProductResponseDTO> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `INSERT INTO order_products (id, order_id, product_id, quantity)
                           VALUES ($1, $2, $3, $4) RETURNING *`;
      const result: QueryResult = await conn.query(sql, [
        orderProductId,
        orderId,
        productId,
        quantity,
      ]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      logger.error('Error retrieving order products:', error);
      throw new Error('Failed to create the order product.');
    }
  }

  public async getOrderProductsByOrderId(
    orderId: number,
  ): Promise<OrderProductResponseDTO[]> {
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id = $1';
      const values = [orderId];

      const result = await pool.query(sql, values);
      return result.rows;
    } catch (error) {
      logger.error('Error retrieving order products:', error);
      throw new Error('Failed to retrieve order products');
    }
  }

  public async deleteOrderProduct(
    orderProductId: number,
  ): Promise<OrderProductResponseDTO> {
    try {
      const sql: string = `DELETE
                           FROM order_products
                           WHERE id = $1 RETURNING *`;
      const conn: PoolClient = await pool.connect();
      const result: QueryResult = await conn.query(sql, [orderProductId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to delete the order product with ID ${orderProductId}.`,
      );
    }
  }
}

import { PoolClient, QueryResult } from 'pg';
import { ProductType } from '../interfaces/Product';
import pool from '../database';
import { ProductResponseDTO } from '../interfaces/dtos/ProductResponseDTO';

export class ProductRepository {
  private readonly tableName: string = 'products';

  public async getAllProducts(): Promise<ProductResponseDTO[]> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `SELECT *
                           FROM ${this.tableName}`;
      const result: QueryResult = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error('Failed to retrieve all products.');
    }
  }

  public async getProductById(productId: number): Promise<ProductResponseDTO> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `SELECT *
                           FROM ${this.tableName}
                           WHERE id = $1`;
      const result: QueryResult = await conn.query(sql, [productId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to retrieve product by ID.');
    }
  }

  public async getProductsByCategory(
    category: string,
  ): Promise<ProductResponseDTO[]> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `SELECT *
                           FROM ${this.tableName}
                           WHERE category = $1`;
      const result: QueryResult = await conn.query(sql, [category]);
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error('Failed to retrieve products by category.');
    }
  }

  public async createProduct(
    product: ProductType,
  ): Promise<ProductResponseDTO> {
    try {
      const { name, price, category } = product;
      const conn: PoolClient = await pool.connect();
      const sql: string = `INSERT INTO ${this.tableName} (name, price, category)
                           VALUES ($1, $2, $3) RETURNING *`;
      const result: QueryResult = await conn.query(sql, [
        name,
        price,
        category,
      ]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to create the product.');
    }
  }

  public async deleteProduct(productId: number): Promise<ProductResponseDTO> {
    try {
      const sql: string = `DELETE
                           FROM ${this.tableName}
                           WHERE id = $1 RETURNING *`;
      const conn: PoolClient = await pool.connect();
      const result: QueryResult = await conn.query(sql, [productId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete the product with ID ${productId}.`);
    }
  }
}

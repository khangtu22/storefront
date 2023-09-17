import bcrypt from 'bcrypt';
import { PoolClient, QueryResult } from 'pg';
import { UserType } from '../interfaces/User';
import pool from '../database';
import { generateToken } from '../utils/utils';
import { UserResponseDTO } from '../interfaces/dtos/UserResponseDTO';
import { UserCreatedResponseDTO } from '../interfaces/dtos/UserCreatedResponseDTO';

export class UserRepository {
  private readonly tableName: string = 'users';

  public async getAllUsers(): Promise<UserResponseDTO[]> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `SELECT *
                           FROM ${this.tableName}`;
      const result: QueryResult = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error('Failed to retrieve all users.');
    }
  }

  public async getUserById(userId: number): Promise<UserResponseDTO> {
    try {
      const conn: PoolClient = await pool.connect();
      const sql: string = `SELECT *
                           FROM ${this.tableName}
                           WHERE id = $1`;
      const result: QueryResult = await conn.query(sql, [userId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error('Failed to retrieve user by ID.');
    }
  }

  public async createUser(user: UserType): Promise<UserCreatedResponseDTO> {
    try {
      const { firstname, lastname, password } = user;
      const pepper: string = process.env.BCRYPT_PASSWORD as string;
      const salt: string = process.env.SALT_ROUNDS as string;

      const hashPassword: string = bcrypt.hashSync(
        password + pepper,
        parseInt(salt),
      );
      const conn: PoolClient = await pool.connect();
      const sql: string = `INSERT INTO ${this.tableName} (firstName, lastName, password)
                           VALUES ($1, $2, $3) RETURNING *`;
      const result: QueryResult = await conn.query(sql, [
        firstname,
        lastname,
        hashPassword,
      ]);
      conn.release();

      const id: number = result.rows[0].id;
      const token: string = generateToken(id);
      return {
        id: id,
        auth: true,
        token,
      };
    } catch (error) {
      throw new Error('Failed to create the user.');
    }
  }

  public async deleteUser(userId: number): Promise<UserResponseDTO> {
    try {
      const sql: string = `DELETE
                           FROM ${this.tableName}
                           WHERE id = $1 RETURNING *`;
      const conn: PoolClient = await pool.connect();
      const result: QueryResult = await conn.query(sql, [userId]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete the user with ID ${userId}.`);
    }
  }
}

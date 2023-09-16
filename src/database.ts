import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  POSTGRES_PRO_DB,
  ENV,
} = process.env;

let client: Pool;

switch (ENV) {
case 'test':
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  break;
case 'pro':
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_PRO_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  break;
default:
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  break;
}

client.on('error', () => {
  process.exit(-1);
});

export default client;

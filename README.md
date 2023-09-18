# Storefront Git Readme

This readme provides guidelines and best practices for setting up and running the Storefront application. Please follow the instructions below to ensure a smooth setup and deployment.

## Database Setup

To set up the database for the Storefront application, follow these steps:

1. Create a new user for the database with the following command:
   ````sql
   CREATE USER storefront_user WITH PASSWORD 'storefront_user_password';
   ````

2. Create the main database for the application:
   ````sql
   CREATE DATABASE storefront;
   ````

3. Connect to the storefront database:
   ````sql
   \c storefront;
   ````

4. Grant all privileges on the storefront database to the storefront user:
   ````sql
   GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
   ````

5. Create a separate test database for running tests:
   ````sql
   CREATE DATABASE storefront_test;
   ````

6. Connect to the storefront_test database:
   ````sql
   \c storefront_test;
   ````

7. Grant all privileges on the storefront_test database to the storefront user:
   ````sql
   GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront_user;
   ````

## Environment Variables

Create a `.env` file in the root directory of the application and populate it with the following environment variables:

```plaintext
POSTGRES_HOST=localhost
POSTGRES_DB=storefront
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_TEST_DB=storefront_test

ENV=dev

SALT_ROUNDS=10
BCRYPT_PASSWORD=random_password
JWT_SECRET=410b5c68ebf185103713fb38e00fba91db8dcf26885c5a21d61db9865df886d5
```

Make sure to replace the values with appropriate configurations for your environment.

## Creating the Product Table

To create the `products` table in the database, execute the following SQL command:

```sql
CREATE TABLE products(
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL,
                       price NUMERIC NOT NULL,
                       category VARCHAR(50)
);
```

## Creating the Users Table

To create the `users` table in the database, execute the following SQL command:

```sql
CREATE TABLE users(
                    id SERIAL PRIMARY KEY,
                    firstName VARCHAR(50) NOT NULL,
                    lastName VARCHAR(50) NOT NULL,
                    password VARCHAR(60) NOT NULL
);
```

## Creating the Orders Table

To create the `orders` table in the database, execute the following SQL commands:

```sql
CREATE TYPE status AS ENUM ('active', 'complete');

CREATE TABLE orders
(
  id         SERIAL PRIMARY KEY,
  product_id INTEGER,
  quantity   INTEGER DEFAULT 1,
  user_id    INTEGER,
  status     status NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Running the Application

To run the Storefront application, follow these steps:

1. Install the required dependencies:
   ````
   npm install
   ````

2. Build the application:
   ````
   npm run build
   ````

3. Run linting:
   ````
   npm run lint
   ````

4. Run prettify:
   ````
   npm run prettify
   ````

5. Run tests:
   ````
   npm run test
   ````

6. Start the backend server:
   ````
   npm run start
   ````

This will run the Node server on port 3000, and the database will be accessible on port 5432.
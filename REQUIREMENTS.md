# Database Schema

The following table illustrates the database schema used in the project:

### Users Table

| Column     | Data Type   | Constraints |
|------------|-------------|-------------|
| id         | SERIAL      | PRIMARY KEY |
| firstName  | VARCHAR(50) | NOT NULL    |
| lastName   | VARCHAR(50) | NOT NULL    |
| password   | VARCHAR(60) | NOT NULL    |

### Products Table

| Column   | Data Type   | Constraints |
|----------|-------------|-------------|
| id       | SERIAL      | PRIMARY KEY |
| name     | VARCHAR(50) | NOT NULL    |
| price    | NUMERIC     | NOT NULL    |
| category | VARCHAR(50) |             |

### Orders Table

| Column   | Data Type | Constraints                                      |
|----------|-----------|--------------------------------------------------|
| id       | SERIAL    | PRIMARY KEY                                      |
| user_id  | INTEGER   |                                                  |
| status   | status    | NOT NULL                                         |
| user_id  | INTEGER   | FOREIGN KEY (user_id) REFERENCES users (id)      |

### Order Products Table

| Column     | Data Type | Constraints                                                |
|------------|-----------|------------------------------------------------------------|
| id         | SERIAL    | PRIMARY KEY                                                |
| order_id   | INTEGER   |                                                            |
| product_id | INTEGER   |                                                            |
| quantity   | INTEGER   | DEFAULT 1                                                  |
| order_id   | INTEGER   | FOREIGN KEY (order_id) REFERENCES orders (id)              |
| product_id | INTEGER   | FOREIGN KEY (product_id) REFERENCES products (id)          |

# Diagram

![img.png](img.png)


# Describe

#### users
- id (PRIMARY KEY): Unique identifier for each user
- firstName: User's first name
- lastName: User's last name
- password: User's password

#### products
- id (PRIMARY KEY): Unique identifier for each product
- name: Product name
- price: Product price
- category: Product category

#### orders
- id (PRIMARY KEY): Unique order ID
- user_id: ForeignKey linking order to its owning user
- status: Order status (e.g pending, completed)

#### order_products
- id (PRIMARY KEY): Unique identifier for order-product relationship
- order_id: ForeignKey linking order-product to specific order
- product_id: ForeignKey linking order-product to specific product
- quantity: Quantity of product ordered (defaults to 1 if not specified)

# Product API

## Routes

- Get all products
    - URL: `/api/products`
    - Method: GET
    - Description: Retrieves all products.

- Get product by ID
    - URL: `/api/products/:id`
    - Method: GET
    - Description: Retrieves a specific product by ID.

- Get products by category
    - URL: `/api/products/category/:category`
    - Method: GET
    - Description: Retrieves products based on a specific category.

- Create product
    - URL: `/api/products`
    - Method: POST
    - Description: Creates a new product.

- Delete product by ID
    - URL: `/api/products/:id`
    - Method: DELETE
    - Description: Deletes a specific product by ID.

## Error Handling

- Middleware for error handling is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.

# Order API

## Routes

- Get all orders by user ID
    - URL: `/api/orders/:user_id`
    - Method: GET
    - Description: Retrieves all orders for a specific user.

- Get current order by user ID
    - URL: `/api/orders/current/:user_id`
    - Method: GET
    - Description: Retrieves the current order for a specific user.

- Get active orders by user ID
    - URL: `/api/orders/active/:user_id`
    - Method: GET
    - Description: Retrieves all active orders for a specific user.
```agsl
curl --location --request GET 'http://localhost:3000/api/orders/active/2' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.MTQ.KWzNnr0CSmbqiqTsJp6Mm598PA4YSGklc8kZWh2Y44I' \
```

- Get completed orders by user ID
    - URL: `/api/orders/completed/:user_id`
    - Method: GET
    - Description: Retrieves all completed orders for a specific user.

```agsl
curl --location --request GET 'http://localhost:3000/api/orders/completed/2' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.MTQ.KWzNnr0CSmbqiqTsJp6Mm598PA4YSGklc8kZWh2Y44I' \
```
- Update order status
    - URL: `/api/orders`
    - Method: PUT
    - Description: Updates the status of an order.

- Delete order by ID
    - URL: `/api/orders/:id`
    - Method: DELETE
    - Description: Deletes a specific order by ID.

- Create order
    - URL: `/api/orders`
    - Method: POST
    - Description: Creates a new order.
    - Request data example:
```agsl
  {
      "user_id": 1,
      "status": "complete",
      "orderProducts": [
          {
            "product_id": 1,
            "quantity": 12
          },
          {
            "product_id": 2,
            "quantity": 22
          }
      ]
    }
```

Example create order:
```agsl
curl --location 'http://localhost:3000/api/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.MTQ.KWzNnr0CSmbqiqTsJp6Mm598PA4YSGklc8kZWh2Y44I' \
--data '  {

      "user_id": 1,
      "status": "complete",
      "orderProducts": [
          {
            "product_id": 1,
            "quantity": 12
          },
          {
            "product_id": 2,
            "quantity": 22
          }
      ]
    }'
```
## Error Handling

- Error handling middleware is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.

# User API

## Routes

- Get all users
    - URL: `/api/users`
    - Method: GET
    - Description: Retrieves all users.

- Get user by ID
    - URL: `/api/users/:id`
    - Method: GET
    - Description: Retrieves a specific user by their ID.

- Create user
    - URL: `/api/users`
    - Method: POST
    - Description: Creates a new user.

- Delete user by ID
    - URL: `/api/users/:id`
    - Method: DELETE
    - Description: Deletes a specific user by their ID.

## Error Handling

- Error handling middleware is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.
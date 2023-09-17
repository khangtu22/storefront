# Product API

## Routes

- Get all products
    - URL: `/products`
    - Method: GET
    - Description: Retrieves all products.

- Get product by ID
    - URL: `/products/:id`
    - Method: GET
    - Description: Retrieves a specific product by ID.

- Get products by category
    - URL: `/products/category/:category`
    - Method: GET
    - Description: Retrieves products based on a specific category.

- Create product
    - URL: `/products`
    - Method: POST
    - Description: Creates a new product.

- Delete product by ID
    - URL: `/products/:id`
    - Method: DELETE
    - Description: Deletes a specific product by ID.

## Error Handling

- Middleware for error handling is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.

# Order API

## Routes

- Get all orders by user ID
    - URL: `/orders/:user_id`
    - Method: GET
    - Description: Retrieves all orders for a specific user.

- Get current order by user ID
    - URL: `/orders/current/:user_id`
    - Method: GET
    - Description: Retrieves the current order for a specific user.

- Get active orders by user ID
    - URL: `/orders/active/:user_id`
    - Method: GET
    - Description: Retrieves all active orders for a specific user.

- Get completed orders by user ID
    - URL: `/orders/completed/:user_id`
    - Method: GET
    - Description: Retrieves all completed orders for a specific user.

- Update order status
    - URL: `/orders`
    - Method: PUT
    - Description: Updates the status of an order.

- Delete order by ID
    - URL: `/orders/:id`
    - Method: DELETE
    - Description: Deletes a specific order by ID.

- Create order
    - URL: `/orders`
    - Method: POST
    - Description: Creates a new order.

## Error Handling

- Error handling middleware is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.

# User API

## Routes

- Get all users
    - URL: `/users`
    - Method: GET
    - Description: Retrieves all users.

- Get user by ID
    - URL: `/users/:id`
    - Method: GET
    - Description: Retrieves a specific user by their ID.

- Create user
    - URL: `/users`
    - Method: POST
    - Description: Creates a new user.

- Delete user by ID
    - URL: `/users/:id`
    - Method: DELETE
    - Description: Deletes a specific user by their ID.

## Error Handling

- Error handling middleware is included to catch and handle errors.
- Specific error messages and status codes are returned for different error scenarios.
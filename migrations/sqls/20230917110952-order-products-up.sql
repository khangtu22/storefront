/* Replace with your SQL commands */
CREATE TABLE order_products
(
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER,
    product_id INTEGER,
    quantity   INTEGER DEFAULT 1,

    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
);
/* Replace with your SQL commands */
CREATE TYPE status AS ENUM ('active', 'complete');

CREATE TABLE orders
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER,
    status     status NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
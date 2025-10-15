-- Database: supermarket_db
CREATE DATABASE IF NOT EXISTS supermarket_db;
USE supermarket_db;

-- Users table (customers and admins)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url TEXT,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price)
);

-- Orders table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Order items table (to store products in each order)
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
);



-- Sample queries for common operations:

-- 1. Customer places order (with transaction)
START TRANSACTION;

-- Insert order
INSERT INTO orders (user_id, total_amount, status) 
VALUES (1, 150.75, 'pending');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
VALUES 
(LAST_INSERT_ID(), 1, 2, 25.50, 51.00),
(LAST_INSERT_ID(), 2, 1, 99.75, 99.75);

-- Update product stock
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE id = 1;
UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = 2;

COMMIT;

-- 2. Get customer order history
SELECT 
    o.id as order_id,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 1
GROUP BY o.id
ORDER BY o.created_at DESC;

-- 3. Admin dashboard - sales summary
SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
FROM orders 
WHERE DATE(created_at) = CURDATE();

-- 4. Low stock alert
SELECT name, stock_quantity 
FROM products 
WHERE stock_quantity < 10 
ORDER BY stock_quantity ASC;





-- Insert sample users
INSERT INTO users (full_name, email, password, role) VALUES
('John Customer', 'john@email.com', 'hashed_password', 'customer'),
('Admin User', 'admin@supermarket.com', 'hashed_password', 'admin');

-- Insert sample products
INSERT INTO products (name, price, stock_quantity, category, description) VALUES
('Organic Apples', 2.99, 50, 'Fruits', 'Fresh organic apples'),
('Whole Wheat Bread', 3.49, 30, 'Bakery', 'Fresh whole wheat bread'),
('Milk 1L', 1.99, 100, 'Dairy', 'Fresh milk 1 liter'),
('Chicken Breast', 8.99, 25, 'Meat', 'Boneless chicken breast');

-- Insert sample order
INSERT INTO orders (user_id, total_amount, status) VALUES (1, 13.47, 'delivered');
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 2, 2.99, 5.98),
(1, 3, 1, 1.99, 1.99),
(1, 4, 1, 8.99, 8.99);
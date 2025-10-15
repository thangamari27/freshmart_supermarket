const { pool } = require('../config/database');

class Product {
  static async create(productData) {
    const { name, price, stock_quantity, image_url, category, description } = productData;
    const [result] = await pool.execute(
      'INSERT INTO products (name, price, stock_quantity, image_url, category, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, stock_quantity, image_url, category, description]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, productData) {
    const { name, price, stock_quantity, image_url, category, description } = productData;
    const [result] = await pool.execute(
      'UPDATE products SET name = ?, price = ?, stock_quantity = ?, image_url = ?, category = ?, description = ? WHERE id = ?',
      [name, price, stock_quantity, image_url, category, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async updateStock(id, quantity) {
    const [result] = await pool.execute(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
      [quantity, id, quantity]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;
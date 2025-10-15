const { pool } = require('../config/database');

class OrderItem {
  static async create(orderItemData) {
    const { order_id, product_id, quantity, unit_price, total_price } = orderItemData;
    const [result] = await pool.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
      [order_id, product_id, quantity, unit_price, total_price]
    );
    return result.insertId;
  }

  static async findByOrderId(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }
}

module.exports = OrderItem;
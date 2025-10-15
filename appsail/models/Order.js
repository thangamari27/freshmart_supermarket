const { pool } = require('../config/database');

class Order {
  static async create(orderData) {
    const { user_id, total_amount, status = 'pending' } = orderData;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [user_id, total_amount, status]
      );
      const orderId = result.insertId;

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT o.*, 
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT o.*, u.full_name as customer_name,
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT o.*, u.full_name as customer_name, u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByIdWithDetails(id) {
    const [rows] = await pool.execute(
      `SELECT o.*, u.full_name as customer_name, u.email,
              od.phone_number, od.delivery_address, od.special_instructions
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_details od ON o.id = od.order_id
      WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Order;
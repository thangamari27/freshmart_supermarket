const { pool } = require('../config/database');

class OrderDetail {
  static async create(orderDetailData) {
    const { order_id, customer_name, phone_number, delivery_address, special_instructions } = orderDetailData;
    const [result] = await pool.execute(
      'INSERT INTO order_details (order_id, customer_name, phone_number, delivery_address, special_instructions) VALUES (?, ?, ?, ?, ?)',
      [order_id, customer_name, phone_number, delivery_address, special_instructions]
    );
    return result.insertId;
  }

  static async findByOrderId(orderId) {
    const [rows] = await pool.execute(
      'SELECT * FROM order_details WHERE order_id = ?',
      [orderId]
    );
    return rows[0];
  }

  static async update(orderId, orderDetailData) {
    const { customer_name, phone_number, delivery_address, special_instructions } = orderDetailData;
    const [result] = await pool.execute(
      `UPDATE order_details 
       SET customer_name = ?, phone_number = ?, delivery_address = ?, special_instructions = ?
       WHERE order_id = ?`,
      [customer_name, phone_number, delivery_address, special_instructions, orderId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = OrderDetail;
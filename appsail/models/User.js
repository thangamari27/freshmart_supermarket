const { pool } = require('../config/database');

class User {
  static async create(userData) {
    const { full_name, email, password, role = 'customer' } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, updateData) {
    const { full_name, email } = updateData;
    const [result] = await pool.execute(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [full_name, email, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
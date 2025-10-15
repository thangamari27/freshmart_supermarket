const { verifyToken } = require('../utils/authUtils');
const User = require('../models/User');

const auth = {
  // Verify JWT token
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader?.replace('Bearer ', '').trim();

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Access denied. No token provided.'
        });
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. User not found.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.'
      });
    }
  },

  // Check if user is admin
  requireAdmin: (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }
    next();
  },

  // Check if user is customer
  requireCustomer: (req, res, next) => {
    if (req.user?.role !== 'customer') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Customer role required.'
      });
    }
    next();
  }
};

module.exports = auth;

const validation = {
  validateRegister: (req, res, next) => {
    const { full_name, email, password, confirmPassword } = req.body;

    if (!full_name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address'
      });
    }

    next();
  },

  validateLogin: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    next();
  },

  validateProduct: (req, res, next) => {
    const { name, price, stock_quantity } = req.body;

    if (!name || !price || stock_quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and stock quantity are required'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Price cannot be negative'
      });
    }

    if (stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock quantity cannot be negative'
      });
    }

    next();
  }
};

module.exports = validation;
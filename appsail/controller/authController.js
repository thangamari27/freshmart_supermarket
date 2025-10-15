const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');
const { comparePassword, hashPassword } = require('../utils/helper');

const authController = {
  async register(req, res) {
    try {
      const { full_name, email, password, role = 'customer' } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const userId = await User.create({
        full_name,
        email,
        password: hashedPassword,
        role
      });

      // Get user data without password
      const user = await User.findById(userId);

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed: ' + error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      // Generate token
      const token = generateToken(userWithoutPassword);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Login failed: ' + error.message
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get profile: ' + error.message
      });
    }
  }
};

module.exports = authController;
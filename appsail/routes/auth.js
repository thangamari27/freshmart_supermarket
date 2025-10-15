const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public routes
router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);

// Protected routes
router.get('/profile', auth.authenticate, authController.getProfile);

module.exports = router;
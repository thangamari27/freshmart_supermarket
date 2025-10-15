const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController');
const auth = require('../middleware/auth');

// Customer routes
router.post('/', auth.authenticate, orderController.createOrder);
router.get('/my-orders', auth.authenticate, orderController.getUserOrders);
router.get('/:id', auth.authenticate, orderController.getOrderDetails);

// Admin routes
router.get('/', auth.authenticate, auth.requireAdmin, orderController.getAllOrders);
router.put('/:id/status', auth.authenticate, auth.requireAdmin, orderController.updateOrderStatus);

module.exports = router;
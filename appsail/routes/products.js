const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.post('/', auth.authenticate, auth.requireAdmin, validation.validateProduct, productController.createProduct);
router.put('/:id', auth.authenticate, auth.requireAdmin, validation.validateProduct, productController.updateProduct);
router.delete('/:id', auth.authenticate, auth.requireAdmin, productController.deleteProduct);

module.exports = router;
const Product = require('../models/Product');

const productController = {
  async createProduct(req, res) {
    try {
      const { name, price, stock_quantity, image_url, category, description } = req.body;

      const productId = await Product.create({
        name,
        price,
        stock_quantity,
        image_url,
        category,
        description
      });

      const product = await Product.findById(productId);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create product: ' + error.message
      });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      
      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products: ' + error.message
      });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product: ' + error.message
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const productExists = await Product.findById(id);
      if (!productExists) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      const updated = await Product.update(id, updateData);
      
      if (updated) {
        const product = await Product.findById(id);
        res.json({
          success: true,
          message: 'Product updated successfully',
          data: { product }
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to update product'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update product: ' + error.message
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const productExists = await Product.findById(id);
      if (!productExists) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      const deleted = await Product.delete(id);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to delete product'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete product: ' + error.message
      });
    }
  }
};

module.exports = productController;
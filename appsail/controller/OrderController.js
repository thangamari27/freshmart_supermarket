const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');
const { pool } = require('../config/database');

const orderController = {
  async createOrder(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { user_id, items, total_amount, order_details } = req.body;

      // Create order
      const orderId = await Order.create({
        user_id,
        total_amount,
        status: 'pending'
      });

      // Create order details
      await OrderDetail.create({
        order_id: orderId,
        customer_name: order_details.customer_name,
        phone_number: order_details.phone_number,
        delivery_address: order_details.delivery_address,
        special_instructions: order_details.special_instructions
      });

      // Create order items and update product stock
      for (const item of items) {
        // Create order item
        await OrderItem.create({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        });

        // Update product stock
        const stockUpdated = await Product.updateStock(item.product_id, item.quantity);
        if (!stockUpdated) {
          throw new Error(`Insufficient stock for product ${item.product_id}`);
        }
      }

      await connection.commit();

      const order = await Order.findById(orderId);
      const orderItems = await OrderItem.findByOrderId(orderId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: {
            ...order,
            items: orderItems
          }
        }
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        error: 'Failed to create order: ' + error.message
      });
    } finally {
      connection.release();
    }
  },

  async getUserOrders(req, res) {
    try {
      const orders = await Order.findByUserId(req.user.id);
      
      res.json({
        success: true,
        data: { orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders: ' + error.message
      });
    }
  },

  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
      
      res.json({
        success: true,
        data: { orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders: ' + error.message
      });
    }
  },

  async getOrderDetails(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Check if user owns the order or is admin
      if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const orderItems = await OrderItem.findByOrderId(req.params.id);

      res.json({
        success: true,
        data: {
          order: {
            ...order,
            items: orderItems
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order details: ' + error.message
      });
    }
  },

  async getOrderDetails(req, res) {
    try {
      // Use the new method that includes order details
      const order = await Order.findByIdWithDetails(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const orderItems = await OrderItem.findByOrderId(req.params.id);

      res.json({
        success: true,
        data: {
          order: {
            ...order,
            items: orderItems
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order details: ' + error.message
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const orderExists = await Order.findById(id);
      if (!orderExists) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      const updated = await Order.updateStatus(id, status);
      
      if (updated) {
        const order = await Order.findById(id);
        res.json({
          success: true,
          message: 'Order status updated successfully',
          data: { order }
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to update order status'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update order status: ' + error.message
      });
    }
  }
};

module.exports = orderController;
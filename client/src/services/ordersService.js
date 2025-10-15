import api from './api.js';

export const ordersService = {
  getAllOrders: async () => {
    return await api.get('/orders');
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  updateOrderStatus: async (id, status) => {
    return await api.put(`/orders/${id}/status`, { status });
  },

  getUserOrders: async () => {
    return await api.get('/orders/my-orders');
  }
};
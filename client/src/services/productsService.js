import api from './api.js';

export const productsService = {
  getAllProducts: async () => {
    return await api.get('/products');
  },

  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },

  searchProducts: async (query) => {
    return await api.get(`/products/search?q=${query}`);
  }
};
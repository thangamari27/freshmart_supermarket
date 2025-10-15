import api from './api.js';

export const usersService = {
  getAllUsers: async () => {
    return await api.get('/auth/users');
  },

  getUserById: async (id) => {
    return await api.get(`/auth/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await api.put(`/auth/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await api.delete(`/auth/users/${id}`);
  }
};
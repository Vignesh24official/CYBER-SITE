import api from './api';

export const authService = {
  async register(data) {
    return api.post('/auth/register', data);
  },

  async login(data) {
    return api.post('/auth/login', data);
  },

  async googleAuth(data) {
    return api.post('/auth/google', data);
  },

  async logout(refreshToken) {
    return api.post('/auth/logout', { refreshToken });
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async updateProfile(data) {
    return api.put('/auth/profile', data);
  },

  async changePassword(data) {
    return api.post('/auth/change-password', data);
  },
};

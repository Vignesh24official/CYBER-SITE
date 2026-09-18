import api from './api';

export const notificationService = {
  async getNotifications(page = 0, size = 10) {
    return api.get(`/notifications?page=${page}&size=${size}`);
  },

  async getRecentNotifications() {
    return api.get('/notifications/recent');
  },

  async getUnreadCount() {
    return api.get('/notifications/unread-count');
  },

  async markAsRead(id) {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.put('/notifications/read-all');
  },
};

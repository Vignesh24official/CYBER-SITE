import api from './api';

export const adminService = {
  async getComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/admin/complaints?${query}`);
  },

  async getComplaintDetail(publicId) {
    return api.get(`/admin/complaints/${publicId}`);
  },

  async updateStatus(publicId, statusData) {
    return api.put(`/admin/complaints/${publicId}/status`, statusData);
  },

  async assignInvestigator(publicId, assignmentData) {
    return api.post(`/admin/complaints/${publicId}/assign`, assignmentData);
  },

  async requestInfo(publicId, notes) {
    return api.post(`/admin/complaints/${publicId}/request-info`, { notes });
  },

  async getUsers(role = '', page = 0, size = 15) {
    return api.get(`/admin/users?role=${role}&page=${page}&size=${size}`);
  },

  async getInvestigators() {
    return api.get('/admin/investigators');
  },

  async updateUserStatus(publicId, status) {
    return api.put(`/admin/users/${publicId}/status`, { status });
  },

  async updateUserRole(publicId, role) {
    return api.put(`/admin/users/${publicId}/role`, { role });
  },

  async getAuditLogs(page = 0, size = 20) {
    return api.get(`/admin/audit-logs?page=${page}&size=${size}`);
  },

  async getCategories() {
    return api.get('/admin/categories');
  },

  async createCategory(categoryData) {
    return api.post('/admin/categories', categoryData);
  },

  async createThreatType(categoryId, typeData) {
    return api.post(`/admin/categories/${categoryId}/types`, typeData);
  },
};

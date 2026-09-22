import api from './api';

export const investigationService = {
  async getAssignedCases(page = 0, size = 15, search = '', status = '') {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return api.get(`/coordinator/cases?${params.toString()}`);
  },

  async getCaseDetail(publicId) {
    return api.get(`/coordinator/cases/${publicId}`);
  },

  async addNote(publicId, noteData) {
    return api.post(`/coordinator/cases/${publicId}/notes`, noteData);
  },

  async requestInfo(publicId, notes) {
    return api.post(`/coordinator/cases/${publicId}/request-info`, { notes });
  },

  async updateStatus(publicId, statusData) {
    return api.put(`/coordinator/cases/${publicId}/status`, statusData);
  },

  async markCompleted(publicId, remarks = 'Investigation successfully concluded') {
    return api.put(`/coordinator/cases/${publicId}/status`, {
      status: 'RESOLVED',
      reason: remarks,
    });
  },
};

export const coordinatorService = investigationService;

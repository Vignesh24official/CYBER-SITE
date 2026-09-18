import api from './api';

export const investigationService = {
  async getAssignedCases(page = 0, size = 15) {
    return api.get(`/investigator/cases?page=${page}&size=${size}`);
  },

  async getCaseDetail(publicId) {
    return api.get(`/investigator/cases/${publicId}`);
  },

  async addNote(publicId, noteData) {
    return api.post(`/investigator/cases/${publicId}/notes`, noteData);
  },

  async requestInfo(publicId, notes) {
    return api.post(`/investigator/cases/${publicId}/request-info`, { notes });
  },

  async updateStatus(publicId, statusData) {
    return api.put(`/investigator/cases/${publicId}/status`, statusData);
  },
};

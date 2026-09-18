import api from './api';

export const complaintService = {
  async createComplaint(data) {
    return api.post('/complaints', data);
  },

  async getMyComplaints(page = 0, size = 10) {
    return api.get(`/complaints/my-complaints?page=${page}&size=${size}`);
  },

  async getComplaint(publicId) {
    return api.get(`/complaints/${publicId}`);
  },

  async provideInfoResponse(publicId, responseMessage) {
    return api.post(`/complaints/${publicId}/info-response`, { responseMessage });
  },
};

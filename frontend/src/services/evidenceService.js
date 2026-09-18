import api from './api';

export const evidenceService = {
  async uploadEvidence(complaintPublicId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/complaints/${complaintPublicId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getDownloadUrl(evidenceId) {
    return `/api/v1/evidence/${evidenceId}`;
  },

  async deleteEvidence(evidenceId) {
    return api.delete(`/evidence/${evidenceId}`);
  },
};

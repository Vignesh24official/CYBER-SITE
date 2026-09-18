import api from './api';

export const reportService = {
  async getAnalyticsSummary() {
    return api.get('/admin/reports/summary');
  },

  getCsvExportUrl() {
    return '/api/v1/admin/reports/export/csv';
  },
};

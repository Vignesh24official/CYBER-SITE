import api from './api';

export const threatAnalysisService = {
  async analyzeUrl(url) {
    return api.post('/threat-analysis/url', { url });
  },
};

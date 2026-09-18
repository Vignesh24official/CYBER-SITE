import api from './api';

export const articleService = {
  async getArticles(page = 0, size = 10, query = '') {
    return api.get(`/safety-articles?page=${page}&size=${size}&query=${encodeURIComponent(query)}`);
  },

  async getArticleBySlug(slug) {
    return api.get(`/safety-articles/${slug}`);
  },
};

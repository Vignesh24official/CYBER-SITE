package com.cybershield.service;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.entity.SafetyArticle;

import java.util.List;

public interface SafetyArticleService {
    PageResponse<SafetyArticle> getPublishedArticles(int page, int size, String query);
    SafetyArticle getArticleBySlug(String slug);
    SafetyArticle createArticle(SafetyArticle article);
    SafetyArticle updateArticle(Long id, SafetyArticle article);
    void deleteArticle(Long id);
    List<SafetyArticle> getArticlesByCategory(String category);
}

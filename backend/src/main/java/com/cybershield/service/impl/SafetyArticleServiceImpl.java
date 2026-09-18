package com.cybershield.service.impl;

import com.cybershield.dto.common.PageResponse;
import com.cybershield.entity.SafetyArticle;
import com.cybershield.exception.ResourceNotFoundException;
import com.cybershield.repository.SafetyArticleRepository;
import com.cybershield.service.SafetyArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SafetyArticleServiceImpl implements SafetyArticleService {

    private final SafetyArticleRepository safetyArticleRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SafetyArticle> getPublishedArticles(int page, int size, String query) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<SafetyArticle> articles;
        if (query != null && !query.isBlank()) {
            articles = safetyArticleRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCaseAndPublishedTrue(query, query, pageRequest);
        } else {
            articles = safetyArticleRepository.findByPublishedTrue(pageRequest);
        }
        return PageResponse.from(articles);
    }

    @Override
    @Transactional(readOnly = true)
    public SafetyArticle getArticleBySlug(String slug) {
        return safetyArticleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Safety article not found with slug: " + slug));
    }

    @Override
    @Transactional
    public SafetyArticle createArticle(SafetyArticle article) {
        if (article.getSlug() == null || article.getSlug().isBlank()) {
            article.setSlug(article.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        }
        return safetyArticleRepository.save(article);
    }

    @Override
    @Transactional
    public SafetyArticle updateArticle(Long id, SafetyArticle updated) {
        SafetyArticle existing = safetyArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));

        existing.setTitle(updated.getTitle());
        existing.setSummary(updated.getSummary());
        existing.setContent(updated.getContent());
        existing.setCategory(updated.getCategory());
        existing.setPublished(updated.getPublished());

        return safetyArticleRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteArticle(Long id) {
        SafetyArticle existing = safetyArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with ID: " + id));
        safetyArticleRepository.delete(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SafetyArticle> getArticlesByCategory(String category) {
        return safetyArticleRepository.findByCategoryAndPublishedTrue(category);
    }
}

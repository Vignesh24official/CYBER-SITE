package com.cybershield.repository;

import com.cybershield.entity.SafetyArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SafetyArticleRepository extends JpaRepository<SafetyArticle, Long> {
    Optional<SafetyArticle> findBySlug(String slug);
    Page<SafetyArticle> findByPublishedTrue(Pageable pageable);
    List<SafetyArticle> findByCategoryAndPublishedTrue(String category);
    Page<SafetyArticle> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCaseAndPublishedTrue(String titleQuery, String summaryQuery, Pageable pageable);
}

package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.common.PageResponse;
import com.cybershield.entity.SafetyArticle;
import com.cybershield.service.SafetyArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/safety-articles")
@RequiredArgsConstructor
@Tag(name = "Cyber Safety Articles API", description = "Public educational articles and cyber safety resources")
public class SafetyArticleController {

    private final SafetyArticleService safetyArticleService;

    @GetMapping
    @Operation(summary = "Get paginated list of published safety articles")
    public ResponseEntity<ApiResponse<PageResponse<SafetyArticle>>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String query
    ) {
        PageResponse<SafetyArticle> response = safetyArticleService.getPublishedArticles(page, size, query);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed safety article by unique URL slug")
    public ResponseEntity<ApiResponse<SafetyArticle>> getArticleBySlug(@PathVariable String slug) {
        SafetyArticle article = safetyArticleService.getArticleBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(article));
    }
}

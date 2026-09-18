package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.threat.UrlAnalysisRequest;
import com.cybershield.dto.threat.UrlAnalysisResponse;
import com.cybershield.service.ThreatAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/threat-analysis")
@RequiredArgsConstructor
@Tag(name = "Threat Analysis API", description = "Endpoints for safe URL heuristic threat risk evaluation")
public class ThreatAnalysisController {

    private final ThreatAnalysisService threatAnalysisService;

    @PostMapping("/url")
    @Operation(summary = "Perform safe heuristic URL pattern threat analysis")
    public ResponseEntity<ApiResponse<UrlAnalysisResponse>> analyzeUrl(@Valid @RequestBody UrlAnalysisRequest request) {
        UrlAnalysisResponse response = threatAnalysisService.analyzeUrl(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "URL threat analysis completed"));
    }
}

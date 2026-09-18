package com.cybershield.controller;

import com.cybershield.dto.common.ApiResponse;
import com.cybershield.dto.report.AnalyticsSummaryResponse;
import com.cybershield.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics API", description = "Endpoints for SOC dashboard analytics, metrics, and CSV exports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Get aggregated analytics metrics summary and breakdowns")
    public ResponseEntity<ApiResponse<AnalyticsSummaryResponse>> getAnalyticsSummary() {
        AnalyticsSummaryResponse summary = reportService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export all complaint records in CSV format")
    public ResponseEntity<byte[]> exportComplaintsCsv() {
        byte[] csvData = reportService.generateComplaintsCsvReport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cybershield_incidents_report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}

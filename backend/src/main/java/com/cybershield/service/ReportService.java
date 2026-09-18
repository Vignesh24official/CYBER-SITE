package com.cybershield.service;

import com.cybershield.dto.report.AnalyticsSummaryResponse;

public interface ReportService {
    AnalyticsSummaryResponse getAnalyticsSummary();
    byte[] generateComplaintsCsvReport();
}

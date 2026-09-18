package com.cybershield.service;

import com.cybershield.dto.threat.UrlAnalysisRequest;
import com.cybershield.dto.threat.UrlAnalysisResponse;

public interface ThreatAnalysisService {
    UrlAnalysisResponse analyzeUrl(UrlAnalysisRequest request);
}

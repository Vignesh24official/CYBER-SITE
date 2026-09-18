package com.cybershield.dto.threat;

import com.cybershield.enums.ThreatSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlAnalysisResponse {

    private String url;
    private String domain;
    private boolean isHttps;
    private int riskScore;
    private ThreatSeverity riskLevel;
    private List<String> findings;
    
    @Builder.Default
    private String disclaimer = "Heuristic URL analysis score. Does not replace formal threat intelligence scanning.";
}

package com.cybershield.service;

import com.cybershield.dto.threat.UrlAnalysisRequest;
import com.cybershield.dto.threat.UrlAnalysisResponse;
import com.cybershield.enums.ThreatSeverity;
import com.cybershield.service.impl.ThreatAnalysisServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ThreatAnalysisServiceTest {

    private ThreatAnalysisService threatAnalysisService;

    @BeforeEach
    void setUp() {
        threatAnalysisService = new ThreatAnalysisServiceImpl();
    }

    @Test
    @DisplayName("Should detect high risk for HTTP IP address phishing URL with keywords")
    void analyzeUrl_PhishingIpUrl_HighRisk() {
        UrlAnalysisRequest request = UrlAnalysisRequest.builder()
                .url("http://192.168.1.100:8080/paypal/login/verify-account.php")
                .build();

        UrlAnalysisResponse response = threatAnalysisService.analyzeUrl(request);

        assertNotNull(response);
        assertFalse(response.isHttps());
        assertTrue(response.getRiskScore() >= 60);
        assertTrue(response.getRiskLevel() == ThreatSeverity.HIGH || response.getRiskLevel() == ThreatSeverity.CRITICAL);
        assertTrue(response.getFindings().size() > 2);
    }

    @Test
    @DisplayName("Should detect low risk for standard HTTPS domain")
    void analyzeUrl_StandardHttpsUrl_LowRisk() {
        UrlAnalysisRequest request = UrlAnalysisRequest.builder()
                .url("https://github.com/about")
                .build();

        UrlAnalysisResponse response = threatAnalysisService.analyzeUrl(request);

        assertNotNull(response);
        assertTrue(response.isHttps());
        assertEquals(ThreatSeverity.LOW, response.getRiskLevel());
    }

    @Test
    @DisplayName("Should detect high/critical risk when illegal adversary keywords are present")
    void analyzeUrl_IllegalKeywords_HighOrCriticalRisk() {
        UrlAnalysisRequest request = UrlAnalysisRequest.builder()
                .url("http://compromised-host.xyz/download/ransomware-lockbit-hack")
                .build();

        UrlAnalysisResponse response = threatAnalysisService.analyzeUrl(request);

        assertNotNull(response);
        assertTrue(response.getRiskScore() >= 80, "Expected risk score >= 80 but was " + response.getRiskScore());
        assertEquals(ThreatSeverity.CRITICAL, response.getRiskLevel());
        assertTrue(response.getFindings().stream().anyMatch(f -> f.contains("ransomware") || f.contains("hack")));
    }
}

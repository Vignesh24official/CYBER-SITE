package com.cybershield.service.impl;

import com.cybershield.dto.threat.UrlAnalysisRequest;
import com.cybershield.dto.threat.UrlAnalysisResponse;
import com.cybershield.enums.ThreatSeverity;
import com.cybershield.service.ThreatAnalysisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Service
public class ThreatAnalysisServiceImpl implements ThreatAnalysisService {

    private static final List<String> SUSPICIOUS_KEYWORDS = Arrays.asList(
            "login", "signin", "verify", "account", "banking", "secure", "update", "paypal", "upi",
            "wallet", "password", "credential", "auth", "recover", "kyc", "otp", "claim", "free", "gift"
    );

    private static final List<String> URL_SHORTENERS = Arrays.asList(
            "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "cutt.ly", "rb.gy"
    );

    private static final Pattern IP_ADDRESS_PATTERN = Pattern.compile(
            "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])$"
    );

    @Override
    public UrlAnalysisResponse analyzeUrl(UrlAnalysisRequest request) {
        String rawUrl = request.getUrl().trim();
        if (!rawUrl.toLowerCase().startsWith("http://") && !rawUrl.toLowerCase().startsWith("https://")) {
            rawUrl = "http://" + rawUrl;
        }

        List<String> findings = new ArrayList<>();
        int score = 0;

        boolean isHttps = rawUrl.toLowerCase().startsWith("https://");
        if (!isHttps) {
            score += 15;
            findings.add("URL does not use encrypted HTTPS connection (+15)");
        }

        String host = "";
        String path = "";
        int port = -1;

        try {
            URI uri = new URI(rawUrl);
            host = uri.getHost() != null ? uri.getHost() : "";
            path = uri.getPath() != null ? uri.getPath() : "";
            port = uri.getPort();
        } catch (Exception ex) {
            findings.add("Malformed URL syntax (+20)");
            score += 20;
        }

        if (host.startsWith("xn--") || rawUrl.contains("xn--")) {
            score += 20;
            findings.add("Uses Punycode encoding, potential homograph domain spoofing (+20)");
        }

        if (IP_ADDRESS_PATTERN.matcher(host).matches()) {
            score += 25;
            findings.add("Host is a direct raw IP address instead of domain name (+25)");
        }

        for (String shortener : URL_SHORTENERS) {
            if (host.equalsIgnoreCase(shortener) || host.endsWith("." + shortener)) {
                score += 15;
                findings.add("Uses known URL shortener service (" + shortener + ") obfuscating target destination (+15)");
                break;
            }
        }

        if (port != -1 && port != 80 && port != 443) {
            score += 15;
            findings.add("Uses non-standard web service port (" + port + ") (+15)");
        }

        String[] subdomains = host.split("\\.");
        if (subdomains.length > 3 && !IP_ADDRESS_PATTERN.matcher(host).matches()) {
            score += 10;
            findings.add("Excessive subdomain depth (" + subdomains.length + " levels) (+10)");
        }

        if (rawUrl.length() > 120) {
            score += 15;
            findings.add("Extremely long URL length (" + rawUrl.length() + " chars) (+15)");
        } else if (rawUrl.length() > 75) {
            score += 10;
            findings.add("Unusually long URL length (" + rawUrl.length() + " chars) (+10)");
        }

        String lowerUrl = rawUrl.toLowerCase();
        for (String kw : SUSPICIOUS_KEYWORDS) {
            if (lowerUrl.contains(kw)) {
                score += 10;
                findings.add("Contains sensitive keyword: '" + kw + "' (+10)");
            }
        }

        score = Math.min(100, Math.max(0, score));

        ThreatSeverity severity;
        if (score >= 80) {
            severity = ThreatSeverity.CRITICAL;
        } else if (score >= 60) {
            severity = ThreatSeverity.HIGH;
        } else if (score >= 30) {
            severity = ThreatSeverity.MEDIUM;
        } else {
            severity = ThreatSeverity.LOW;
        }

        if (findings.isEmpty()) {
            findings.add("No obvious URL threat heuristics detected.");
        }

        return UrlAnalysisResponse.builder()
                .url(request.getUrl())
                .domain(host)
                .isHttps(isHttps)
                .riskScore(score)
                .riskLevel(severity)
                .findings(findings)
                .disclaimer("Heuristic URL analysis engine. Does not replace formal antivirus or threat intelligence scanning.")
                .build();
    }
}

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

    private static final List<String> ILLEGAL_KEYWORDS = Arrays.asList(
            "hack", "hacking", "hacker", "hacked", "hijack", "hijacking", "cybercrime", "cybercriminal",
            "cyberattack", "cyberterrorism", "cyberwarfare", "cyberespionage", "illegal", "illicit",
            "fraud", "fraudulent", "scam", "scammer", "phishing", "spoofing", "cracking", "cracker",
            "exploit", "exploitation", "vulnerability", "zero-day", "backdoor", "rootkit", "malware",
            "ransomware", "spyware", "adware", "trojan", "virus", "worm", "keylogger", "botnet",
            "botmaster", "hijacker", "hijacked", "intrusion", "unauthorized", "breach", "databreach",
            "datatheft", "dataleak", "datadump", "databroker", "identitytheft", "identityfraud",
            "credentialtheft", "credentialstuffing", "passwordcracking", "passwordstealing", "passworddump",
            "credentialharvesting", "accounttakeover", "sessionhijacking", "cookiesstealing", "tokenstealing",
            "keylogging", "keystrokelogging", "wiretapping", "surveillance", "spying", "espionage",
            "darkweb", "darknet", "deepweb", "blackmarket", "darkmarket", "undergroundmarket", "illicitmarket",
            "blackhat", "blackhacker", "blackhatforum", "hackerforum", "hackers", "hacktool", "hackingtool",
            "exploitkit", "malwarekit", "phishingkit", "ransomwarekit", "attacktool", "payload", "shellcode",
            "obfuscation", "cryptojacking", "cryptomining", "datamining", "databreaching", "exfiltration",
            "commandandcontrol", "c2server", "botnetattack", "ddos", "dosattack", "denialofservice",
            "distributeddenialofservice", "bruteforce", "dictionaryattack", "rainbowtable", "sqlinjection",
            "sqli", "xss", "crosssitescripting", "csrf", "ssrf", "rce", "lfi", "rfi", "directorytraversal",
            "pathtraversal", "privilegeescalation", "rootaccess", "rooting", "jailbreak", "unauthorizedaccess",
            "remoteaccess", "remotecodeexecution", "remoteshell", "webshell", "reverseshell", "bindshell",
            "shellaccess", "shellupload", "portscanning", "networkscanning", "netscan", "packetsniffing",
            "sniffing", "spoofedip", "ipspoofing", "macspoofing", "arppoisoning", "arpspoofing",
            "dnspoisoning", "dnsspoofing", "dnstunneling", "mitm", "maninthemiddle", "evilproxy",
            "reverseproxy", "anonymity", "anonymous", "proxychain", "proxyserver", "tor", "onion",
            "onionservice", "onionaddress", "torbrowser", "hiddenservice", "hiddenwiki", "darkwebforum",
            "darkwebmarket", "darkwebshop", "darkwebvendor", "darkwebvendorlist", "leakedcredentials",
            "leakedpasswords", "stolendata", "stolenaccounts", "stolenidentity", "stolencards", "carding",
            "carder", "cardingforum", "cardingmarket", "carddump", "cardingtools", "creditcardfraud",
            "debitcardfraud", "cardingdata", "cvvshop", "fullz", "dumps", "trackdata", "skimming",
            "webskimming", "atmfraud", "atmjackpotting", "bankfraud", "wirefraud", "paymentfraud",
            "financialfraud", "moneylaundering", "cryptofraud", "cryptoscam", "bitcoinmixing", "cryptomixer",
            "tumbler", "walletdrainer", "wallettheft", "seedphrasetheft", "privatekeytheft", "cryptohacking",
            "cryptoransom", "extortion", "blackmail", "sextortion", "勒索软件", "ransom", "ransomnote",
            "ransompayment", "illegaldownload", "piracy", "softwarepiracy", "copyrightinfringement",
            "warez", "crackedsoftware", "crackdownload", "keygen", "serialkey", "licensebypass",
            "stolenlicense", "piratedcontent", "illegalstreaming", "torrentpiracy", "bootleg", "counterfeit",
            "forgery", "documentfraud", "fakeidentity", "fakepassport", "forgeddocuments", "identitydocuments",
            "fakeaccounts", "accountfraud", "accountselling", "accounttrading", "credentialmarket",
            "passwordmarket", "datamarket", "leaksite", "leakforum", "breachforum", "exploitmarket",
            "vulnerabilitymarket", "zero-daymarket", "hackermarket", "malwaremarket", "botnetmarket",
            "spamnetwork", "spambot", "emailspoofing", "smsspoofing", "smishing", "vishing",
            "business-email-compromise", "bec", "socialengineering", "impersonation", "brandspoofing",
            "domainspoofing", "typosquatting", "homographattack", "pharming", "wateringhole",
            "drivebydownload", "malvertising", "maliciousredirect", "maliciousdomain", "blacklisteddomain",
            "suspiciousdomain", "compromisedwebsite", "infectedwebsite", "maliciouswebsite", "fraudulentwebsite",
            "fakewebsite", "fakepayment", "fakebank", "fakeportal", "fakeinvestment", "ponzischeme",
            "pyramid scheme", "pyramidscheme", "rugpull", "exit scam", "exitscam", "advancefeefraud",
            "lotteryscam", "giveawayscam", "romancescam", "jobscam", "loan scam", "loanscam",
            "investment scam", "investmentscam", "charityfraud", "taxfraud", "customsfraud", "refundfraud",
            "delivery scam", "deliveryscam", "techsupportscam", "supportfraud", "fakealert", "securityscam",
            "maliciousscript", "obfuscatedscript", "powershellattack", "macrovirus", "filelessmalware",
            "polymorphicvirus", "metamorphicmalware", "rootkitinfection", "bootkit", "firmwareattack",
            "supplychainattack", "insiderthreat", "insiderattack", "privatedataleak", "confidentialdatatheft",
            "databasebreach", "serverbreach", "cloudbreach", "cloudhacking", "serverhacking", "websitehacking",
            "wordpresshacking", "cmsvulnerability", "adminpanel", "exposedadmin", "exposeddatabase",
            "openport", "weakpassword", "defaultcredentials", "hardcodedpassword", "misconfiguration",
            "insecureendpoint", "unauthenticatedaccess", "authenticationbypass", "authorizationbypass",
            "securitybypass", "firewallbypass", "antivirusbypass", "edrbypass", "sandboxevasion",
            "defenseevasion", "logdeletion", "logtampering", "coveringtracks", "persistencemechanism",
            "lateralattack", "privilegedaccount", "privilegedaccess", "credentialdumping", "memorydump",
            "processinjection", "dllinjection", "dllhijacking", "codeinjection", "dependencyconfusion",
            "deserialization", "insecuredeserialization", "supplychaincompromise", "maliciouspackage",
            "typosquattedpackage", "rogueextension", "browserextensionmalware", "mobilemalware",
            "androidtrojan", "iosspyware", "bankingtrojan", "infostealer", "redline", "raccoonstealer",
            "vidar", "agenttesla", "formbook", "remcos", "njrat", "asyncrat", "darkcomet", "emotet",
            "trickbot", "qakbot", "lockbit", "conti", "ryuk", "wannacry", "revil", "blackcat", "cl0p", "alphv"
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
        String normalizedSlug = lowerUrl.replaceAll("[^a-z0-9]", "");
        boolean matchedIllegalKeyword = false;

        for (String kw : ILLEGAL_KEYWORDS) {
            String kwLower = kw.toLowerCase().trim();
            String kwNorm = kwLower.replaceAll("[^a-z0-9]", "");
            if (lowerUrl.contains(kwLower) || (!kwNorm.isEmpty() && kwNorm.length() >= 3 && normalizedSlug.contains(kwNorm))) {
                matchedIllegalKeyword = true;
                score += 40;
                findings.add("🚨 Contains high-risk illegal/adversary keyword: '" + kw + "' (+40)");
            }
        }

        for (String kw : SUSPICIOUS_KEYWORDS) {
            if (lowerUrl.contains(kw)) {
                score += 10;
                findings.add("Contains sensitive heuristic keyword: '" + kw + "' (+10)");
            }
        }

        // If illegal keyword is present, enforce high/critical risk baseline
        if (matchedIllegalKeyword) {
            score = Math.max(85, score);
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
            findings.add("No obvious URL threat heuristics detected. Verified clean indicator.");
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

-- Seed Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO roles (id, name) VALUES (2, 'ROLE_INVESTIGATOR');
INSERT INTO roles (id, name) VALUES (3, 'ROLE_ADMIN');

-- Seed Threat Categories
INSERT INTO threat_categories (id, name, description, active) VALUES
(1, 'Financial & Banking Fraud', 'UPI, net banking, credit card, and online transaction scams', true),
(2, 'Phishing & Identity Theft', 'Fake websites, email phishing, credential harvesting, impersonation', true),
(3, 'Social Engineering & Cyberbullying', 'Pretexting, coercion, social media impersonation, cyber harassment', true),
(4, 'Malware & Ransomware', 'Malicious files, system compromise, data encryption extortion', true),
(5, 'Unauthorized Access & Account Takeover', 'Hacked email, social media, or portal accounts', true);

-- Seed Threat Types
INSERT INTO threat_types (id, category_id, name, description, active) VALUES
(1, 1, 'UPI QR Code Fraud', 'Fake payment requests disguised as money receiving QR codes', true),
(2, 1, 'Net Banking Credential Theft', 'Fake banking web portals designed to harvest login credentials', true),
(3, 1, 'Credit/Debit Card Vishing', 'Caller posing as bank official requesting OTP and card numbers', true),
(4, 2, 'Phishing Email Link', 'Emails containing deceptive links targeting account credentials', true),
(5, 2, 'Fake E-Commerce Website', 'Fraudulent online shopping sites capturing payment details', true),
(6, 2, 'Identity Impersonation', 'Creating fake personas using stolen user details', true),
(7, 3, 'Social Media Hijacking', 'Compromise of social media handles for scams or defamation', true),
(8, 3, 'Cyber Harassment & Stalking', 'Targeted online harassment, threat messages, or defamation', true),
(9, 4, 'Ransomware Extortion', 'Malicious encryption of victim files demanding cryptocurrency', true),
(10, 4, 'Trojan Attachment', 'Malicious email attachments carrying malware binaries', true),
(11, 5, 'Unauthorized Portal Access', 'Unauthorized logins to personal or corporate accounts', true);

-- Seed Safety Articles
INSERT INTO safety_articles (id, title, slug, summary, content, category, published, created_at, updated_at) VALUES
(
    1,
    'How to Identify and Avoid UPI QR Code Fraud',
    'avoid-upi-qr-code-fraud',
    'Learn how cyber criminals misuse UPI QR codes to steal money and how to protect your bank account.',
    '### What is UPI QR Code Fraud?\n\nMany online buyers and sellers fall victim to UPI scams where scammers claim to send money by asking victims to scan a QR code. **Remember: Scanning a QR code is ALWAYS for paying money, NEVER for receiving money.**\n\n### Crucial Safety Tips:\n1. Never enter your UPI PIN to receive payment.\n2. Verify the recipient name on your screen before authorizing any transaction.\n3. Do not trust screenshot payment receipts provided by unknown buyers.\n4. Report suspicious UPI IDs immediately on CyberShield.',
    'Financial Fraud',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    2,
    'Spotting Phishing Links and Fake Web Portals',
    'spotting-phishing-links-and-fake-portals',
    'A guide to detecting deceptive URLs, fake SSL certificates, and credential harvesting pages.',
    '### How Phishing Works\n\nPhishing attacks use visually identical websites to trick users into submitting usernames, passwords, or credit card details.\n\n### Warning Signs:\n- **Mismatched Domain Names**: E.g., `paypal-security-update.com` instead of `paypal.com`.\n- **Punycode / Special Characters**: E.g., `pаypal.com` using Cyrillic characters.\n- **IP Address URLs**: E.g., `http://192.168.1.1/login`.\n- **Urgent Action Demands**: Suspicious threats of account suspension within 24 hours.\n\nUse CyberShield''s built-in URL Threat Analyzer tool before clicking unknown links.',
    'Phishing & Defense',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    3,
    'Password Hygiene & Multi-Factor Authentication (MFA)',
    'password-hygiene-and-mfa-guide',
    'Best practices for securing accounts using strong unique passwords and authenticator apps.',
    '### Why Password Reuse is Dangerous\n\nWhen one service suffers a data breach, attackers use automated credential stuffing to compromise all your accounts using identical credentials.\n\n### Best Practices:\n1. Use unique 16+ character passphrases for every account.\n2. Store credentials in a dedicated password manager.\n3. Enable TOTP-based Multi-Factor Authentication (Authenticator apps).\n4. Avoid SMS-based 2FA where possible due to SIM swapping risks.',
    'Account Security',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Seed Default Development Accounts
-- Password for all seed users: Password@123
-- Hash: $2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi
INSERT INTO users (id, public_id, full_name, email, phone, password_hash, role_id, account_status, created_at, updated_at) VALUES
(1, '10000000-0000-0000-0000-000000000001', 'System Administrator', 'admin@cybershield.org', '+1-800-555-0101', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 3, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '10000000-0000-0000-0000-000000000002', 'Senior Cyber Investigator', 'investigator@cybershield.org', '+1-800-555-0102', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 2, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '10000000-0000-0000-0000-000000000003', 'John Citizen', 'user@cybershield.org', '+1-800-555-0103', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 1, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



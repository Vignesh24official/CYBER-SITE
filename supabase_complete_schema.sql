-- ==============================================================================
-- CYBERSHIELD DEFENSE PLATFORM — COMPLETE SUPABASE DATABASE SCHEMA
-- Project: ndoyiyfevnpqdvcsommy (https://ndoyiyfevnpqdvcsommy.supabase.co)
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/sql/new
-- 2. Paste this entire SQL script into the SQL Editor.
-- 3. Click "Run".
-- All tables, roles, seed users, indexes, and access policies will be created instantly.
-- ==============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    failed_login_attempts INT DEFAULT 0,
    lock_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- 3. REFRESH TOKENS TABLE
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. THREAT CATEGORIES & TYPES
CREATE TABLE IF NOT EXISTS threat_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS threat_types (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES threat_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_threat_type_name_category UNIQUE (category_id, name)
);

-- 5. COMPLAINTS & AUDIT TRAIL
CREATE TABLE IF NOT EXISTS complaints (
    id BIGSERIAL PRIMARY KEY,
    public_id VARCHAR(50) NOT NULL UNIQUE,
    complaint_number VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    threat_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    incident_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(150),
    financial_loss NUMERIC(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    suspicious_url TEXT,
    attacker_information TEXT,
    additional_information TEXT,
    user_response TEXT,
    response_provided_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id BIGSERIAL PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by BIGINT NOT NULL REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_assignments (
    id BIGSERIAL PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    investigator_id BIGINT NOT NULL REFERENCES users(id),
    assigned_by BIGINT NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP,
    assignment_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE'
);

-- 6. INVESTIGATIONS & EVIDENCE
CREATE TABLE IF NOT EXISTS investigation_notes (
    id BIGSERIAL PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    investigator_id BIGINT NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    finding TEXT,
    action_taken TEXT,
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence_files (
    id BIGSERIAL PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    uploaded_by BIGINT NOT NULL REFERENCES users(id),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. SAFETY ARTICLES
CREATE TABLE IF NOT EXISTS safety_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATABASE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_public_id ON users(public_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_number ON complaints(complaint_number);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_severity ON complaints(severity);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_threat_type ON complaints(threat_type);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);
CREATE INDEX IF NOT EXISTS idx_assignments_investigator ON complaint_assignments(investigator_id);
CREATE INDEX IF NOT EXISTS idx_investigation_notes_complaint ON investigation_notes(complaint_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_complaint ON evidence_files(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_safety_articles_slug ON safety_articles(slug);
CREATE INDEX IF NOT EXISTS idx_safety_articles_category ON safety_articles(category);

-- ==============================================================================
-- SEED INITIAL DATA (ROLES & PLATFORM ACCOUNTS)
-- ==============================================================================

-- Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_USER') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_INVESTIGATOR') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (3, 'ROLE_ADMIN') ON CONFLICT (id) DO NOTHING;
INSERT INTO roles (id, name) VALUES (4, 'ROLE_COORDINATOR') ON CONFLICT (id) DO NOTHING;

-- Seed Threat Categories
INSERT INTO threat_categories (id, name, description, active) VALUES
(1, 'Financial & Banking Fraud', 'UPI, net banking, credit card, and online transaction scams', true),
(2, 'Phishing & Identity Theft', 'Fake websites, email phishing, credential harvesting, impersonation', true),
(3, 'Social Engineering & Cyberbullying', 'Pretexting, coercion, social media impersonation, cyber harassment', true),
(4, 'Malware & Ransomware', 'Malicious files, system compromise, data encryption extortion', true),
(5, 'Unauthorized Access & Account Takeover', 'Hacked email, social media, or portal accounts', true)
ON CONFLICT (id) DO NOTHING;

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
(11, 5, 'Unauthorized Portal Access', 'Unauthorized logins to personal or corporate accounts', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Core Enterprise Accounts (Password for all: Password@123)
-- BCrypt Hash: $2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi
INSERT INTO users (id, public_id, full_name, email, phone, password_hash, role_id, account_status, created_at, updated_at) VALUES
(1, '10000000-0000-0000-0000-000000000001', 'System Administrator', 'admin@cybershield.org', '+1-800-555-0101', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 3, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '10000000-0000-0000-0000-000000000002', 'Senior Cyber Investigator', 'investigator@cybershield.org', '+1-800-555-0102', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 2, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '10000000-0000-0000-0000-000000000003', 'John Citizen', 'user@cybershield.org', '+1-800-555-0103', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 1, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '10000000-0000-0000-0000-000000000004', 'Lead Incident Coordinator', 'coordinator@cybershield.org', '+1-800-555-0104', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 4, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

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
)
ON CONFLICT (id) DO NOTHING;

-- Adjust sequence values so new inserts don't collide with seeded IDs
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('threat_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM threat_categories));
SELECT setval('threat_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM threat_types));
SELECT setval('safety_articles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM safety_articles));

-- ==============================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- ==============================================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read users" ON users;
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert users" ON users;
CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update users" ON users;
CREATE POLICY "Public update users" ON users FOR UPDATE USING (true);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read roles" ON roles;
CREATE POLICY "Public read roles" ON roles FOR SELECT USING (true);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read complaints" ON complaints;
CREATE POLICY "Public read complaints" ON complaints FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public insert complaints" ON complaints;
CREATE POLICY "Public insert complaints" ON complaints FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public update complaints" ON complaints;
CREATE POLICY "Public update complaints" ON complaints FOR UPDATE USING (true);

ALTER TABLE safety_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read safety articles" ON safety_articles;
CREATE POLICY "Public read safety articles" ON safety_articles FOR SELECT USING (true);

ALTER TABLE threat_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read threat categories" ON threat_categories;
CREATE POLICY "Public read threat categories" ON threat_categories FOR SELECT USING (true);

ALTER TABLE threat_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read threat types" ON threat_types;
CREATE POLICY "Public read threat types" ON threat_types FOR SELECT USING (true);

-- Flyway Schema Baseline table (to prevent migration re-run conflicts if backend connects)
CREATE TABLE IF NOT EXISTS flyway_schema_history (
    installed_rank INT NOT NULL PRIMARY KEY,
    version VARCHAR(50),
    description VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    script VARCHAR(1000) NOT NULL,
    checksum INT,
    installed_by VARCHAR(100) NOT NULL,
    installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    execution_time INT NOT NULL,
    success BOOLEAN NOT NULL
);

INSERT INTO flyway_schema_history (installed_rank, version, description, type, script, installed_by, execution_time, success)
VALUES
(1, '1', 'create users and roles', 'SQL', 'V1__create_users_and_roles.sql', 'postgres', 1, true),
(2, '2', 'create complaints and history', 'SQL', 'V2__create_complaints_and_history.sql', 'postgres', 1, true),
(3, '3', 'create investigations and evidence', 'SQL', 'V3__create_investigations_and_evidence.sql', 'postgres', 1, true),
(4, '4', 'create notifications and audit', 'SQL', 'V4__create_notifications_and_audit.sql', 'postgres', 1, true),
(5, '5', 'create safety articles', 'SQL', 'V5__create_safety_articles.sql', 'postgres', 1, true),
(6, '6', 'seed initial data', 'SQL', 'V6__seed_initial_data.sql', 'postgres', 1, true),
(7, '7', 'add coordinator role and seed', 'SQL', 'V7__add_coordinator_role_and_seed.sql', 'postgres', 1, true)
ON CONFLICT (installed_rank) DO NOTHING;

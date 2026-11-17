-- ==============================================================================
-- CYBERSHIELD: ONLINE COMPLAINT MANAGEMENT SYSTEM
-- Advanced Programming in Java (MCA - II Year) MySQL Database Schema
-- Technologies: MySQL 8.x + JDBC + Java Servlet + JSP
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS cybershield_db;
USE cybershield_db;

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 3. THREAT CATEGORIES & THREAT TYPES
CREATE TABLE IF NOT EXISTS threat_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS threat_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES threat_categories(id) ON DELETE CASCADE
);

-- 4. COMPLAINTS TABLE (Demonstrating CRUD: Create, Read, Update, Delete)
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(50) NOT NULL UNIQUE,
    complaint_number VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    threat_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    incident_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(150),
    financial_loss DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    suspicious_url TEXT,
    attacker_information TEXT,
    additional_information TEXT,
    user_response TEXT,
    response_provided_at TIMESTAMP NULL,
    
    -- Official Investigation Resolution Results dispatched to Citizen
    resolution_verdict VARCHAR(150),
    resolution_summary TEXT,
    actions_taken_summary TEXT,
    citizen_guidance TEXT,
    resolution_badge VARCHAR(50) DEFAULT 'VERIFIED_RESOLVED',
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. COMPLAINT ASSIGNMENTS (Admin assigns work to Investigator)
CREATE TABLE IF NOT EXISTS complaint_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    investigator_id BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP NULL,
    assignment_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (investigator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. INVESTIGATION NOTES & FORENSIC FINDINGS
CREATE TABLE IF NOT EXISTS investigation_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    investigator_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    finding TEXT,
    action_taken TEXT,
    recommendation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (investigator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. SECURE CASE CHAT ROOM MESSAGES (Direct communication between Citizen and Investigator)
CREATE TABLE IF NOT EXISTS case_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    attachment_name VARCHAR(200),
    attachment_data TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INITIAL SEED DATA FOR DEMO & TESTING
-- ==============================================================================

-- Seed Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_USER'),
(2, 'ROLE_INVESTIGATOR'),
(3, 'ROLE_ADMIN'),
(4, 'ROLE_COORDINATOR')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Default Accounts (Password: Password@123 for all demo accounts)
-- Secret Clearance Code for Admin: MAIN
-- Secret Clearance Code for Investigator: SUB
INSERT INTO users (id, public_id, full_name, email, phone, password_hash, role_id, account_status) VALUES
(1, 'usr-admin-001', 'SOC Administrator', 'admin@cybershield.org', '+91-9876543210', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 3, 'ACTIVE'),
(2, 'usr-inv-002', 'Senior Cyber Investigator', 'investigator@cybershield.org', '+91-9876543211', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 2, 'ACTIVE'),
(3, 'usr-cit-003', 'John Citizen Defender', 'user@cybershield.org', '+91-9876543212', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Seed Threat Categories
INSERT INTO threat_categories (id, name, description) VALUES
(1, 'Financial & Banking Fraud', 'UPI, NetBanking, ATM/Card and unauthorized transaction scams'),
(2, 'Phishing & Identity Theft', 'Fake banking links, spoofed URLs, impersonation and credential theft'),
(3, 'Malware & Ransomware', 'Malicious APK attachments, trojans, ransomware extortion')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Sample Complaint
INSERT INTO complaints (id, public_id, complaint_number, user_id, title, description, category, threat_type, severity, status, financial_loss, currency, suspicious_url, attacker_information)
VALUES (
    1, 
    'cmp-001-demo', 
    'CS-2026-100001', 
    3, 
    'Unauthorized UPI QR Payment Deducted via Phishing Link', 
    'Victim clicked on a deceptive banking alert SMS claiming KYC suspension. Scanning the QR code caused Rs 25,000 to be transferred to unknown VPA.', 
    'Financial & Banking Fraud', 
    'UPI QR Code Fraud', 
    'HIGH', 
    'UNDER_INVESTIGATION', 
    25000.00, 
    'INR', 
    'http://secure-update-kyc-bank.xyz', 
    'Scammer UPI VPA: nodal_payment_mule@ybl'
) ON DUPLICATE KEY UPDATE id=VALUES(id);

INSERT INTO complaint_assignments (complaint_id, investigator_id, assigned_by, assignment_status)
VALUES (1, 2, 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE id=VALUES(id);

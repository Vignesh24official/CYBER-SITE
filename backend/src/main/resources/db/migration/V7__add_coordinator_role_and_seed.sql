-- Seed Coordinator Role
INSERT INTO roles (id, name) VALUES (4, 'ROLE_COORDINATOR');

-- Seed Default Coordinator Account
-- Password: Password@123
-- Hash: $2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi
INSERT INTO users (id, public_id, full_name, email, phone, password_hash, role_id, account_status, created_at, updated_at) VALUES
(4, '10000000-0000-0000-0000-000000000004', 'Lead Incident Coordinator', 'coordinator@cybershield.org', '+1-800-555-0104', '$2b$10$9WB9wQ.imv9vP7twM0aUxuTRmr5A8yRLa.owhqa79ySxVmuB.L0oi', 4, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

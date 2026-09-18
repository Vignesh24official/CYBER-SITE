# CyberShield Database & Entity Engineering

## Schema Overview
Database migrations are managed through Flyway SQL scripts under `src/main/resources/db/migration`:

- `V1__create_users_and_roles.sql`: `roles`, `users`, `refresh_tokens`.
- `V2__create_complaints_and_history.sql`: `threat_categories`, `threat_types`, `complaints`, `complaint_status_history`, `complaint_assignments`.
- `V3__create_investigations_and_evidence.sql`: `investigation_notes`, `evidence_files`.
- `V4__create_notifications_and_audit.sql`: `notifications`, `audit_logs`.
- `V5__create_safety_articles.sql`: `safety_articles`.
- `V6__seed_initial_data.sql`: Seed data for roles, categories, threat types, safety articles, and initial admin/investigator/user accounts.

## Complaint Number Formatting
Complaint numbers follow the format `CS-YYYY-XXXXXX` (e.g. `CS-2026-000001`), generated deterministically based on primary key sequence and year.

## Key Database Indexes
- `idx_users_email` & `idx_users_public_id`
- `idx_complaints_number`, `idx_complaints_user`, `idx_complaints_status`, `idx_complaints_severity`
- `idx_assignments_investigator`
- `idx_audit_logs_actor` & `idx_audit_logs_created_at`

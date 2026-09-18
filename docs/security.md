# CyberShield Security Hardening & OWASP Compliance

## Implemented Security Controls

### 1. Authentication & Cryptography (A02, A07)
- Passwords stored strictly as BCrypt hashes with cost factor 12. Zero plaintext password storage.
- Statutory JWT tokens (Access token: 15 min expiry, Refresh token: 7 day expiry stored SHA-256 hashed in database).
- Anti-account-enumeration responses during registration and login.

### 2. Authorization & RBAC (A01)
- 3-tier Role-Based Access Control (`ROLE_USER`, `ROLE_INVESTIGATOR`, `ROLE_ADMIN`).
- Method security (`@PreAuthorize`) and URL pattern matching.
- User can only access own complaints; investigator can only access assigned cases; admin has system-wide access.

### 3. Input Validation & Injection Prevention (A03)
- JPA Parameterized Queries (Hibernate) preventing SQL injection.
- Spring Bean Validation (`@Valid`, `@NotBlank`, `@Pattern`, `@Size`) on all input DTOs.

### 4. File Upload Hardening (A04, A08)
- Filename extension and MIME-type white-list validation (`pdf`, `png`, `jpg`, `jpeg`, `txt`, `csv`).
- Random UUID server-side stored filenames outside public web root.
- SHA-256 checksum calculation for integrity validation.
- Downloads protected by mandatory security authorization check.

### 5. Audit Logging (A09)
- Immutable database audit trail capturing logins, status transitions, investigator assignments, evidence access, and admin modifications.

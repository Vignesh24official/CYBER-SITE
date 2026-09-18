# CyberShield Architecture & Design Specification

## System Overview
CyberShield is built as an enterprise monorepo featuring a decoupled React SPA frontend and a Spring Boot 3 RESTful API backend connected to PostgreSQL.

```
React SPA Frontend (Port 5173 / Nginx 80)
       │
       │ HTTPS REST API Requests (Bearer JWT)
       ▼
Spring Boot REST Controllers (Port 8080)
       │
       ├── Spring Security 6 (JWT + RBAC Filters)
       ├── Business & State Machine Services
       ├── Threat Heuristic Evaluation Engine
       ├── JPA / Hibernate Repositories
       ├── File Storage Manager (SHA-256 Hashing)
       └── Flyway Database Migrations
               │
               ▼
      PostgreSQL Database (Port 5432)
```

## Layered Architecture
- **Presentation Layer**: Controllers (`AuthController`, `ComplaintController`, `AdminController`, `InvestigatorController`, `EvidenceController`, `NotificationController`, `ThreatAnalysisController`, `ReportController`). Zero business logic inside controllers.
- **Service Layer**: Business operations, `StateTransitionService` state machine, `ThreatAnalysisService` heuristic engine, `EvidenceService` file handler, `AuditLogService` immutable logging, and `NotificationService`.
- **Data Access Layer**: JPA repositories with custom queries and Specification builders (`ComplaintSpecification`).
- **Persistence Layer**: PostgreSQL database with Flyway versioned migrations (`V1__...` to `V6__...`).

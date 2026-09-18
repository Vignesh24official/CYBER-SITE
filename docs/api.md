# CyberShield REST API Reference

All endpoints use `/api/v1/` prefix and return standard JSON envelope responses.

## Standard JSON Envelopes

### Success Response (HTTP 200/201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Request processed successfully",
  "timestamp": "2026-09-10T19:00:00.000"
}
```

### Error Response (HTTP 400/401/403/404/500)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot transition complaint status from SUBMITTED to RESOLVED."
  },
  "timestamp": "2026-09-10T19:00:00.000",
  "path": "/api/v1/admin/complaints/CS-2026-000001/status"
}
```

## Core Endpoint Routes

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/complaints` - Submit incident report
- `GET /api/v1/complaints/my-complaints` - Get user complaints
- `GET /api/v1/complaints/{publicId}` - Get complaint details
- `POST /api/v1/threat-analysis/url` - Heuristic URL risk score
- `GET /api/v1/admin/complaints` - Admin SOC complaints grid
- `POST /api/v1/admin/complaints/{id}/assign` - Assign investigator
- `GET /api/v1/admin/reports/summary` - Aggregated analytics metrics
- `GET /api/v1/admin/reports/export/csv` - Export incidents in CSV

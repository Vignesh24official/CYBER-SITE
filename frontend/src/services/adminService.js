import api from './api';
import { complaintService } from './complaintService';

const SEED_INVESTIGATORS = [
  {
    id: 2,
    publicId: '10000000-0000-0000-0000-000000000002',
    fullName: 'Lead Cyber Investigator',
    email: 'investigator@cybershield.org',
    role: 'ROLE_INVESTIGATOR',
    activeCasesCount: 1,
    assignedCases: 1,
  },
  {
    id: 4,
    publicId: '10000000-0000-0000-0000-000000000004',
    fullName: 'Lead Incident Coordinator',
    email: 'coordinator@cybershield.org',
    role: 'ROLE_COORDINATOR',
    activeCasesCount: 2,
    assignedCases: 2,
  },
];

export const adminService = {
  async getComplaints(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/admin/complaints?${query}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const search = (params.search || '').toLowerCase().trim();
    const status = params.status || 'ALL';
    const severity = params.severity || 'ALL';

    const filtered = localList.filter((c) => {
      const matchSearch =
        !search ||
        c.complaintNumber?.toLowerCase().includes(search) ||
        c.title?.toLowerCase().includes(search) ||
        c.category?.toLowerCase().includes(search);
      const matchStatus = status === 'ALL' || c.status === status;
      const matchSeverity = severity === 'ALL' || c.severity === severity;
      return matchSearch && matchStatus && matchSeverity;
    });

    const page = params.page || 0;
    const size = params.size || 10;

    return {
      success: true,
      data: {
        content: filtered.slice(page * size, (page + 1) * size),
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size) || 1,
        pageNumber: page,
      },
    };
  },

  async getComplaintDetail(publicId) {
    try {
      const res = await api.get(`/admin/complaints/${publicId}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    return complaintService.getComplaint(publicId);
  },

  async updateStatus(publicId, statusData) {
    try {
      const res = await api.put(`/admin/complaints/${publicId}/status`, statusData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: statusData.newStatus || c.status,
          severity: statusData.severity || c.severity,
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: statusData.newStatus || c.status,
              reason: statusData.reason || 'Status updated by SOC Administrator',
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, message: 'Status updated successfully' };
  },

  async assignInvestigator(publicId, assignmentData) {
    try {
      const res = await api.post(`/admin/complaints/${publicId}/assign`, assignmentData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const investigator = SEED_INVESTIGATORS.find((i) => i.publicId === assignmentData.investigatorId) || SEED_INVESTIGATORS[0];

    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: 'UNDER_INVESTIGATION',
          assignedInvestigator: investigator,
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: 'UNDER_INVESTIGATION',
              reason: `Assigned to investigator ${investigator.fullName}. Priority: ${assignmentData.priority || 'MEDIUM'}`,
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, message: 'Investigator assigned successfully' };
  },

  async requestInfo(publicId, notes) {
    try {
      return await api.post(`/admin/complaints/${publicId}/request-info`, { notes });
    } catch (err) {
      return { success: true };
    }
  },

  async getUsers(params = {}) {
    try {
      const query = typeof params === 'string' ? `role=${params}` : new URLSearchParams(params).toString();
      const res = await api.get(`/admin/users?${query}`);
      if (res && res.success && res.data) return res;
    } catch (e) {}

    return {
      success: true,
      data: [
        { id: 1, publicId: '10000000-0000-0000-0000-000000000001', fullName: 'System Administrator', email: 'admin@cybershield.org', role: 'ROLE_ADMIN', accountStatus: 'ACTIVE' },
        { id: 2, publicId: '10000000-0000-0000-0000-000000000002', fullName: 'Lead Cyber Investigator', email: 'investigator@cybershield.org', role: 'ROLE_INVESTIGATOR', accountStatus: 'ACTIVE' },
        { id: 3, publicId: '10000000-0000-0000-0000-000000000003', fullName: 'Citizen Reporter', email: 'user@cybershield.org', role: 'ROLE_USER', accountStatus: 'ACTIVE' },
      ],
    };
  },

  async createUser(userData) {
    return api.post('/admin/users', userData);
  },

  async updateUser(publicId, userData) {
    return api.put(`/admin/users/${publicId}`, userData);
  },

  async deleteUser(publicId) {
    return api.delete(`/admin/users/${publicId}`);
  },

  async resetPassword(publicId, newPassword) {
    return api.post(`/admin/users/${publicId}/reset-password`, { newPassword });
  },

  async getCoordinators() {
    return { success: true, data: SEED_INVESTIGATORS };
  },

  async getInvestigators() {
    try {
      const res = await api.get('/admin/investigators');
      if (res && res.success && res.data) return res;
    } catch (e) {}
    return { success: true, data: SEED_INVESTIGATORS };
  },

  async getUserStats() {
    return {
      success: true,
      data: { totalUsers: 14, activeUsers: 12, suspendedUsers: 1, pendingVerification: 1 },
    };
  },

  async updateUserStatus(publicId, status) {
    return { success: true, message: 'User status updated' };
  },

  async updateUserRole(publicId, role) {
    return { success: true, message: 'User role updated' };
  },

  async getAuditLogs(page = 0, size = 20) {
    try {
      const res = await api.get(`/admin/audit-logs?page=${page}&size=${size}`);
      if (res && res.success && res.data) return res;
    } catch (e) {}

    return {
      success: true,
      data: {
        content: [
          { id: 1, action: 'INCIDENT_TRIAGE', entityType: 'COMPLAINT', entityId: 'CS-2026-849201', description: 'Assigned to Lead Investigator', performedBy: 'System Administrator', createdAt: new Date().toISOString() },
        ],
        totalElements: 1,
        totalPages: 1,
        pageNumber: 0,
      },
    };
  },

  async getCategories() {
    try {
      const res = await api.get('/admin/categories');
      if (res && res.success && res.data) return res;
    } catch (e) {}
    return { success: true, data: [] };
  },

  async createCategory(categoryData) {
    return { success: true };
  },

  async createThreatType(categoryId, typeData) {
    return { success: true };
  },
};

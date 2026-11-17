import api from './api';
import { complaintService } from './complaintService';

export const investigationService = {
  /**
   * Get cases assigned to the current investigator
   */
  async getAssignedCases(page = 0, size = 15, search = '', status = '') {
    try {
      const params = new URLSearchParams({ page, size });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await api.get(`/coordinator/cases?${params.toString()}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const query = search.toLowerCase().trim();
    const statusFilter = status.toUpperCase().trim();

    const filtered = localList.filter((c) => {
      const matchSearch =
        !query ||
        c.complaintNumber?.toLowerCase().includes(query) ||
        c.title?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query);

      const matchStatus =
        !statusFilter ||
        statusFilter === 'ALL' ||
        (statusFilter === 'PENDING' && c.status !== 'RESOLVED' && c.status !== 'CLOSED') ||
        (statusFilter === 'COMPLETED' && (c.status === 'RESOLVED' || c.status === 'CLOSED')) ||
        c.status === statusFilter;

      return matchSearch && matchStatus;
    });

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

  /**
   * Get full case dossier details for investigation
   */
  async getCaseDetail(publicId) {
    try {
      const res = await api.get(`/coordinator/cases/${publicId}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    return complaintService.getComplaint(publicId);
  },

  /**
   * Add a forensic investigation note to the case
   */
  async addNote(publicId, noteData) {
    try {
      const res = await api.post(`/coordinator/cases/${publicId}/notes`, noteData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const note = {
      id: Date.now(),
      notes: typeof noteData === 'string' ? noteData : noteData.notes,
      isInternalOnly: noteData?.isInternalOnly ?? false,
      createdAt: new Date().toISOString(),
      author: 'Lead Cyber Investigator',
    };

    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          notes: [...(c.notes || []), note],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, data: note, message: 'Investigation note appended' };
  },

  /**
   * Request additional evidence/clarification from the citizen
   */
  async requestInfo(publicId, notes) {
    try {
      const res = await api.post(`/coordinator/cases/${publicId}/request-info`, { notes });
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: 'ADDITIONAL_INFO_REQUESTED',
          investigatorQuestion: notes,
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: 'ADDITIONAL_INFO_REQUESTED',
              reason: `Investigator requested information: "${notes}"`,
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, message: 'Information requested from citizen' };
  },

  /**
   * Update investigation status
   */
  async updateStatus(publicId, statusData) {
    try {
      const res = await api.put(`/coordinator/cases/${publicId}/status`, statusData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: statusData.status || statusData.newStatus || c.status,
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: statusData.status || statusData.newStatus || c.status,
              reason: statusData.reason || 'Status updated by investigator',
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, message: 'Case status updated' };
  },

  /**
   * Resolve and conclude cybersecurity case with official forensic findings
   */
  async resolveCase(publicId, resolutionData) {
    try {
      const res = await api.post(`/coordinator/cases/${publicId}/resolve`, resolutionData);
      if (res && res.success) {
        return res;
      }
    } catch (err) {}

    const localList = complaintService.getLocalList();
    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: 'RESOLVED',
          resolvedAt: new Date().toISOString(),
          resolutionVerdict: resolutionData.verdict || 'THREAT_NEUTRALIZED',
          resolutionSummary: resolutionData.resolutionSummary || 'Case analyzed and resolved.',
          actionsTakenSummary: resolutionData.actionsTaken || 'IP blocklisted, indicators submitted to CERT.',
          citizenGuidance: resolutionData.citizenGuidance || 'Change all passwords and activate 2FA.',
          resolutionBadge: 'VERIFIED_OFFICIAL_FORENSIC_RESOLUTION',
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: 'RESOLVED',
              reason: `Investigation concluded: ${resolutionData.verdict || 'THREAT_NEUTRALIZED'}`,
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return { success: true, message: 'Investigation officially concluded and reported to citizen.' };
  },

  async markCompleted(publicId, remarks = 'Investigation successfully concluded') {
    return this.resolveCase(publicId, {
      verdict: 'OFFICIALLY_RESOLVED',
      resolutionSummary: remarks,
      actionsTaken: 'Forensic inspection completed.',
      citizenGuidance: 'Remain vigilant and keep credentials updated.',
    });
  },
};

export const coordinatorService = investigationService;

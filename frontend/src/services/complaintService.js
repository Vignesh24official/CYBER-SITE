import api from './api';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'cybershield_local_complaints';

// Helper to get local complaints
const getLocalComplaints = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local complaints:', e);
    return [];
  }
};

// Helper to save local complaints
const saveLocalComplaints = (complaints) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Error saving local complaints:', e);
  }
};

// Initial sample complaints if store is completely empty
const getSeedComplaints = () => [
  {
    id: 101,
    publicId: 'c1010000-0000-0000-0000-000000000001',
    complaintNumber: 'CS-2026-849201',
    title: 'Compromised Office 365 Login with Phishing Link',
    description: 'Received an email purporting to be IT support asking to reset credentials. Clicked link and entered details.',
    category: 'Phishing & Identity Theft',
    threatType: 'Phishing Email Link',
    severity: 'HIGH',
    status: 'SUBMITTED',
    incidentDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    reportedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    location: 'Mumbai, MH',
    financialLoss: 0,
    currency: 'INR',
    suspiciousUrl: 'https://security-verify-portal-update.com/login',
    attackerInformation: 'support@mail-system-update.org',
    evidenceFiles: [],
    statusHistories: [
      { id: 1, oldStatus: null, newStatus: 'SUBMITTED', reason: 'Initial citizen incident report filed', changedAt: new Date(Date.now() - 3600000 * 3).toISOString() }
    ],
    notes: []
  }
];

export const complaintService = {
  /**
   * Submit a new cybersecurity incident complaint
   */
  async createComplaint(data) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cybershield_token') : null;
    const isMockAuth = !token || token.startsWith('mock_jwt_');

    // If using real backend token, attempt Spring Boot REST API
    if (!isMockAuth) {
      try {
        const res = await api.post('/complaints', data);
        if (res && (res.success || res.data)) {
          const item = res.data || res;
          const current = getLocalComplaints();
          saveLocalComplaints([item, ...current]);
          return { success: true, data: item, message: 'Complaint submitted successfully' };
        }
      } catch (apiErr) {
        console.warn('Backend API request notice:', apiErr?.message);
      }
    }

    // Direct Instant Fallback: Generate local & cloud complaint record
    const currentUserRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('cybershield_user') : null;
    let currentUser = null;
    try {
      currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    } catch (e) {}

    const generatedId = Date.now();
    const publicId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cs-${generatedId}`;
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const complaintNumber = `CS-2026-${randNum}`;

    const newComplaint = {
      id: generatedId,
      publicId: publicId,
      complaintNumber: complaintNumber,
      user: currentUser || {
        id: 3,
        publicId: '10000000-0000-0000-0000-000000000003',
        fullName: 'Citizen Reporter',
        email: 'user@cybershield.org',
        role: 'ROLE_USER',
      },
      title: data.title ? data.title.trim() : 'Cybersecurity Incident',
      description: data.description ? data.description.trim() : 'Incident details reported by citizen.',
      category: data.category || 'Phishing & Identity Theft',
      threatType: data.threatType || 'Phishing Email Link',
      severity: data.severity || (Number(data.financialLoss) > 50000 ? 'CRITICAL' : Number(data.financialLoss) > 5000 ? 'HIGH' : 'MEDIUM'),
      status: 'SUBMITTED',
      incidentDate: data.incidentDate || new Date().toISOString(),
      reportedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      location: data.location || 'Online / Remote',
      financialLoss: parseFloat(data.financialLoss) || 0,
      currency: data.currency || 'INR',
      suspiciousUrl: data.suspiciousUrl || null,
      attackerInformation: data.attackerInformation || null,
      additionalInformation: data.additionalInformation || null,
      evidenceFiles: [],
      statusHistories: [
        {
          id: 1,
          oldStatus: null,
          newStatus: 'SUBMITTED',
          reason: 'Incident report securely submitted by citizen via CyberShield Portal',
          changedAt: new Date().toISOString(),
        },
      ],
      notes: [],
      assignedInvestigator: null,
    };

    // Save to LocalStorage
    const list = getLocalComplaints();
    saveLocalComplaints([newComplaint, ...list]);

    // Non-blocking sync to Supabase if configured (never awaits or blocks response)
    if (supabase) {
      try {
        supabase.from('complaints').insert({
          public_id: newComplaint.publicId,
          complaint_number: newComplaint.complaintNumber,
          user_id: currentUser?.id || 3,
          title: newComplaint.title,
          description: newComplaint.description,
          category: newComplaint.category,
          threat_type: newComplaint.threatType,
          severity: newComplaint.severity,
          status: newComplaint.status,
          incident_date: newComplaint.incidentDate,
          location: newComplaint.location,
          financial_loss: newComplaint.financialLoss,
          currency: newComplaint.currency,
          suspicious_url: newComplaint.suspiciousUrl,
          attacker_information: newComplaint.attackerInformation,
          additional_information: newComplaint.additionalInformation,
        }).then(() => {}).catch(() => {});
      } catch (e) {}
    }

    return {
      success: true,
      data: newComplaint,
      message: 'Complaint submitted successfully',
    };
  },

  /**
   * Get complaints submitted by the current user
   */
  async getMyComplaints(page = 0, size = 10) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cybershield_token') : null;
    const isMockAuth = !token || token.startsWith('mock_jwt_');

    let backendData = null;
    if (!isMockAuth) {
      try {
        const res = await api.get(`/complaints/my-complaints?page=${page}&size=${size}`);
        if (res && res.success && res.data) {
          backendData = res.data;
        }
      } catch (err) {}
    }

    const localList = getLocalComplaints();
    const seeds = localList.length === 0 ? getSeedComplaints() : [];
    if (seeds.length > 0 && localList.length === 0) {
      saveLocalComplaints(seeds);
    }
    const combined = [...localList, ...seeds];

    // Deduplicate by complaintNumber
    const seen = new Set();
    const unique = [];
    if (backendData?.content) {
      backendData.content.forEach((item) => {
        seen.add(item.complaintNumber);
        unique.push(item);
      });
    }
    combined.forEach((item) => {
      if (!seen.has(item.complaintNumber)) {
        seen.add(item.complaintNumber);
        unique.push(item);
      }
    });

    return {
      success: true,
      data: {
        content: unique.slice(page * size, (page + 1) * size),
        totalElements: unique.length,
        totalPages: Math.ceil(unique.length / size) || 1,
        pageNumber: page,
      },
    };
  },

  /**
   * Get detailed complaint information by public ID
   */
  async getComplaint(publicId) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cybershield_token') : null;
    const isMockAuth = !token || token.startsWith('mock_jwt_');

    if (!isMockAuth) {
      try {
        const res = await api.get(`/complaints/${publicId}`);
        if (res && res.success && res.data) {
          return res;
        }
      } catch (err) {}
    }

    const localList = getLocalComplaints();
    const found = localList.find((c) => c.publicId === publicId || c.complaintNumber === publicId);
    if (found) {
      return { success: true, data: found };
    }

    const seed = getSeedComplaints().find((c) => c.publicId === publicId || c.complaintNumber === publicId);
    if (seed) {
      return { success: true, data: seed };
    }

    return { success: false, message: 'Complaint not found' };
  },

  /**
   * Provide additional citizen information requested by investigator
   */
  async provideInfoResponse(publicId, responseMessage) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cybershield_token') : null;
    const isMockAuth = !token || token.startsWith('mock_jwt_');

    if (!isMockAuth) {
      try {
        const res = await api.post(`/complaints/${publicId}/info-response`, { responseMessage });
        if (res && res.success) {
          return res;
        }
      } catch (err) {}
    }

    const localList = getLocalComplaints();
    const updated = localList.map((c) => {
      if (c.publicId === publicId || c.complaintNumber === publicId) {
        return {
          ...c,
          status: 'UNDER_INVESTIGATION',
          userResponse: responseMessage,
          responseProvidedAt: new Date().toISOString(),
          statusHistories: [
            ...(c.statusHistories || []),
            {
              id: Date.now(),
              oldStatus: c.status,
              newStatus: 'UNDER_INVESTIGATION',
              reason: `Citizen provided requested information: "${responseMessage}"`,
              changedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return c;
    });

    saveLocalComplaints(updated);
    const item = updated.find((c) => c.publicId === publicId || c.complaintNumber === publicId);
    return { success: true, data: item, message: 'Information updated successfully' };
  },

  /**
   * Directly get all raw local complaints (utility for admin & investigator syncing)
   */
  getLocalList: getLocalComplaints,
  saveLocalList: saveLocalComplaints,
};

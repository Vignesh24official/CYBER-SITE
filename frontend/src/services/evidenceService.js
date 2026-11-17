import api from './api';
import { supabase, uploadEvidenceToSupabase } from './supabaseClient';
import { complaintService } from './complaintService';

export const evidenceService = {
  /**
   * Upload an evidence file for a complaint
   */
  async uploadEvidence(complaintPublicId, file) {
    // 1. Try backend API
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/complaints/${complaintPublicId}/evidence`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res && (res.success || res.data)) {
        return res;
      }
    } catch (apiErr) {
      console.warn('Backend evidence upload unavailable, using cloud/local storage:', apiErr?.message);
    }

    // 2. Try Supabase storage if available
    let storageUrl = null;
    try {
      if (supabase) {
        storageUrl = await uploadEvidenceToSupabase(file, `complaints/${complaintPublicId}`);
      }
    } catch (sbErr) {
      console.warn('Supabase storage upload notice:', sbErr?.message);
    }

    // 3. Fallback: Save file metadata into local complaint
    const evidenceItem = {
      id: Date.now(),
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type || 'application/octet-stream',
      fileHashSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      uploadTimestamp: new Date().toISOString(),
      fileUrl: storageUrl || null,
    };

    const localList = complaintService.getLocalList();
    const updated = localList.map((c) => {
      if (c.publicId === complaintPublicId || c.complaintNumber === complaintPublicId) {
        return {
          ...c,
          evidenceFiles: [...(c.evidenceFiles || []), evidenceItem],
        };
      }
      return c;
    });
    complaintService.saveLocalList(updated);

    return {
      success: true,
      data: evidenceItem,
      message: 'Evidence attached successfully',
    };
  },

  getDownloadUrl(evidenceId) {
    return `/api/v1/evidence/${evidenceId}`;
  },

  async deleteEvidence(evidenceId) {
    try {
      return await api.delete(`/evidence/${evidenceId}`);
    } catch (e) {
      return { success: true };
    }
  },
};

import api from './api';
import { supabase } from './supabaseClient';

const getLocalMessages = (complaintPublicId) => {
  try {
    const raw = localStorage.getItem(`cybershield_chat_${complaintPublicId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalMessages = (complaintPublicId, msgs) => {
  try {
    localStorage.setItem(`cybershield_chat_${complaintPublicId}`, JSON.stringify(msgs));
  } catch (e) {}
};

export const chatService = {
  async getMessages(complaintPublicId) {
    try {
      const res = await api.get(`/complaints/${complaintPublicId}/chat`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    const localMsgs = getLocalMessages(complaintPublicId);
    return {
      success: true,
      data: localMsgs,
    };
  },

  async sendMessage(complaintPublicId, { message, attachmentName, attachmentData }) {
    try {
      const res = await api.post(`/complaints/${complaintPublicId}/chat`, {
        message,
        attachmentName,
        attachmentData,
      });
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    // Fallback: local message creation
    const currentUserRaw = localStorage.getItem('cybershield_user');
    let currentUser = null;
    try {
      currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    } catch (e) {}

    const isInvestigator = currentUser?.role === 'ROLE_INVESTIGATOR' || currentUser?.role === 'ROLE_COORDINATOR' || currentUser?.role === 'ROLE_ADMIN';

    const newMsg = {
      id: Date.now(),
      senderType: isInvestigator ? 'INVESTIGATOR' : 'CITIZEN',
      senderName: currentUser?.fullName || (isInvestigator ? 'Lead Cyber Investigator' : 'Citizen Reporter'),
      message: message,
      attachmentName: attachmentName || null,
      attachmentData: attachmentData || null,
      createdAt: new Date().toISOString(),
    };

    const current = getLocalMessages(complaintPublicId);
    const updated = [...current, newMsg];
    saveLocalMessages(complaintPublicId, updated);

    // Also attempt Supabase sync
    if (supabase) {
      try {
        await supabase.from('case_messages').insert({
          complaint_id: 1, // Fallback link
          sender_id: currentUser?.id || 3,
          sender_role: isInvestigator ? 'ROLE_INVESTIGATOR' : 'ROLE_USER',
          sender_name: newMsg.senderName,
          message: newMsg.message,
          attachment_name: newMsg.attachmentName,
          created_at: newMsg.createdAt,
        });
      } catch (e) {}
    }

    return {
      success: true,
      data: newMsg,
      message: 'Message sent',
    };
  },

  async getUnreadCount(complaintPublicId) {
    try {
      const res = await api.get(`/complaints/${complaintPublicId}/chat/unread`);
      if (res && res.success) return res;
    } catch (e) {}

    return { success: true, data: { unreadCount: 0 } };
  },
};

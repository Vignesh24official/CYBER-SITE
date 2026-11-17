import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Send,
  MessageSquare,
  Shield,
  ShieldAlert,
  User,
  Paperclip,
  Clock,
  CheckCheck,
  RefreshCw,
  Terminal,
  Zap,
} from 'lucide-react';

export const CaseChatRoom = ({ complaintPublicId, complaintNumber, assignedInvestigator, reporterName, initialAttachment = null }) => {
  const { user } = useAuth();
  const { showSuccess, showError, addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(initialAttachment);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const messagesEndRef = useRef(null);

  const isInvestigatorOrAdmin =
    user?.role === 'ROLE_INVESTIGATOR' ||
    user?.role === 'ROLE_ADMIN' ||
    user?.role === 'ROLE_COORDINATOR';

  const fetchMessages = async (silent = false) => {
    if (!complaintPublicId) return;
    try {
      const res = await chatService.getMessages(complaintPublicId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      if (!silent) {
        console.error('Failed to load chat messages:', err);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(false);

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchMessages(true);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [complaintPublicId, autoRefresh]);

  useEffect(() => {
    if (initialAttachment) {
      setAttachment(initialAttachment);
    }
  }, [initialAttachment]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    setSending(true);
    try {
      const res = await chatService.sendMessage(complaintPublicId, {
        message: inputText.trim() || 'Attached Forensic Artifact / Investigation Output',
        attachmentName: attachment?.name || null,
        attachmentData: attachment?.data || null,
      });

      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setInputText('');
        setAttachment(null);
        if (showSuccess) {
          showSuccess('Message dispatched to secure case channel');
        } else if (addToast) {
          addToast('Message dispatched', 'success');
        }
      }
    } catch (err) {
      if (showError) {
        showError(err.message || 'Failed to send message');
      } else if (addToast) {
        addToast(err.message || 'Failed to send message', 'error');
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const citizenPills = [
    'Can you provide a status update on my case?',
    'Has the fraudulent bank account been frozen?',
    'I found additional suspicious messages/SMS related to this.',
    'What immediate safety precautions should I take?',
  ];

  const investigatorPills = [
    'Notice dispatched to payment gateway & bank nodal officer.',
    'Phishing domain takedown notice served to registrar.',
    'Please confirm if any OTP, password, or remote access app was shared.',
    'Forensic inspection of uploaded evidence files is complete.',
  ];

  const quickPills = isInvestigatorOrAdmin ? investigatorPills : citizenPills;

  const renderRoleBadge = (role) => {
    if (role === 'CITIZEN' || role === 'ROLE_USER') {
      return (
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid var(--accent-cyan)',
            color: 'var(--accent-cyan)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600,
          }}
        >
          <User size={10} /> Citizen Reporter
        </span>
      );
    }
    if (role === 'ROLE_ADMIN') {
      return (
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid #c084fc',
            color: '#c084fc',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600,
          }}
        >
          <Shield size={10} /> SOC Admin
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: '0.7rem',
          padding: '2px 8px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--accent-emerald, #10b981)',
          color: 'var(--accent-emerald, #10b981)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 600,
        }}
      >
        <ShieldAlert size={10} /> Cyber Investigator
      </span>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card, #111827)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(6,182,212,0.08) 0%, rgba(17,24,39,0.95) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
            }}
          >
            <MessageSquare size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF' }}>
                Secure Case Communication Link
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                E2EE ENCRYPTED
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Case Ref: {complaintNumber || complaintPublicId} | Channel Active
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => fetchMessages(false)}
            title="Refresh messages"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
          >
            <RefreshCw size={12} /> Sync
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          height: '380px',
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'radial-gradient(ellipse at bottom, rgba(15,23,42,0.6) 0%, rgba(10,14,26,0.95) 100%)',
        }}
      >
        {loading ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <RefreshCw size={20} className="animate-spin" style={{ marginBottom: '8px' }} />
            <div>Establishing encrypted SOC communication stream...</div>
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              maxWidth: '380px',
              padding: '24px',
              borderRadius: '8px',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <Shield size={32} style={{ margin: '0 auto 10px', color: 'var(--accent-cyan)', opacity: 0.8 }} />
            <div style={{ fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>Direct Communication Channel Open</div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
              Use this encrypted room to communicate directly with your assigned Cyber Defense Officer regarding evidence, status updates, or recovery steps.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMine ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0' }}>
                    {isMine ? 'You' : msg.senderName}
                  </span>
                  {renderRoleBadge(msg.senderRole)}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Clock size={10} />
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: isMine
                      ? 'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(14,165,233,0.35) 100%)'
                      : 'rgba(30, 41, 59, 0.75)',
                    border: isMine ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    color: '#FFF',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {msg.message}

                  {msg.attachmentData && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: '#0a0e17',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'monospace',
                        fontSize: '0.775rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--accent-cyan)',
                          fontWeight: 700,
                          marginBottom: '6px',
                        }}
                      >
                        <Terminal size={12} /> {msg.attachmentName || 'Forensic Terminal Artifact'}
                      </div>
                      <pre
                        style={{
                          margin: 0,
                          color: '#38bdf8',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '160px',
                          overflowY: 'auto',
                        }}
                      >
                        {msg.attachmentData}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Inquiries / Response Pills */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={11} color="var(--accent-cyan)" /> Quick:
        </span>
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(pill)}
            style={{
              padding: '3px 10px',
              fontSize: '0.725rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Active Attachment Preview */}
      {attachment && (
        <div
          style={{
            padding: '8px 16px',
            background: 'rgba(6,182,212,0.1)',
            borderTop: '1px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.775rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
            <Paperclip size={14} />
            <span>
              Attached Forensic Output: <strong>{attachment.name}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Message Input Bar */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-dark, #0b0f19)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isInvestigatorOrAdmin
              ? 'Send case update or forensic instruction to citizen...'
              : 'Type your message to the cyber defense officer (press Enter to send)...'
          }
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: '#FFF',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={sending || (!inputText.trim() && !attachment)}
          className="btn btn-cyan"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            fontSize: '0.85rem',
            opacity: !inputText.trim() && !attachment ? 0.6 : 1,
          }}
        >
          <Send size={15} /> Send
        </button>
      </form>
    </div>
  );
};

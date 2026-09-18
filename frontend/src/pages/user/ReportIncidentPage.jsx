import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { CyberShieldSecurityPulse } from '../../components/common/CyberShieldSecurityPulse';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  Globe, 
  Lock, 
  Users, 
  Server, 
  Radio, 
  Key, 
  Database, 
  DollarSign, 
  Calendar, 
  MapPin, 
  X,
  FileCheck
} from 'lucide-react';

export const ReportIncidentPage = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState(null);

  // Form State
  const [category, setCategory] = useState('Phishing & Identity Theft');
  const [threatType, setThreatType] = useState('Phishing Email Link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState('');
  const [financialLoss, setFinancialLoss] = useState('0');
  const [suspiciousUrl, setSuspiciousUrl] = useState('');
  const [attackerInformation, setAttackerInformation] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');

  // Evidence Files State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileProgress, setFileProgress] = useState(0);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const threatCardOptions = [
    { category: 'Phishing & Identity Theft', threatType: 'Phishing Email Link', icon: Globe, title: 'Phishing Link / Email', desc: 'Deceptive links targeting account credentials' },
    { category: 'Financial & Banking Fraud', threatType: 'UPI QR Code Fraud', icon: DollarSign, title: 'Financial & UPI Fraud', desc: 'Fake payment requests, net banking, or card scam' },
    { category: 'Phishing & Identity Theft', threatType: 'Fake E-Commerce Website', icon: Globe, title: 'Suspicious Website', desc: 'Fake web shopping portal harvesting credentials' },
    { category: 'Unauthorized Access & Account Takeover', threatType: 'Unauthorized Portal Access', icon: Lock, title: 'Account Hacking', desc: 'Compromised social media, email, or corporate portal' },
    { category: 'Phishing & Identity Theft', threatType: 'Identity Impersonation', icon: Users, title: 'Identity Theft', desc: 'Stolen personal details or impersonation profiles' },
    { category: 'Malware & Ransomware', threatType: 'Ransomware Extortion', icon: Server, title: 'Malware & Ransomware', desc: 'System encryption, malicious binaries, extortion' },
    { category: 'Social Engineering & Cyberbullying', threatType: 'Cyber Harassment & Stalking', icon: Radio, title: 'Cyber Harassment', desc: 'Online stalking, defamation messages, coercion' },
    { category: 'Unauthorized Access & Account Takeover', threatType: 'Unauthorized Portal Access', icon: Key, title: 'Unauthorized Access', desc: 'Illegal network breach or privilege escalation' },
    { category: 'Malware & Ransomware', threatType: 'Trojan Attachment', icon: Database, title: 'Data Breach', desc: 'Exposed database leak or confidential asset exposure' },
    { category: 'Social Engineering & Cyberbullying', threatType: 'Social Media Hijacking', icon: AlertTriangle, title: 'Other Cyber Threats', desc: 'Zero-day exploits or custom attack vectors' },
  ];

  const handleSelectCard = (card) => {
    setCategory(card.category);
    setThreatType(card.threatType);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        showError('File size exceeds maximum limit of 15MB');
        return;
      }
      setSelectedFile(file);
      setFileProgress(100);
    }
  };

  const handleSubmitReport = async () => {
    if (!title || !description) {
      showError('Please fill in the required incident title and description.');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create Complaint via API
      const payload = {
        title,
        description,
        category,
        threatType,
        severity: Number(financialLoss) > 50000 ? 'CRITICAL' : Number(financialLoss) > 5000 ? 'HIGH' : 'MEDIUM',
        incidentDate: new Date(incidentDate).toISOString(),
        location: location || 'Online / Remote',
        financialLoss: parseFloat(financialLoss) || 0,
        currency: 'INR',
        suspiciousUrl: suspiciousUrl || null,
        attackerInformation: attackerInformation || null,
        additionalInformation: additionalInformation || null,
      };

      const res = await complaintService.createComplaint(payload);

      if (res.success && res.data) {
        const createdComplaint = res.data;

        // Step 2: Upload Evidence if selected
        if (selectedFile) {
          try {
            await evidenceService.uploadEvidence(createdComplaint.publicId, selectedFile);
          } catch (fileErr) {
            console.error('Evidence upload warning:', fileErr);
          }
        }

        setSubmittedIncident(createdComplaint);
        setStep(5); // Move to Step 5: Submission Success
        showSuccess('Incident report securely submitted!');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to submit incident report.';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER BAR */}
      <div className="card" style={{ padding: '24px 32px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(17, 22, 34, 0.95) 100%)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ marginBottom: '6px' }}>
              <CyberShieldSecurityPulse statusText="GUIDED INCIDENT REPORTING WIZARD" compact={true} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
              Report a Cybersecurity Threat
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            STEP {step} OF 5
          </span>
        </div>

        {/* STEPPER PROGRESS INDICATOR */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                backgroundColor: s <= step ? 'var(--accent-cyan-bright)' : 'rgba(255,255,255,0.08)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT THREAT TYPE */}
      {step === 1 && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
            Step 1: Select Cyber Threat Category
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Choose the attack vector that best matches the security incident you experienced.
          </p>

          <div className="grid-2" style={{ gap: '16px' }}>
            {threatCardOptions.map((card, idx) => {
              const IconComp = card.icon;
              const isSelected = category === card.category && threatType === card.threatType;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectCard(card)}
                  style={{
                    padding: '20px',
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-dark)',
                    border: isSelected ? '2px solid var(--accent-cyan-bright)' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp size={20} color={isSelected ? 'var(--accent-cyan-bright)' : 'var(--text-secondary)'} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--accent-cyan-bright)' : '#FFF', marginBottom: '4px' }}>
                      {card.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ padding: '12px 28px', fontWeight: 700 }}>
              Next: Enter Incident Details <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INCIDENT DETAILS FORM */}
      {step === 2 && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
            Step 2: Incident Details
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Provide accurate details about when, where, and how the incident occurred.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Incident Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Fraudulent UPI QR code transaction request on Telegram"
                required
                style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {/* Date & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Date & Time of Incident *
                </label>
                <input
                  type="datetime-local"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Financial Loss (INR if applicable)
                </label>
                <input
                  type="number"
                  value={financialLoss}
                  onChange={(e) => setFinancialLoss(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Suspicious URL & Attacker info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Suspicious URL / Website (If any)
                </label>
                <input
                  type="url"
                  value={suspiciousUrl}
                  onChange={(e) => setSuspiciousUrl(e.target.value)}
                  placeholder="https://phishing-site-example.com/login"
                  style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Suspected Attacker Details (Phone, Email, Handle)
                </label>
                <input
                  type="text"
                  value={attackerInformation}
                  onChange={(e) => setAttackerInformation(e.target.value)}
                  placeholder="Caller ID, WhatsApp number, or Telegram handle"
                  style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Full Incident Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe what happened in detail. Include how you were contacted, actions taken, and any financial losses."
                required
                style={{ width: '100%', padding: '12px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#FFF', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              <ArrowLeft size={18} /> Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary" style={{ padding: '12px 28px', fontWeight: 700 }}>
              Next: Attach Evidence <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EVIDENCE UPLOAD */}
      {step === 3 && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
            Step 3: Attach Digital Evidence
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Upload supporting screenshots, PDFs, transaction receipts, or email files (Max 15MB).
          </p>

          <div
            style={{
              padding: '40px 24px',
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-dark)',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            <Upload size={40} color="var(--accent-cyan-bright)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
              Drag & Drop file or click to browse
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Supported: PNG, JPG, PDF, TXT, DOCX, EML (Up to 15MB)
            </p>

            <input
              type="file"
              onChange={handleFileChange}
              id="evidenceInput"
              style={{ display: 'none' }}
            />
            <label htmlFor="evidenceInput" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              Select File
            </label>
          </div>

          {selectedFile && (
            <div style={{ padding: '16px 20px', backgroundColor: 'rgba(6, 182, 212, 0.08)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileCheck size={24} color="var(--accent-cyan-bright)" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>{selectedFile.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB | SHA-256 Checksum Pending
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              <ArrowLeft size={18} /> Back
            </button>
            <button onClick={() => setStep(4)} className="btn btn-primary" style={{ padding: '12px 28px', fontWeight: 700 }}>
              Next: Review Summary <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUMMARY REVIEW */}
      {step === 4 && (
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
            Step 4: Review Complaint Summary
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Verify your report details before submitting to the security triage queue.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-dark)', padding: '24px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Title:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>{title || 'Untitled Report'}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Category:</span>
                <div style={{ fontSize: '0.9rem', color: 'var(--accent-cyan-bright)', fontWeight: 600 }}>{category}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Threat Vector:</span>
                <div style={{ fontSize: '0.9rem', color: '#FFF' }}>{threatType}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Financial Loss:</span>
                <div style={{ fontSize: '0.9rem', color: Number(financialLoss) > 0 ? 'var(--accent-rose)' : 'var(--text-secondary)', fontWeight: 700 }}>
                  ₹ {financialLoss} INR
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Description:</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                {description}
              </p>
            </div>

            {selectedFile && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>Attached Evidence:</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '4px' }}>
                  ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={() => setStep(3)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              <ArrowLeft size={18} /> Back
            </button>

            <button
              onClick={handleSubmitReport}
              disabled={submitting}
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {submitting ? (
                <>
                  <Activity size={18} className="spin" />
                  <span>Submitting Secure Report...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMISSION SUCCESS ANIMATION & ID GENERATION */}
      {step === 5 && submittedIncident && (
        <div
          className="card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle size={42} color="var(--accent-emerald)" />
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>
            Your Report Has Been Securely Submitted
          </h3>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Your cybersecurity complaint has been logged in the CyberShield immutable ledger and queued for security investigator triage.
          </p>

          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 32px',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
              marginBottom: '36px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              CYBERSHIELD INCIDENT ID
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan-bright)', fontFamily: 'monospace', marginTop: '4px' }}>
              {submittedIncident.complaintNumber}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate(`/complaints/${submittedIncident.publicId}`)}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontWeight: 700 }}
            >
              Track Investigation Progress
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              style={{ padding: '12px 24px' }}
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { evidenceService } from '../../services/evidenceService';
import { useToast } from '../../context/ToastContext';
import { Shield, AlertCircle, ArrowRight, ArrowLeft, Upload, CheckCircle2, DollarSign, FileText } from 'lucide-react';

const CATEGORIES = [
  { name: 'Financial & Banking Fraud', types: ['UPI QR Code Fraud', 'Net Banking Credential Theft', 'Credit/Debit Card Vishing'] },
  { name: 'Phishing & Identity Theft', types: ['Phishing Email Link', 'Fake E-Commerce Website', 'Identity Impersonation'] },
  { name: 'Social Engineering & Cyberbullying', types: ['Social Media Hijacking', 'Cyber Harassment & Stalking'] },
  { name: 'Malware & Ransomware', types: ['Ransomware Extortion', 'Trojan Attachment'] },
  { name: 'Unauthorized Access & Account Takeover', types: ['Unauthorized Portal Access'] },
  { name: 'Other Cybersecurity Incident', types: ['General Cyber Crime'] },
];

export const MultiStepComplaintForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0].name,
    threatType: CATEGORIES[0].types[0],
    description: '',
    incidentDate: new Date().toISOString().slice(0, 16),
    location: '',
    financialLoss: 0,
    currency: 'INR',
    suspiciousUrl: '',
    attackerInformation: '',
    additionalInformation: '',
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const selectedCat = CATEGORIES.find((c) => c.name === e.target.value);
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      threatType: selectedCat ? selectedCat.types[0] : '',
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.title || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
      if (!formData.description || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
      if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1)) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        incidentDate: new Date(formData.incidentDate).toISOString(),
        financialLoss: parseFloat(formData.financialLoss) || 0,
      };

      const res = await complaintService.createComplaint(payload);
      if (res.success && res.data) {
        const createdComplaint = res.data;
        addToast(`Complaint ${createdComplaint.complaintNumber} created successfully!`, 'success');

        if (evidenceFile) {
          try {
            await evidenceService.uploadEvidence(createdComplaint.publicId, evidenceFile);
            addToast('Evidence file uploaded successfully', 'success');
          } catch (uploadErr) {
            addToast('Complaint submitted, but evidence file upload failed: ' + uploadErr.message, 'warning');
          }
        }

        navigate(`/complaints/${createdComplaint.publicId}`);
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.name === formData.category);

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Wizard Progress Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step === num ? 'var(--accent-blue)' : step > num ? 'var(--accent-emerald)' : 'var(--bg-dark)',
                border: '1px solid ' + (step >= num ? 'var(--accent-cyan)' : 'var(--border-color)'),
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {step > num ? <CheckCircle2 size={16} /> : num}
            </div>
            <span style={{ fontSize: '0.8rem', color: step === num ? 'var(--text-primary)' : 'var(--text-muted)', display: num === step ? 'inline' : 'none' }}>
              {num === 1 && 'Incident'}
              {num === 2 && 'Threat Info'}
              {num === 3 && 'Financials'}
              {num === 4 && 'Evidence'}
              {num === 5 && 'Review'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: Incident Details */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--accent-cyan)" /> Step 1: Incident Details
            </h3>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Incident Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Unauthorized UPI transfer of ₹25,000 via fraudulent QR code"
              />
              {errors.title && <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>{errors.title}</span>}
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Category *
                </label>
                <select value={formData.category} onChange={handleCategoryChange}>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Threat Type *
                </label>
                <select
                  value={formData.threatType}
                  onChange={(e) => setFormData({ ...formData, threatType: e.target.value })}
                >
                  {selectedCategoryObj?.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Detailed Description *
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide exact timeline, sequence of events, communication channels used by scammer..."
              />
              {errors.description && <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>{errors.description}</span>}
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Incident Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  City / Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. New York, NY / Mumbai"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Threat Details */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield color="var(--accent-cyan)" /> Step 2: Threat & Attacker Information
            </h3>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Suspicious Link / Phishing URL (if any)
              </label>
              <input
                type="text"
                value={formData.suspiciousUrl}
                onChange={(e) => setFormData({ ...formData, suspiciousUrl: e.target.value })}
                placeholder="e.g. http://192.168.1.1/verify-account"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Attacker Information (Phone number, UPI ID, Email, IP Address)
              </label>
              <textarea
                rows={4}
                value={formData.attackerInformation}
                onChange={(e) => setFormData({ ...formData, attackerInformation: e.target.value })}
                placeholder="e.g. Scammer phone: +1-555-0199, Fake UPI VPA: scammer@upi"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Additional Notes
              </label>
              <textarea
                rows={3}
                value={formData.additionalInformation}
                onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                placeholder="Any other helpful context..."
              />
            </div>
          </div>
        )}

        {/* STEP 3: Financial Loss */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign color="var(--accent-cyan)" /> Step 3: Financial Impact
            </h3>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Financial Loss Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.financialLoss}
                  onChange={(e) => setFormData({ ...formData, financialLoss: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Evidence File Upload */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload color="var(--accent-cyan)" /> Step 4: Attach Evidence File
            </h3>

            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-dark)',
              }}
            >
              <Upload size={40} color="var(--accent-cyan)" style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>
                {evidenceFile ? evidenceFile.name : 'Upload Screenshot, PDF, or CSV Proof'}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Supported formats: PDF, PNG, JPG, JPEG, TXT, CSV (Max 15MB)
              </p>
              <input
                type="file"
                id="evidence-file-input"
                style={{ display: 'none' }}
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                onChange={(e) => setEvidenceFile(e.target.files[0])}
              />
              <label htmlFor="evidence-file-input" className="btn btn-secondary btn-sm">
                Choose File
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Final Review */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 color="var(--accent-emerald)" /> Step 5: Review & Submit Report
            </h3>

            <div style={{ backgroundColor: 'var(--bg-dark)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Title:</strong> {formData.title}</div>
              <div><strong>Category:</strong> {formData.category} ({formData.threatType})</div>
              <div><strong>Financial Loss:</strong> {formData.currency} {formData.financialLoss}</div>
              <div><strong>Suspicious URL:</strong> {formData.suspiciousUrl || 'None specified'}</div>
              <div><strong>Evidence File:</strong> {evidenceFile ? evidenceFile.name : 'None attached'}</div>
              <div><strong>Description:</strong> {formData.description}</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              <ArrowLeft size={16} /> Previous
            </button>
          ) : <div />}

          {step < 5 ? (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn btn-cyan">
              {submitting ? 'Submitting Report...' : 'Submit Incident Report'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

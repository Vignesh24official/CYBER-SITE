import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'SUBMITTED':
        return { bg: 'var(--status-submitted-bg)', color: 'var(--status-submitted-text)', label: 'Submitted' };
      case 'UNDER_REVIEW':
        return { bg: 'var(--status-review-bg)', color: 'var(--status-review-text)', label: 'Under Review' };
      case 'VALIDATED':
        return { bg: 'var(--status-validated-bg)', color: 'var(--status-validated-text)', label: 'Validated' };
      case 'ASSIGNED':
        return { bg: 'var(--status-assigned-bg)', color: 'var(--status-assigned-text)', label: 'Assigned' };
      case 'UNDER_INVESTIGATION':
        return { bg: 'var(--status-investigation-bg)', color: 'var(--status-investigation-text)', label: 'Under Investigation' };
      case 'WAITING_FOR_INFORMATION':
        return { bg: 'var(--status-waiting-bg)', color: 'var(--status-waiting-text)', label: 'Info Required' };
      case 'RESOLVED':
        return { bg: 'var(--status-resolved-bg)', color: 'var(--status-resolved-text)', label: 'Resolved' };
      case 'REJECTED':
        return { bg: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', label: 'Rejected' };
      case 'CLOSED':
        return { bg: 'var(--status-closed-bg)', color: 'var(--status-closed-text)', label: 'Closed' };
      default:
        return { bg: 'var(--bg-card)', color: 'var(--text-secondary)', label: status || 'Unknown' };
    }
  };

  const style = getStyle();
  return (
    <span className="badge" style={{ backgroundColor: style.bg, color: style.color }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: style.color }} />
      {style.label}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  const getStyle = () => {
    switch (severity) {
      case 'LOW':
        return { bg: 'var(--sev-low-bg)', color: 'var(--sev-low-text)' };
      case 'MEDIUM':
        return { bg: 'var(--sev-medium-bg)', color: 'var(--sev-medium-text)' };
      case 'HIGH':
        return { bg: 'var(--sev-high-bg)', color: 'var(--sev-high-text)' };
      case 'CRITICAL':
        return { bg: 'var(--sev-critical-bg)', color: 'var(--sev-critical-text)' };
      default:
        return { bg: 'var(--bg-card)', color: 'var(--text-secondary)' };
    }
  };

  const style = getStyle();
  return (
    <span className="badge" style={{ backgroundColor: style.bg, color: style.color }}>
      {severity}
    </span>
  );
};

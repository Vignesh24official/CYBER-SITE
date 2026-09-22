import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinatorService } from '../../services/investigationService';
import { StatusBadge, SeverityBadge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, MessageSquare, 
  FileCheck, Shield, ArrowRight, RefreshCw 
} from 'lucide-react';

export const CoordinatorTasksPage = ({ filterType = 'PENDING' }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await coordinatorService.getAssignedCases(0, 50);
      if (res.success && res.data) {
        let all = res.data.content || [];
        if (filterType === 'COMPLETED') {
          setTasks(all.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED'));
        } else {
          // Default: pending action or under investigation
          setTasks(all.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'));
        }
      }
    } catch (err) {
      showError(err.message || 'Failed to load task queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterType]);

  const handleQuickComplete = async (publicId, complaintNumber) => {
    if (!window.confirm(`Mark case ${complaintNumber} as RESOLVED?`)) return;
    setCompletingId(publicId);
    try {
      const res = await coordinatorService.markCompleted(publicId, 'Resolved by Coordinator after complete investigation');
      if (res.success) {
        showSuccess(`Case ${complaintNumber} marked as RESOLVED!`);
        fetchTasks();
      }
    } catch (err) {
      showError(err.message || 'Failed to complete case');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {filterType === 'COMPLETED' ? 'Completed Investigation Tasks' : 'Pending Coordinator Tasks & Action Items'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {filterType === 'COMPLETED' 
              ? 'Historical archive of resolved cybersecurity cases and concluded forensic workflows' 
              : 'Action items requiring forensic findings logging, victim info follow-up, or SLA triage'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchTasks} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          {filterType === 'COMPLETED' ? (
            <Link to="/coordinator/tasks" className="btn btn-primary btn-sm">
              <Clock size={14} /> View Pending Tasks
            </Link>
          ) : (
            <Link to="/coordinator/completed" className="btn btn-secondary btn-sm">
              <CheckCircle2 size={14} /> View Completed ({tasks.length})
            </Link>
          )}
        </div>
      </div>

      {/* TASK LIST CARDS */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading task items...
        </div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <CheckCircle2 size={44} color="var(--accent-emerald)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>
            {filterType === 'COMPLETED' ? 'No completed cases recorded yet.' : 'All pending coordinator tasks are up to date!'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Great job maintaining operational readiness across all assigned threat queues.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tasks.map((task) => (
            <div
              key={task.publicId}
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: `4px solid ${
                  task.status === 'RESOLVED' || task.status === 'CLOSED'
                    ? 'var(--accent-emerald)'
                    : task.severity === 'CRITICAL'
                    ? 'var(--accent-rose)'
                    : task.severity === 'HIGH'
                    ? 'var(--accent-amber)'
                    : 'var(--accent-cyan-bright)'
                }`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '650px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan-bright)' }}>
                    {task.complaintNumber}
                  </span>
                  <SeverityBadge severity={task.severity} />
                  <StatusBadge status={task.status} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Reported on {new Date(task.reportedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>
                  {task.title}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Category: <strong style={{ color: '#FFF' }}>{task.category}</strong></span>
                  <span>Reporter: <strong style={{ color: '#FFF' }}>{task.reporterName}</strong></span>
                  {Number(task.financialLoss) > 0 && (
                    <span style={{ color: 'var(--accent-rose)' }}>
                      Loss: <strong>{task.currency} {task.financialLoss}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {filterType !== 'COMPLETED' && task.status !== 'RESOLVED' && task.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleQuickComplete(task.publicId, task.complaintNumber)}
                    disabled={completingId === task.publicId}
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                    title="Mark case resolved"
                  >
                    <CheckCircle2 size={14} /> Mark Resolved
                  </button>
                )}

                <Link to={`/coordinator/cases/${task.publicId}`} className="btn btn-primary btn-sm">
                  <span>Inspect & Log Notes</span> <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

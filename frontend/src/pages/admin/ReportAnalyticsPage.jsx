import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { StatCard } from '../../components/dashboard/StatCard';
import { SeverityPieChart, CategoryBarChart } from '../../components/dashboard/AnalyticsChart';
import { Download, BarChart3, ShieldAlert, FileText, Clock } from 'lucide-react';

export const ReportAnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await reportService.getAnalyticsSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Incident Analytics & Export</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comprehensive reporting metrics aggregated from PostgreSQL records
          </p>
        </div>

        <a href={reportService.getCsvExportUrl()} download className="btn btn-cyan">
          <Download size={16} /> Export Complaints CSV
        </a>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Calculating database metrics...</div>
      ) : summary ? (
        <>
          <div className="grid-4">
            <StatCard title="Total Incidents" value={summary.totalIncidents} icon={FileText} color="var(--accent-cyan)" />
            <StatCard title="Under Investigation" value={summary.underInvestigation} icon={ShieldAlert} color="var(--accent-amber)" />
            <StatCard title="Total Resolved" value={summary.resolvedIncidents} icon={BarChart3} color="var(--accent-emerald)" />
            <StatCard title="Avg Resolution Time" value={`${summary.averageResolutionTimeHours} hrs`} icon={Clock} color="var(--accent-purple)" />
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '12px' }}>Threat Severity Breakdown</h3>
              <SeverityPieChart data={summary.severityBreakdown} />
            </div>

            <div className="card">
              <h3 className="card-title" style={{ marginBottom: '12px' }}>Incident Category Distribution</h3>
              <CategoryBarChart data={summary.categoryBreakdown} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { UserLayout } from '../layouts/UserLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { CoordinatorLayout } from '../layouts/CoordinatorLayout';
import { InvestigatorLayout } from '../layouts/InvestigatorLayout';

// Protected Route Guard
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { SafetyCenterPage } from '../pages/public/SafetyCenterPage';
import { ArticleDetailPage } from '../pages/public/ArticleDetailPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AuthCallbackPage } from '../pages/auth/AuthCallbackPage';

// User Pages
import { UserDashboardPage } from '../pages/user/UserDashboardPage';
import { MyComplaintsPage } from '../pages/user/MyComplaintsPage';
import { ComplaintDetailPage } from '../pages/user/ComplaintDetailPage';
import { ReportIncidentPage } from '../pages/user/ReportIncidentPage';
import { UrlAnalysisPage } from '../pages/user/UrlAnalysisPage';
import { ProfilePage } from '../pages/user/ProfilePage';

// Coordinator Pages
import { CoordinatorDashboardPage } from '../pages/coordinator/CoordinatorDashboardPage';
import { CoordinatorRecordsPage } from '../pages/coordinator/CoordinatorRecordsPage';
import { CoordinatorTasksPage } from '../pages/coordinator/CoordinatorTasksPage';

// Admin SOC & Cyber Intelligence Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ComplaintManagementPage } from '../pages/admin/ComplaintManagementPage';
import { AdminComplaintDetailPage } from '../pages/admin/AdminComplaintDetailPage';
import { InvestigatorManagementPage } from '../pages/admin/InvestigatorManagementPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { ReportAnalyticsPage } from '../pages/admin/ReportAnalyticsPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

// Advanced Cyber Intelligence Pages
import { ReconnaissancePage } from '../pages/admin/ReconnaissancePage';
import { AttackSurfacePage } from '../pages/admin/AttackSurfacePage';
import { AssetsPage } from '../pages/admin/AssetsPage';
import { VulnerabilitiesPage } from '../pages/admin/VulnerabilitiesPage';
import { ThreatIntelPage } from '../pages/admin/ThreatIntelPage';
import { NetworkTopologyPage } from '../pages/admin/NetworkTopologyPage';
import { TerminalPage } from '../pages/admin/TerminalPage';

// Investigator Pages (Backwards Compatibility)
import { InvestigatorDashboardPage } from '../pages/investigator/InvestigatorDashboardPage';
import { AssignedCasesPage } from '../pages/investigator/AssignedCasesPage';
import { CaseInvestigationPage } from '../pages/investigator/CaseInvestigationPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/safety" element={<SafetyCenterPage />} />
        <Route path="/safety/:slug" element={<ArticleDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Route>

      {/* Normal User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_COORDINATOR', 'ROLE_INVESTIGATOR', 'ROLE_ADMIN']} />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/complaints" element={<MyComplaintsPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="/report" element={<ReportIncidentPage />} />
          <Route path="/threat-analysis" element={<UrlAnalysisPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Coordinator Console Routes (Strictly for Coordinator & Investigator) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_COORDINATOR', 'ROLE_INVESTIGATOR']} />}>
        <Route element={<CoordinatorLayout />}>
          <Route path="/coordinator" element={<CoordinatorDashboardPage />} />
          <Route path="/coordinator/records" element={<CoordinatorRecordsPage />} />
          <Route path="/coordinator/tasks" element={<CoordinatorTasksPage filterType="PENDING" />} />
          <Route path="/coordinator/completed" element={<CoordinatorTasksPage filterType="COMPLETED" />} />
          <Route path="/coordinator/cases/:id" element={<CaseInvestigationPage />} />
          <Route path="/coordinator/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin SOC Routes (Strictly Restricted to ROLE_ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/coordinators" element={<InvestigatorManagementPage />} />
          <Route path="/admin/investigators" element={<InvestigatorManagementPage />} />
          <Route path="/admin/complaints" element={<ComplaintManagementPage />} />
          <Route path="/admin/complaints/:id" element={<AdminComplaintDetailPage />} />
          <Route path="/admin/reports" element={<ReportAnalyticsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/reconnaissance" element={<ReconnaissancePage />} />
          <Route path="/attack-surface" element={<AttackSurfacePage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
          <Route path="/threat-intel" element={<ThreatIntelPage />} />
          <Route path="/network-topology" element={<NetworkTopologyPage />} />
          <Route path="/terminal" element={<TerminalPage />} />
        </Route>
      </Route>

      {/* Backwards-compatible Investigator routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_INVESTIGATOR', 'ROLE_COORDINATOR', 'ROLE_ADMIN']} />}>
        <Route element={<InvestigatorLayout />}>
          <Route path="/investigator" element={<InvestigatorDashboardPage />} />
          <Route path="/investigator/cases" element={<AssignedCasesPage />} />
          <Route path="/investigator/cases/:id" element={<CaseInvestigationPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

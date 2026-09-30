import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';
import { CyberCursor } from './components/common/CyberCursor';
import { ScrollToTop } from './components/common/ScrollToTop';
import { CyberSecurityGuard } from './components/common/CyberSecurityGuard';
import './styles/global.css';

export function App() {
  return (
    <BrowserRouter>
      {/* Scroll restoration: always position new and navigated pages at the top */}
      <ScrollToTop />
      {/* Global Scary Cyber Predator Cursor */}
      <CyberCursor />
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            {/* Site-wide Fullscreen Enforcement, Anti-Copy, Anti-Paste, and Anti-Screenshot */}
            <CyberSecurityGuard>
              <AppRoutes />
            </CyberSecurityGuard>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

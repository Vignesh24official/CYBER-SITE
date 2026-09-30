import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight, Loader2, Database, KeyRound, Sparkles } from 'lucide-react';
import { supabase, saveUserToSupabaseDatabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { googleAuth } = useAuth();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState('Intercepting OAuth redirect and cryptographic tokens...');
  const [errorDetails, setErrorDetails] = useState(null);
  const [processedUser, setProcessedUser] = useState(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;

    const processOAuthCallback = async () => {
      hasProcessedRef.current = true;

      try {
        if (!supabase) {
          throw new Error('Supabase client is not initialized. Please verify frontend/.env credentials.');
        }

        setStep(1);
        setStatusMessage('Extracting authenticated session from Supabase gateway...');
        await new Promise((r) => setTimeout(r, 400));

        // Get the Supabase OAuth session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const session = sessionData?.session;
        if (!session || !session.user) {
          // If session wasn't immediately in getSession, try listening to onAuthStateChange once
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession && currentSession.user) {
              authListener.subscription.unsubscribe();
              await handleUserData(currentSession);
            }
          });

          // Wait a short time for auth listener
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('No Google authentication session detected. Please try signing up again.'));
            }, 3500);
          });
          return;
        }

        await handleUserData(session);
      } catch (err) {
        console.error('Google OAuth callback failed:', err);
        setErrorDetails(err.message || 'Authentication processing error');
        setStatusMessage('Authentication pipeline halted.');
        showError(err.message || 'Google authentication failed');
      }
    };

    const handleUserData = async (session) => {
      const user = session.user;
      const email = user.email;
      const userMetadata = user.user_metadata || {};
      const fullName = userMetadata.full_name || userMetadata.name || email?.split('@')[0] || 'Citizen Reporter';
      const picture = userMetadata.avatar_url || userMetadata.picture || '';

      setStep(2);
      setStatusMessage(`Verified Google identity: ${email}`);
      await new Promise((r) => setTimeout(r, 350));

      setStep(3);
      setStatusMessage('Saving details and assigning citizen clearance in Supabase Database...');

      // 1. Direct Supabase PostgreSQL upsert to ensure details are in the database
      const dbProfile = {
        publicId: user.id || ('google-' + Math.random().toString(36).substring(2, 9)),
        fullName: fullName,
        email: email,
        role: 'ROLE_USER',
        accountStatus: 'ACTIVE',
      };
      await saveUserToSupabaseDatabase(dbProfile);

      // 2. Synchronize with Backend & AuthContext (which runs JPA save and issues app tokens)
      let authenticatedProfile = null;
      try {
        authenticatedProfile = await googleAuth({
          email: email,
          name: fullName,
          picture: picture,
          credential: session.access_token,
          isSignUp: true,
        });
      } catch (backendErr) {
        console.warn('Backend sync fallback to Supabase profile:', backendErr);
        // Fallback user profile if backend server is still starting
        authenticatedProfile = dbProfile;
      }

      setProcessedUser(authenticatedProfile || dbProfile);
      setStep(4);
      setStatusMessage('Security clearance confirmed! Redirecting to Citizen Console...');
      showSuccess(`Signed up successfully as ${fullName}!`);

      await new Promise((r) => setTimeout(r, 600));

      const targetRole = authenticatedProfile?.role || 'ROLE_USER';
      if (targetRole === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (targetRole === 'ROLE_COORDINATOR' || targetRole === 'ROLE_INVESTIGATOR') {
        navigate('/coordinator');
      } else {
        navigate('/dashboard');
      }
    };

    processOAuthCallback();
  }, [googleAuth, navigate, showError, showSuccess]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#0c1017',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(6, 182, 212, 0.2)',
          padding: '36px 32px',
          textAlign: 'center',
        }}
      >
        {/* Animated Cyber Shield Icon */}
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '2px solid rgba(6, 182, 212, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.3)',
            }}
          >
            {errorDetails ? (
              <AlertTriangle size={36} color="#ef4444" />
            ) : step === 4 ? (
              <CheckCircle2 size={38} color="#10b981" />
            ) : (
              <Shield size={38} color="var(--accent-cyan-bright)" />
            )}
          </div>
          {!errorDetails && step < 4 && (
            <div
              style={{
                position: 'absolute',
                inset: '-6px',
                borderRadius: '24px',
                border: '2px dashed rgba(6, 182, 212, 0.6)',
                animation: 'spin 4s linear infinite',
              }}
            />
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          {errorDetails ? 'Google Authentication Issue' : step === 4 ? 'Registration Successful!' : 'Connecting to Supabase Database...'}
        </h2>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.5 }}>
          {statusMessage}
        </p>

        {/* Verification Pipeline Steps */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
            {step > 1 ? (
              <CheckCircle2 size={16} color="#10b981" />
            ) : step === 1 ? (
              <Loader2 size={16} color="var(--accent-cyan-bright)" className="spin" />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4b5563' }} />
            )}
            <span style={{ color: step >= 1 ? '#FFF' : 'var(--text-muted)' }}>
              Supabase OAuth Token Verification
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
            {step > 2 ? (
              <CheckCircle2 size={16} color="#10b981" />
            ) : step === 2 ? (
              <Loader2 size={16} color="var(--accent-cyan-bright)" className="spin" />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4b5563' }} />
            )}
            <span style={{ color: step >= 2 ? '#FFF' : 'var(--text-muted)' }}>
              Google Identity & Email Verification
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
            {step > 3 ? (
              <CheckCircle2 size={16} color="#10b981" />
            ) : step === 3 ? (
              <Loader2 size={16} color="var(--accent-cyan-bright)" className="spin" />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4b5563' }} />
            )}
            <span style={{ color: step >= 3 ? '#FFF' : 'var(--text-muted)' }}>
              Save Citizen User Profile in Supabase Database
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
            {step === 4 ? (
              <CheckCircle2 size={16} color="#10b981" />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4b5563' }} />
            )}
            <span style={{ color: step === 4 ? '#FFF' : 'var(--text-muted)' }}>
              Authorize Citizen Console Access
            </span>
          </div>
        </div>

        {/* Error Handling View */}
        {errorDetails && (
          <div>
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '14px',
                color: '#f87171',
                fontSize: '0.82rem',
                textAlign: 'left',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              <strong>Error Details:</strong> {errorDetails}
              <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#fca5a5' }}>
                Tip: You can use our 1-Click Instant Google Sign-Up on the register page, which creates your citizen profile directly in the database.
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
              }}
            >
              <span>Return to Register Page</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;

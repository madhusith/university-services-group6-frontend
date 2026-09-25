import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/common/Button';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { currentUser, switchRole, hasRole } = useAuth();

  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div
        className="card"
        style={{
          maxWidth: '520px',
          padding: '2.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--danger-50)',
            color: 'var(--danger-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--neutral-900)' }}>
          Access Restricted
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.6, margin: 0 }}>
          This administrative view is restricted to <strong>{allowedRoles.map(r => r.replace('_', ' ')).join(' or ')}</strong> roles. 
          Your current account is <strong>{currentUser.name}</strong> with role <strong>{currentUser.role}</strong>.
        </p>

        <div
          style={{
            marginTop: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            fontSize: '0.825rem',
            color: 'var(--neutral-500)'
          }}
        >
          Quickly switch to an authorized role using the button below or the top navigation bar to test this screen.
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button
            variant="primary"
            leftIcon={<UserCheck size={16} />}
            onClick={() => switchRole('FACILITY_MANAGER')}
          >
            Switch to Facility Manager
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

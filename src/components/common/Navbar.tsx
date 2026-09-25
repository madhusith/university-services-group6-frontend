import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { Building2, Bell, Shield, ChevronDown, Check, UserCheck, RefreshCw } from 'lucide-react';
import { resetToFactoryDefaults } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, availableUsers } = useAuth();
  const { info } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset all facilities, resources, and reservations to factory defaults?')) {
      resetToFactoryDefaults();
      info('Database Reset', 'Sample data restored to initial state.');
      window.location.reload();
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      case 'FACILITY_MANAGER':
        return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
      case 'FACULTY':
        return { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' };
      case 'STAFF':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'STUDENT':
      default:
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
    }
  };

  const badgeStyle = getRoleBadgeColor(currentUser.role);

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #1E40AF 0%, #0F766E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)'
          }}
        >
          <Building2 size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>
              UniServices
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-800)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid var(--primary-200)',
                letterSpacing: '0.04em'
              }}
            >
              GROUP 6
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', display: 'block' }}>
            Facilities, Resources & Reservation Management
          </span>
        </div>
      </div>

      {/* Right Tools & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Reset Database Button for Testing */}
        <button
          onClick={handleResetData}
          title="Reset sample data"
          className="btn-icon"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--neutral-500)' }}
        >
          <RefreshCw size={15} />
          <span style={{ display: 'inline-block' }}>Reset Data</span>
        </button>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--neutral-200)' }} />

        {/* Multi-role Switcher (USMG6-61 demonstration) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 0.75rem',
              backgroundColor: badgeStyle.bg,
              border: `1px solid ${badgeStyle.border}`,
              borderRadius: 'var(--radius-full)',
              color: badgeStyle.text,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Click to switch user role (USMG6-61 RBAC testing)"
          >
            <Shield size={14} />
            <span>ROLE: {currentUser.role.replace('_', ' ')}</span>
            <ChevronDown size={14} />
          </button>

          {isRoleDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '260px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-light)',
                padding: '0.5rem',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>
                  Switch Test Persona (RBAC)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--neutral-400)', marginTop: '2px' }}>
                  Simulates permissions for Sprint 4 USMG6-61
                </div>
              </div>

              {availableUsers.map((u) => {
                const isSelected = u.role === currentUser.role;
                return (
                  <button
                    key={u.role}
                    onClick={() => {
                      switchRole(u.role);
                      setIsRoleDropdownOpen(false);
                      info('Switched Role', `Now logged in as ${u.name} (${u.role.replace('_', ' ')})`);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : 'transparent',
                      color: isSelected ? 'var(--primary-800)' : 'var(--neutral-700)',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.role.replace('_', ' ')}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>{u.name}</div>
                    </div>
                    {isSelected && <Check size={16} color="var(--primary-800)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Current User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
              border: '2px solid #ffffff',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)', lineHeight: 1.2 }}>
              {currentUser.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--neutral-500)' }}>
              {currentUser.studentStaffId}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

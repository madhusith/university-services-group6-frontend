import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Search, 
  BookmarkCheck, 
  CalendarDays, 
  ClipboardCheck, 
  Lock,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, hasRole } = useAuth();
  const isManagerOrAdmin = hasRole(['FACILITY_MANAGER', 'ADMIN']);

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: null
    },
    {
      to: '/facilities',
      label: 'Facilities',
      icon: <Building2 size={19} />,
      badge: 'USMG6-122'
    },
    {
      to: '/resources',
      label: 'Resources',
      icon: <Layers size={19} />,
      badge: 'USMG6-123'
    },
    {
      to: '/availability',
      label: 'Availability Search',
      icon: <Search size={19} />,
      badge: 'USMG6-124'
    },
    {
      to: '/reservations',
      label: 'My Reservations',
      icon: <BookmarkCheck size={19} />,
      badge: 'USMG6-126'
    },
    {
      to: '/approvals',
      label: 'Approval Queue',
      icon: <ClipboardCheck size={19} />,
      badge: 'USMG6-127',
      isRestricted: !isManagerOrAdmin
    },
    {
      to: '/calendars',
      label: 'Reservation Calendars',
      icon: <CalendarDays size={19} />,
      badge: 'USMG6-54'
    }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        padding: '1.25rem 0.85rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0 0.75rem 0.5rem 0.75rem' }}>
          <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Main Navigation
          </span>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--primary-800)' : 'var(--neutral-600)',
              backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.15s ease'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {item.isRestricted && (
                <span title="Restricted to Managers & Admins (USMG6-61)">
                  <Lock size={13} color="var(--neutral-400)" />
                </span>
              )}
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '2px 5px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--neutral-100)',
                    color: 'var(--neutral-500)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </NavLink>
        ))}
      </div>

      {/* Collaboration Team Info Card */}
      <div
        className="card"
        style={{
          padding: '1rem',
          backgroundColor: 'var(--neutral-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
            Group 6 Sprint Portal
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--secondary-700)',
              backgroundColor: 'var(--secondary-100)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            Sprint 3 & 4
          </span>
        </div>
        <p style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', marginTop: '0.35rem', lineHeight: 1.4 }}>
          Shared frontend for University Services Facility & Resource Reservation system.
        </p>
      </div>
    </aside>
  );
};

import React from 'react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorVariant?: 'primary' | 'secondary' | 'warning' | 'danger';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorVariant = 'primary'
}) => {
  const iconBg = {
    primary: 'var(--primary-50)',
    secondary: 'var(--secondary-50)',
    warning: 'var(--warning-50)',
    danger: 'var(--danger-50)'
  }[colorVariant];

  const iconColor = {
    primary: 'var(--primary-800)',
    secondary: 'var(--secondary-700)',
    warning: 'var(--warning-700)',
    danger: 'var(--danger-700)'
  }[colorVariant];

  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neutral-900)', lineHeight: 1 }}>
          {value}
        </span>
        {trend && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: trend.isPositive ? 'var(--success-700)' : 'var(--danger-700)',
            backgroundColor: trend.isPositive ? 'var(--success-50)' : 'var(--danger-50)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)'
          }}>
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.8rem', color: 'var(--neutral-400)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};

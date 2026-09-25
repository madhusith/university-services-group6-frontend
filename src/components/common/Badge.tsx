import React from 'react';

export interface BadgeProps {
  variant?: 'active' | 'inactive' | 'maintenance' | 'available' | 'occupied' | 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, icon, className = '' }) => {
  return (
    <span className={`badge badge-${variant.toLowerCase()} ${className}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'secondary';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle size={28} color="var(--danger-500)" />;
      case 'warning':
        return <AlertTriangle size={28} color="var(--warning-500)" />;
      default:
        return <HelpCircle size={28} color="var(--primary-800)" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="480px"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'warning' ? 'primary' : variant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
        <p style={{ fontSize: '0.925rem', color: 'var(--neutral-600)', lineHeight: 1.6, margin: 0 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
};

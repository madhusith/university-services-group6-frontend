import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 3rem)',
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              borderLeft: `5px solid ${
                t.type === 'success' ? 'var(--success-500)' :
                t.type === 'error' ? 'var(--danger-500)' :
                t.type === 'warning' ? 'var(--warning-500)' : 'var(--tertiary-500)'
              }`,
              borderTop: '1px solid var(--border-light)',
              borderRight: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {t.type === 'success' && <CheckCircle2 size={18} color="var(--success-500)" />}
              {t.type === 'error' && <AlertCircle size={18} color="var(--danger-500)" />}
              {t.type === 'warning' && <AlertTriangle size={18} color="var(--warning-500)" />}
              {t.type === 'info' && <Info size={18} color="var(--tertiary-500)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--neutral-900)' }}>{t.title}</div>
              {t.message && <div style={{ fontSize: '0.8rem', color: 'var(--neutral-600)', marginTop: '2px' }}>{t.message}</div>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                color: 'var(--neutral-400)',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

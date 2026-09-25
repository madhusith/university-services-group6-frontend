import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Resource } from '../../../types/resource';
import { Building2, Users, Cpu, ShieldCheck, CalendarPlus, CheckCircle } from 'lucide-react';

interface ResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  onEdit?: (resource: Resource) => void;
  onReserve?: (resource: Resource) => void;
  canManage?: boolean;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  isOpen,
  onClose,
  resource,
  onEdit,
  onReserve,
  canManage = false
}) => {
  if (!resource) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.name}
      subtitle={`Code: ${resource.code} • Facility: ${resource.facilityName}`}
      maxWidth="580px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {canManage && onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(resource)}>
                Edit Resource
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {onReserve && resource.status === 'AVAILABLE' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CalendarPlus size={15} />}
                onClick={() => onReserve(resource)}
              >
                Book Resource
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Banner with image and badges */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <img
            src={resource.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80'}
            alt={resource.name}
            style={{
              width: '160px',
              height: '110px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant={resource.status.toLowerCase() as any}>
                {resource.status}
              </Badge>
              <Badge variant="primary">
                {resource.type}
              </Badge>
              {resource.requiresApproval ? (
                <Badge variant="pending" icon={<ShieldCheck size={12} />}>
                  Manager Approval Required
                </Badge>
              ) : (
                <Badge variant="available">
                  Instant Confirmation
                </Badge>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--neutral-600)', margin: 0, lineHeight: 1.5 }}>
              {resource.description || 'No specific description provided for this resource.'}
            </p>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid-3" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Building2 size={18} color="var(--primary-800)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Facility</div>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resource.facilityName}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={18} color="var(--secondary-700)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Capacity</div>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resource.capacity} Pax (Qty: {resource.quantity})</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Cpu size={18} color="var(--tertiary-500)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Category</div>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resource.type}</div>
            </div>
          </div>
        </div>

        {/* Specifications List */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)', marginBottom: '0.5rem' }}>
            Technical Specifications & Equipment Installed
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {resource.specs.map((spec, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '4px 10px',
                  backgroundColor: 'var(--secondary-50)',
                  border: '1px solid var(--secondary-100)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.775rem',
                  color: 'var(--secondary-700)',
                  fontWeight: 500
                }}
              >
                <CheckCircle size={13} color="var(--secondary-700)" />
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

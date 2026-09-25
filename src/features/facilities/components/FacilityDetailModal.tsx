import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Facility } from '../../../types/facility';
import { Resource } from '../../../types/resource';
import { MapPin, Users, Clock, Mail, Phone, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FacilityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: Facility | null;
  resources: Resource[];
  onEdit?: (facility: Facility) => void;
  onToggleStatus?: (facility: Facility) => void;
  canManage?: boolean;
}

export const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  isOpen,
  onClose,
  facility,
  resources,
  onEdit,
  onToggleStatus,
  canManage = false
}) => {
  if (!facility) return null;

  const facilityResources = resources.filter(r => r.facilityId === facility.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={facility.name}
      subtitle={`Code: ${facility.code} • Building: ${facility.building}`}
      maxWidth="660px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {canManage && onToggleStatus && (
              <Button
                variant={facility.status === 'ACTIVE' ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => onToggleStatus(facility)}
              >
                {facility.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {canManage && onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(facility)}>
                Edit Facility
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Banner and Badges */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <img
            src={facility.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'}
            alt={facility.name}
            style={{
              width: '180px',
              height: '120px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant={facility.status.toLowerCase() as any}>
                {facility.status}
              </Badge>
              <Badge variant="primary">
                {facility.category}
              </Badge>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', lineHeight: 1.5, margin: 0 }}>
              {facility.description}
            </p>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid-3" style={{ padding: '1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MapPin size={18} color="var(--primary-800)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{facility.location} ({facility.floor})</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={18} color="var(--secondary-700)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Capacity</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>Up to {facility.capacity} Persons</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={18} color="var(--tertiary-500)" />
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Hours</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>
                {facility.operatingHours.open} - {facility.operatingHours.close}
              </div>
            </div>
          </div>
        </div>

        {/* Contact info & Operating Days */}
        <div className="grid-2">
          <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.5rem' }}>
              Facility Management Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--neutral-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} color="var(--neutral-400)" />
                <a href={`mailto:${facility.contactEmail}`}>{facility.contactEmail}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--neutral-400)" />
                <span>{facility.contactPhone}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.5rem' }}>
              Active Operating Days
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {facility.operatingHours.days.map((day, i) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '2px 6px', backgroundColor: 'var(--neutral-100)', borderRadius: '4px', color: 'var(--neutral-700)' }}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)', marginBottom: '0.5rem' }}>
            Facility Amenities & Provisions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {facility.amenities.map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 10px',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  color: 'var(--primary-800)',
                  fontWeight: 500
                }}
              >
                <CheckCircle2 size={13} color="var(--primary-800)" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Linked Resources */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)' }}>
              Associated Resources & Rooms ({facilityResources.length})
            </span>
          </div>

          {facilityResources.length === 0 ? (
            <div style={{ padding: '1.25rem', textAlign: 'center', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
              No individual bookable resources assigned to this facility yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {facilityResources.map(res => (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neutral-900)' }}>
                      {res.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                      Code: {res.code} • Type: {res.type} • Capacity: {res.capacity} pax
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {res.requiresApproval && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--warning-700)', backgroundColor: 'var(--warning-50)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Approval Req.
                      </span>
                    )}
                    <Badge variant={res.status.toLowerCase() as any}>
                      {res.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Reservation } from '../../../types/reservation';
import { Calendar, Clock, MapPin, Users, User, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onCancel?: (reservation: Reservation) => void;
  canCancel?: boolean;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onCancel,
  canCancel = false
}) => {
  if (!reservation) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservation ${reservation.reservationNumber}`}
      subtitle={`${reservation.resourceName} • ${reservation.facilityName}`}
      maxWidth="580px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            {canCancel && (reservation.status === 'CONFIRMED' || reservation.status === 'PENDING') && onCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancel(reservation)}
              >
                Cancel Reservation
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Status Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Booking Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--neutral-900)', marginTop: '2px' }}>
              {reservation.purpose}
            </div>
          </div>
          <Badge variant={reservation.status.toLowerCase() as any}>
            {reservation.status}
          </Badge>
        </div>

        {/* Schedule & Location */}
        <div className="grid-3" style={{ padding: '0.85rem 1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={18} color="var(--primary-800)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Date</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{reservation.date}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={18} color="var(--secondary-700)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Time Slot</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{reservation.startTime} - {reservation.endTime}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={18} color="var(--tertiary-500)" />
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Attendees</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{reservation.attendeesCount} Persons</div>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div style={{ padding: '0.85rem 1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.4rem' }}>
            Requester Details
          </div>
          <div className="grid-2" style={{ fontSize: '0.825rem', color: 'var(--neutral-600)' }}>
            <div>Name: <strong>{reservation.userName}</strong> ({reservation.userRole})</div>
            <div>Email: <a href={`mailto:${reservation.userEmail}`}>{reservation.userEmail}</a></div>
            <div>Department: <strong>{reservation.department}</strong></div>
            <div>Submitted On: {new Date(reservation.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Special Requirements / Notes */}
        {reservation.notes && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.35rem' }}>
              Special Notes / Requirements
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {reservation.notes}
            </p>
          </div>
        )}

        {/* Rejection / Cancellation alerts */}
        {reservation.status === 'REJECTED' && reservation.rejectionReason && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--danger-50)', border: '1px solid var(--danger-100)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger-700)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={15} />
              Rejection Reason (Reviewed by {reservation.reviewedBy || 'Facility Manager'})
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--danger-700)', margin: '0.25rem 0 0 0' }}>
              {reservation.rejectionReason}
            </p>
          </div>
        )}

        {reservation.status === 'CANCELLED' && reservation.cancellationReason && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-100)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
              Cancellation Reason
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', margin: '0.25rem 0 0 0' }}>
              {reservation.cancellationReason}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

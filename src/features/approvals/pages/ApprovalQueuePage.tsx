import React, { useState, useEffect, useCallback } from 'react';
import { Reservation } from '../../../types/reservation';
import { reservationService } from '../../../services/reservationService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { 
  ClipboardCheck, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  User, 
  ShieldAlert, 
  MessageSquare, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ApprovalQueuePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Approve dialog
  const [reservationToApprove, setReservationToApprove] = useState<Reservation | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  // Reject dialog
  const [reservationToReject, setReservationToReject] = useState<Reservation | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const loadPending = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reservationService.getPendingApprovals();
      setPendingReservations(data);
    } catch (err: any) {
      error('Failed to Load Approvals', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleApprove = async () => {
    if (!reservationToApprove) return;
    try {
      setIsApproving(true);
      await reservationService.approveReservation(
        reservationToApprove.id,
        currentUser.name,
        approvalNote
      );
      success(
        'Reservation Approved!',
        `Booking ${reservationToApprove.reservationNumber} for ${reservationToApprove.userName} is now confirmed.`
      );
      setReservationToApprove(null);
      setApprovalNote('');
      await loadPending();
    } catch (err: any) {
      error('Approval Failed', err.message);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!reservationToReject) return;
    if (!rejectionReason.trim()) {
      setRejectionError('A rejection reason is required so the requestor understands why.');
      return;
    }
    try {
      setIsRejecting(true);
      await reservationService.rejectReservation(
        reservationToReject.id,
        rejectionReason,
        currentUser.name
      );
      success(
        'Reservation Rejected',
        `Booking ${reservationToReject.reservationNumber} has been rejected.`
      );
      setReservationToReject(null);
      setRejectionReason('');
      setRejectionError('');
      await loadPending();
    } catch (err: any) {
      error('Rejection Failed', err.message);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>Approval & Cancellation Queue</h1>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '4px' }}>
            USMG6-127
          </span>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
          Review high-priority facility reservation requests requiring approval from the facility management office.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Loading pending queue...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pendingReservations.length === 0 && (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={48} color="var(--success-500)" />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--neutral-800)' }}>No Pending Approvals!</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', maxWidth: '420px', margin: 0 }}>
            All reservation requests have been processed. You have zero pending requests waiting in your queue.
          </p>
        </div>
      )}

      {/* Pending Items List */}
      {!isLoading && pendingReservations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingReservations.map((resv) => (
            <div
              key={resv.id}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: '4px solid var(--warning-500)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                    {resv.reservationNumber}
                  </span>
                  <Badge variant="pending">
                    Awaiting Review
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>
                    • Submitted on {new Date(resv.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<X size={15} color="var(--danger-500)" />}
                    onClick={() => {
                      setReservationToReject(resv);
                      setRejectionReason('');
                      setRejectionError('');
                    }}
                    style={{ color: 'var(--danger-700)', borderColor: 'var(--danger-200)' }}
                  >
                    Reject Request
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Check size={15} />}
                    onClick={() => {
                      setReservationToApprove(resv);
                      setApprovalNote('');
                    }}
                  >
                    Approve Reservation
                  </Button>
                </div>
              </div>

              {/* Event Purpose Title */}
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--neutral-900)', margin: '0 0 0.25rem 0' }}>
                  {resv.purpose}
                </h3>
              </div>

              {/* Info Matrix */}
              <div className="grid-3" style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Building2 size={18} color="var(--primary-800)" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Facility & Resource</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resv.resourceName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{resv.facilityName}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Calendar size={18} color="var(--secondary-700)" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Schedule Window</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resv.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{resv.startTime} to {resv.endTime}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <User size={18} color="var(--tertiary-500)" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Requestor</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-800)' }}>{resv.userName} ({resv.userRole})</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{resv.department} • {resv.attendeesCount} pax</div>
                  </div>
                </div>
              </div>

              {/* Special Notes from Requestor */}
              {resv.notes && (
                <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <MessageSquare size={16} color="var(--neutral-400)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Requestor's Special Instructions:</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--neutral-600)', marginTop: '2px' }}>{resv.notes}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approve Dialog */}
      <Modal
        isOpen={!!reservationToApprove}
        onClose={() => setReservationToApprove(null)}
        title="Approve Reservation Request"
        subtitle={`Booking ${reservationToApprove?.reservationNumber} • ${reservationToApprove?.resourceName}`}
        maxWidth="520px"
        footer={
          <>
            <Button variant="outline" onClick={() => setReservationToApprove(null)} disabled={isApproving}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleApprove} isLoading={isApproving}>
              Confirm Approval
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', margin: 0 }}>
            Approving this request will confirm the reservation and block out this slot on the master university calendar.
          </p>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Reviewer Note / Special Guidelines (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Approved. Keys to be collected from North Gate security kiosk 15 minutes before session."
              value={approvalNote}
              onChange={e => setApprovalNote(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </Modal>

      {/* Reject Dialog */}
      <Modal
        isOpen={!!reservationToReject}
        onClose={() => setReservationToReject(null)}
        title="Reject Reservation Request"
        subtitle={`Booking ${reservationToReject?.reservationNumber} • ${reservationToReject?.userName}`}
        maxWidth="520px"
        footer={
          <>
            <Button variant="outline" onClick={() => setReservationToReject(null)} disabled={isRejecting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={isRejecting}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', margin: 0 }}>
            Please state the formal reason for rejecting this booking request. This note will be recorded in the reservation record.
          </p>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Reason for Rejection <span className="required">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Clashes with scheduled facility routine electrical maintenance / Ineligible for undergraduate research group without faculty supervisor signature..."
              value={rejectionReason}
              onChange={e => {
                setRejectionReason(e.target.value);
                if (rejectionError) setRejectionError('');
              }}
              className={`form-control ${rejectionError ? 'is-invalid' : ''}`}
            />
            {rejectionError && <div className="invalid-feedback">{rejectionError}</div>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

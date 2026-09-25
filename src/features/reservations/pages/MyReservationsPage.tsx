import React, { useState, useEffect, useCallback } from 'react';
import { Reservation } from '../../../types/reservation';
import { reservationService } from '../../../services/reservationService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { ReservationDetailModal } from '../components/ReservationDetailModal';
import { ReservationFormModal } from '../components/ReservationFormModal';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { 
  BookmarkCheck, 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Building2, 
  Users, 
  Eye, 
  XCircle, 
  Loader2,
  CalendarCheck2
} from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const { currentUser, hasRole } = useAuth();
  const { success, error } = useToast();
  const isManagerOrAdmin = hasRole(['FACILITY_MANAGER', 'ADMIN']);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      // If manager or admin, can see all reservations, or filter by user
      const data = await reservationService.getAllReservations(
        isManagerOrAdmin ? undefined : { userId: currentUser.id }
      );
      setReservations(data);
    } catch (err: any) {
      error('Failed to Load Reservations', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id, isManagerOrAdmin, error]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;
    try {
      setIsCancelling(true);
      await reservationService.cancelReservation(reservationToCancel.id, 'Cancelled by user request.');
      success('Reservation Cancelled', `Booking ${reservationToCancel.reservationNumber} has been cancelled.`);
      setIsCancelModalOpen(false);
      setReservationToCancel(null);
      if (selectedReservation?.id === reservationToCancel.id) {
        setSelectedReservation(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
      }
      await loadReservations();
    } catch (err: any) {
      error('Cancellation Failed', err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Tab filtering
  const filteredList = reservations.filter(r => {
    if (activeTab === 'UPCOMING') {
      return (r.status === 'CONFIRMED' || r.status === 'PENDING') && r.date >= todayStr;
    }
    if (activeTab === 'PENDING') {
      return r.status === 'PENDING';
    }
    if (activeTab === 'CONFIRMED') {
      return r.status === 'CONFIRMED';
    }
    if (activeTab === 'CANCELLED') {
      return r.status === 'CANCELLED' || r.status === 'REJECTED';
    }
    return true;
  }).filter(r => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.reservationNumber.toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q) ||
      r.resourceName.toLowerCase().includes(q) ||
      r.facilityName.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>
              {isManagerOrAdmin ? 'All Campus Reservations' : 'My Reservations'}
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
            {isManagerOrAdmin
              ? 'Comprehensive log of all facility bookings and student/staff reservation requests.'
              : `Tracking active, confirmed, and pending requests for ${currentUser.name}.`}
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => setIsFormOpen(true)}
        >
          New Reservation
        </Button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'PENDING', label: 'Pending Approval' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'CANCELLED', label: 'Cancelled / Rejected' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                fontWeight: 600,
                backgroundColor: activeTab === tab.id ? 'var(--primary-800)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--neutral-600)',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '240px' }}>
          <Search size={16} color="var(--neutral-400)" />
          <input
            type="text"
            placeholder="Search booking ID, event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ padding: '0.4rem 0.5rem', fontSize: '0.825rem' }}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Loading reservations...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredList.length === 0 && (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <BookmarkCheck size={48} color="var(--neutral-300)" />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--neutral-800)' }}>No Reservations Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', maxWidth: '420px', margin: 0 }}>
            {searchTerm || activeTab !== 'ALL'
              ? 'No bookings match your selected tab or search query.'
              : 'You do not have any active or past reservations.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            style={{ marginTop: '0.5rem' }}
            onClick={() => setIsFormOpen(true)}
          >
            Create Reservation
          </Button>
        </div>
      )}

      {/* Reservations List */}
      {!isLoading && filteredList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredList.map((resv) => (
            <div
              key={resv.id}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: '300px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <CalendarCheck2 size={24} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)', letterSpacing: '0.04em' }}>
                      {resv.reservationNumber}
                    </span>
                    <Badge variant={resv.status.toLowerCase() as any}>
                      {resv.status}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', margin: '0.2rem 0', color: 'var(--neutral-900)' }}>
                    {resv.purpose}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={14} color="var(--neutral-400)" />
                      <span>{resv.resourceName} ({resv.facilityName})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} color="var(--neutral-400)" />
                      <span>{resv.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} color="var(--neutral-400)" />
                      <span>{resv.startTime} - {resv.endTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={14} color="var(--neutral-400)" />
                      <span>{resv.attendeesCount} pax</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye size={14} />}
                  onClick={() => {
                    setSelectedReservation(resv);
                    setIsDetailOpen(true);
                  }}
                >
                  View Details
                </Button>

                {(resv.status === 'CONFIRMED' || resv.status === 'PENDING') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReservationToCancel(resv);
                      setIsCancelModalOpen(true);
                    }}
                    style={{ color: 'var(--danger-700)', borderColor: 'var(--danger-100)' }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ReservationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={loadReservations}
      />

      {/* Detail Modal */}
      <ReservationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        canCancel={true}
        onCancel={(resv) => {
          setIsDetailOpen(false);
          setReservationToCancel(resv);
          setIsCancelModalOpen(true);
        }}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setReservationToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        variant="danger"
        title="Cancel Reservation"
        message={`Are you sure you want to cancel booking "${reservationToCancel?.reservationNumber}" (${reservationToCancel?.purpose})? This time slot will be released back to the university schedule.`}
        confirmLabel="Confirm Cancellation"
        isLoading={isCancelling}
      />
    </div>
  );
};

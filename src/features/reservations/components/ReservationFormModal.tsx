import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Resource } from '../../../types/resource';
import { Facility } from '../../../types/facility';
import { CreateReservationInput } from '../../../types/reservation';
import { reservationService } from '../../../services/reservationService';
import { resourceService } from '../../../services/resourceService';
import { facilityService } from '../../../services/facilityService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Calendar, Clock, Users, ShieldAlert, CheckCircle } from 'lucide-react';

interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedResource?: Resource | null;
  preselectedDate?: string;
  preselectedStartTime?: string;
  preselectedEndTime?: string;
  onSuccess?: () => void;
}

export const ReservationFormModal: React.FC<ReservationFormModalProps> = ({
  isOpen,
  onClose,
  preselectedResource,
  preselectedDate,
  preselectedStartTime,
  preselectedEndTime,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [resources, setResources] = useState<Resource[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(10);
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        setIsLoadingMeta(true);
        try {
          const [facs, ress] = await Promise.all([
            facilityService.getAllFacilities(),
            resourceService.getAllResources({ status: 'AVAILABLE' })
          ]);
          setFacilities(facs);
          setResources(ress);

          if (preselectedResource) {
            setSelectedFacilityId(preselectedResource.facilityId);
            setSelectedResourceId(preselectedResource.id);
          } else if (ress.length > 0) {
            setSelectedFacilityId(ress[0].facilityId);
            setSelectedResourceId(ress[0].id);
          }

          if (preselectedDate) setDate(preselectedDate);
          if (preselectedStartTime) setStartTime(preselectedStartTime);
          if (preselectedEndTime) setEndTime(preselectedEndTime);
          setPurpose('');
          setNotes('');
          setFormErrors({});
        } catch (err: any) {
          console.error(err);
        } finally {
          setIsLoadingMeta(false);
        }
      };
      loadOptions();
    }
  }, [isOpen, preselectedResource, preselectedDate, preselectedStartTime, preselectedEndTime]);

  const activeResource = resources.find(r => r.id === selectedResourceId);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!selectedResourceId) {
      errs.resource = 'Please select a resource to reserve';
    }

    if (!date) {
      errs.date = 'Reservation date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (date < today) {
        errs.date = 'Cannot reserve dates in the past';
      }
    }

    if (!startTime || !endTime) {
      errs.time = 'Both start and end time are required';
    } else if (startTime >= endTime) {
      errs.time = 'End time must be later than start time';
    }

    if (!purpose.trim()) {
      errs.purpose = 'Purpose of reservation is required';
    } else if (purpose.trim().length < 5) {
      errs.purpose = 'Please provide a clear description (at least 5 characters)';
    }

    if (!attendeesCount || attendeesCount <= 0) {
      errs.attendees = 'Attendee count must be at least 1';
    } else if (activeResource && activeResource.capacity > 0 && attendeesCount > activeResource.capacity) {
      errs.attendees = `Attendees (${attendeesCount}) exceed resource capacity (${activeResource.capacity})`;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !activeResource) return;

    try {
      setIsSubmitting(true);
      const input: CreateReservationInput = {
        resourceId: activeResource.id,
        facilityId: activeResource.facilityId,
        purpose,
        attendeesCount,
        date,
        startTime,
        endTime,
        notes
      };

      const result = await reservationService.createReservation(input, {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        department: currentUser.department
      });

      if (result.status === 'CONFIRMED') {
        success('Reservation Confirmed!', `Booking ${result.reservationNumber} has been automatically confirmed.`);
      } else {
        success('Request Submitted for Approval', `Booking ${result.reservationNumber} is pending Facility Manager review.`);
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      error('Reservation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter available resources by facility
  const filteredResources = selectedFacilityId 
    ? resources.filter(r => r.facilityId === selectedFacilityId)
    : resources;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Reservation Request"
      subtitle="Book university lab facilities, seminar halls, and equipment (USMG6-126)"
      maxWidth="680px"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Reservation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* User Card */}
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>Requesting Persona</span>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neutral-900)' }}>{currentUser.name} ({currentUser.role.replace('_', ' ')})</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{currentUser.department} • {currentUser.email}</div>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', fontWeight: 600 }}>
            {currentUser.studentStaffId}
          </span>
        </div>

        {/* Facility & Resource Selection */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Filter by Facility</label>
            <select
              value={selectedFacilityId}
              onChange={(e) => {
                setSelectedFacilityId(e.target.value);
                const nextRes = resources.find(r => r.facilityId === e.target.value);
                if (nextRes) setSelectedResourceId(nextRes.id);
              }}
              className="form-control"
              disabled={!!preselectedResource}
            >
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Select Bookable Resource <span className="required">*</span>
            </label>
            <select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
              className={`form-control ${formErrors.resource ? 'is-invalid' : ''}`}
              disabled={!!preselectedResource}
            >
              <option value="">Select Resource...</option>
              {filteredResources.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} (Cap: {r.capacity})
                </option>
              ))}
            </select>
            {formErrors.resource && <div className="invalid-feedback">{formErrors.resource}</div>}
          </div>
        </div>

        {/* Resource info callout */}
        {activeResource && (
          <div style={{ padding: '0.75rem 1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success-500)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-900)' }}>{activeResource.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginLeft: '8px' }}>Type: {activeResource.type} • Max Capacity: {activeResource.capacity}</span>
              </div>
            </div>
            {activeResource.requiresApproval ? (
              <span style={{ fontSize: '0.725rem', color: 'var(--warning-700)', backgroundColor: 'var(--warning-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={12} />
                Requires Approval
              </span>
            ) : (
              <span style={{ fontSize: '0.725rem', color: 'var(--success-700)', backgroundColor: 'var(--success-50)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} />
                Instant Confirm
              </span>
            )}
          </div>
        )}

        {/* Date and Time */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
            />
            {formErrors.date && <div className="invalid-feedback">{formErrors.date}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Start Time <span className="required">*</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              End Time <span className="required">*</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
            />
          </div>
        </div>
        {formErrors.time && <div className="invalid-feedback" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>{formErrors.time}</div>}

        {/* Purpose and Attendee Count */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              Attendees Count <span className="required">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={attendeesCount}
              onChange={e => setAttendeesCount(parseInt(e.target.value) || 1)}
              className={`form-control ${formErrors.attendees ? 'is-invalid' : ''}`}
            />
            {formErrors.attendees && <div className="invalid-feedback">{formErrors.attendees}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Purpose / Event Title <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Project Sprint Meeting / Final Year Demo"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className={`form-control ${formErrors.purpose ? 'is-invalid' : ''}`}
            />
            {formErrors.purpose && <div className="invalid-feedback">{formErrors.purpose}</div>}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Special Equipment or Setup Requirements</label>
          <textarea
            rows={2}
            placeholder="e.g. Need podium microphone, 2 spare power strips, and HDMI connection..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="form-control"
          />
        </div>
      </form>
    </Modal>
  );
};

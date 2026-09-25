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
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

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
        }
      };
      loadOptions();
    }
  }, [isOpen, preselectedResource, preselectedDate, preselectedStartTime, preselectedEndTime]);

  const activeResource = resources.find(r => r.id === selectedResourceId);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!selectedResourceId) {
      errs.resource = 'Please select a resource';
    }

    if (!date) {
      errs.date = 'Date is required';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (date < today) {
        errs.date = 'Cannot reserve past dates';
      }
    }

    if (!startTime || !endTime) {
      errs.time = 'Start and end times are required';
    } else if (startTime >= endTime) {
      errs.time = 'End time must be after start time';
    }

    if (!purpose.trim()) {
      errs.purpose = 'Purpose is required';
    } else if (purpose.trim().length < 3) {
      errs.purpose = 'Please provide a valid purpose';
    }

    if (!attendeesCount || attendeesCount <= 0) {
      errs.attendees = 'Attendees must be at least 1';
    } else if (activeResource && activeResource.capacity > 0 && attendeesCount > activeResource.capacity) {
      errs.attendees = `Capacity limit is ${activeResource.capacity} persons`;
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
        purpose: purpose.trim(),
        attendeesCount,
        date,
        startTime,
        endTime,
        notes: notes.trim()
      };

      const result = await reservationService.createReservation(input, {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        department: currentUser.department
      });

      if (result.status === 'CONFIRMED') {
        success('Reservation Confirmed', `Booking ${result.reservationNumber} is confirmed.`);
      } else {
        success('Submitted for Approval', `Booking ${result.reservationNumber} is pending review.`);
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      error('Reservation Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResources = selectedFacilityId 
    ? resources.filter(r => r.facilityId === selectedFacilityId)
    : resources;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation"
      subtitle={`Booking as ${currentUser.name} (${currentUser.role.replace('_', ' ')})`}
      maxWidth="560px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Confirm Reservation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Facility & Resource Selection */}
        <div className="grid-2">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Facility</label>
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

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">
                Resource <span className="required">*</span>
              </label>
              {activeResource && (
                <span style={{ fontSize: '0.7rem', color: activeResource.requiresApproval ? 'var(--warning-700)' : 'var(--success-700)', fontWeight: 600 }}>
                  {activeResource.requiresApproval ? 'Needs Approval' : 'Instant Book'}
                </span>
              )}
            </div>
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

        {/* Date, Start Time, End Time */}
        <div className="grid-3">
          <div className="form-group" style={{ margin: 0 }}>
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

          <div className="form-group" style={{ margin: 0 }}>
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

          <div className="form-group" style={{ margin: 0 }}>
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
        {formErrors.time && <div className="invalid-feedback" style={{ marginTop: '-0.4rem' }}>{formErrors.time}</div>}

        {/* Attendees & Purpose */}
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.85rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Attendees <span className="required">*</span>
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

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Purpose / Title <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Project Review, Workshop, Lecture"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className={`form-control ${formErrors.purpose ? 'is-invalid' : ''}`}
            />
            {formErrors.purpose && <div className="invalid-feedback">{formErrors.purpose}</div>}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Special Requirements (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Projector connection, podium mic..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="form-control"
          />
        </div>
      </form>
    </Modal>
  );
};

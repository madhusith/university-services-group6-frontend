import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Facility, CreateFacilityInput, FacilityStatus } from '../../../types/facility';
import { Plus, Trash2 } from 'lucide-react';

interface FacilityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFacilityInput) => Promise<void>;
  initialData?: Facility | null;
  isLoading?: boolean;
}

export const FacilityFormModal: React.FC<FacilityFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<CreateFacilityInput>({
    code: '',
    name: '',
    category: 'LABORATORY',
    building: '',
    floor: '',
    location: '',
    capacity: 50,
    description: '',
    status: 'ACTIVE',
    operatingHours: {
      open: '08:00',
      close: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    contactEmail: '',
    contactPhone: '',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Projector'],
    imageUrl: ''
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        category: initialData.category,
        building: initialData.building,
        floor: initialData.floor,
        location: initialData.location,
        capacity: initialData.capacity,
        description: initialData.description,
        status: initialData.status,
        operatingHours: { ...initialData.operatingHours },
        contactEmail: initialData.contactEmail,
        contactPhone: initialData.contactPhone,
        amenities: [...initialData.amenities],
        imageUrl: initialData.imageUrl || ''
      });
      setErrors({});
    } else {
      setFormData({
        code: '',
        name: '',
        category: 'LABORATORY',
        building: '',
        floor: '',
        location: '',
        capacity: 50,
        description: '',
        status: 'ACTIVE',
        operatingHours: {
          open: '08:00',
          close: '20:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        },
        contactEmail: '',
        contactPhone: '',
        amenities: ['Wi-Fi', 'Air Conditioning', 'Projector'],
        imageUrl: ''
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Validation according to acceptance criteria
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.code.trim()) {
      errs.code = 'Facility code is required (e.g. ENG-BLD-01)';
    } else if (formData.code.trim().length < 3) {
      errs.code = 'Facility code must be at least 3 characters';
    }

    if (!formData.name.trim()) {
      errs.name = 'Facility name is required';
    }

    if (!formData.building.trim()) {
      errs.building = 'Building name is required';
    }

    if (!formData.location.trim()) {
      errs.location = 'Campus location is required';
    }

    if (!formData.capacity || formData.capacity <= 0) {
      errs.capacity = 'Capacity must be greater than 0';
    }

    if (!formData.contactEmail.trim()) {
      errs.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errs.contactEmail = 'Enter a valid email address';
    }

    if (!formData.operatingHours.open || !formData.operatingHours.close) {
      errs.operatingHours = 'Both opening and closing hours must be set';
    } else if (formData.operatingHours.open >= formData.operatingHours.close) {
      errs.operatingHours = 'Closing time must be after opening time';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== indexToRemove)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Facility: ${initialData.name}` : 'Create New Facility'}
      subtitle={isEditing ? 'Update facility parameters and specifications' : 'Register a new university facility'}
      maxWidth="640px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Facility'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Facility Code */}
          <div className="form-group">
            <label className="form-label">
              Facility Code <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ENG-LAB-01"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className={`form-control ${errors.code ? 'is-invalid' : ''}`}
              disabled={isEditing} // Code immutable after creation for reference integrity
            />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>

          {/* Facility Name */}
          <div className="form-group">
            <label className="form-label">
              Facility Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Robotics Innovation Complex"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>

        <div className="grid-3">
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Facility['category'] })}
              className="form-control"
            >
              <option value="LABORATORY">Laboratory</option>
              <option value="ACADEMIC">Academic Building</option>
              <option value="AUDITORIUM">Auditorium</option>
              <option value="LIBRARY">Library / Commons</option>
              <option value="SPORTS">Sports Complex</option>
              <option value="STUDENT_CENTER">Student Center</option>
            </select>
          </div>

          {/* Building */}
          <div className="form-group">
            <label className="form-label">
              Building <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. West Wing Block B"
              value={formData.building}
              onChange={e => setFormData({ ...formData, building: e.target.value })}
              className={`form-control ${errors.building ? 'is-invalid' : ''}`}
            />
            {errors.building && <div className="invalid-feedback">{errors.building}</div>}
          </div>

          {/* Floor */}
          <div className="form-group">
            <label className="form-label">Floor / Level</label>
            <input
              type="text"
              placeholder="e.g. 2nd Floor"
              value={formData.floor}
              onChange={e => setFormData({ ...formData, floor: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        <div className="grid-2">
          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              Campus Location <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. North Campus, Engineering Quad"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          {/* Capacity */}
          <div className="form-group">
            <label className="form-label">
              Total Capacity (Persons) <span className="required">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
            />
            {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
          </div>
        </div>

        {/* Operating Hours */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Operating Hours & Access
          </label>
          <div className="grid-2">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginBottom: '4px', display: 'block' }}>Opening Time</span>
              <input
                type="time"
                value={formData.operatingHours.open}
                onChange={e => setFormData({
                  ...formData,
                  operatingHours: { ...formData.operatingHours, open: e.target.value }
                })}
                className="form-control"
              />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginBottom: '4px', display: 'block' }}>Closing Time</span>
              <input
                type="time"
                value={formData.operatingHours.close}
                onChange={e => setFormData({
                  ...formData,
                  operatingHours: { ...formData.operatingHours, close: e.target.value }
                })}
                className="form-control"
              />
            </div>
          </div>
          {errors.operatingHours && <div className="invalid-feedback">{errors.operatingHours}</div>}
        </div>

        {/* Contact Info */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">
              Contact Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="facility.mgr@uni.ac.lk"
              value={formData.contactEmail}
              onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              className={`form-control ${errors.contactEmail ? 'is-invalid' : ''}`}
            />
            {errors.contactEmail && <div className="invalid-feedback">{errors.contactEmail}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              placeholder="+94 11 234 5678"
              value={formData.contactPhone}
              onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Facility Description</label>
          <textarea
            rows={3}
            placeholder="Details about facility features, guidelines, and access restrictions..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="form-control"
          />
        </div>

        {/* Amenities Tag Manager */}
        <div className="form-group">
          <label className="form-label">Amenities & Equipment</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="Add amenity (e.g. Smart Projector, Audio System)..."
              value={newAmenity}
              onChange={e => setNewAmenity(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAmenity(); } }}
              className="form-control"
            />
            <Button type="button" variant="outline" onClick={handleAddAmenity}>
              <Plus size={16} />
            </Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {formData.amenities.map((item, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '3px 8px',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.775rem',
                  color: 'var(--neutral-700)'
                }}
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(idx)}
                  style={{ color: 'var(--neutral-400)', display: 'flex', alignItems: 'center' }}
                  aria-label="Remove amenity"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status Selection */}
        <div className="form-group">
          <label className="form-label">Initial Operational Status</label>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as FacilityStatus })}
            className="form-control"
          >
            <option value="ACTIVE">ACTIVE (Available for reservations)</option>
            <option value="INACTIVE">INACTIVE (Temporarily closed)</option>
            <option value="MAINTENANCE">MAINTENANCE (Under routine upkeep)</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

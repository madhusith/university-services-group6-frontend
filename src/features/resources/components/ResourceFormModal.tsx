import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Resource, CreateResourceInput, ResourceType, ResourceStatus } from '../../../types/resource';
import { Facility } from '../../../types/facility';
import { Plus } from 'lucide-react';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateResourceInput) => Promise<void>;
  facilities: Facility[];
  initialData?: Resource | null;
  isLoading?: boolean;
}

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  facilities,
  initialData,
  isLoading = false
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<CreateResourceInput>({
    code: '',
    name: '',
    facilityId: facilities[0]?.id || '',
    facilityName: facilities[0]?.name || '',
    type: 'ROOM',
    capacity: 20,
    quantity: 1,
    status: 'AVAILABLE',
    requiresApproval: false,
    specs: ['Projector', 'Wi-Fi 6', 'Air Conditioned'],
    hourlyRate: 0,
    description: '',
    imageUrl: ''
  });

  const [newSpec, setNewSpec] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        facilityId: initialData.facilityId,
        facilityName: initialData.facilityName,
        type: initialData.type,
        capacity: initialData.capacity,
        quantity: initialData.quantity,
        status: initialData.status,
        requiresApproval: initialData.requiresApproval,
        specs: [...initialData.specs],
        hourlyRate: initialData.hourlyRate || 0,
        description: initialData.description,
        imageUrl: initialData.imageUrl || ''
      });
      setErrors({});
    } else {
      const defaultFac = facilities[0];
      setFormData({
        code: '',
        name: '',
        facilityId: defaultFac?.id || '',
        facilityName: defaultFac?.name || '',
        type: 'ROOM',
        capacity: 20,
        quantity: 1,
        status: 'AVAILABLE',
        requiresApproval: false,
        specs: ['Projector', 'Wi-Fi 6', 'Air Conditioned'],
        hourlyRate: 0,
        description: '',
        imageUrl: ''
      });
      setErrors({});
    }
  }, [initialData, facilities, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.code.trim()) {
      errs.code = 'Resource code is required (e.g. LAB-CS-101)';
    }

    if (!formData.name.trim()) {
      errs.name = 'Resource name is required';
    }

    if (!formData.facilityId) {
      errs.facilityId = 'Select a parent facility';
    }

    if (formData.capacity < 0) {
      errs.capacity = 'Capacity cannot be negative';
    }

    if (formData.quantity < 1) {
      errs.quantity = 'Quantity must be at least 1';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFacilityChange = (facilityId: string) => {
    const selected = facilities.find(f => f.id === facilityId);
    setFormData(prev => ({
      ...prev,
      facilityId,
      facilityName: selected?.name || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleAddSpec = () => {
    if (newSpec.trim() && !formData.specs.includes(newSpec.trim())) {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, newSpec.trim()]
      }));
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx)
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Resource: ${initialData.name}` : 'Create New Resource'}
      subtitle={isEditing ? 'Modify resource attributes and capacity' : 'Add bookable room, lab workstation, or equipment'}
      maxWidth="600px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Resource'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Code */}
          <div className="form-group">
            <label className="form-label">
              Resource Code <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. LAB-AI-401"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className={`form-control ${errors.code ? 'is-invalid' : ''}`}
              disabled={isEditing}
            />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">
              Resource Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. High-Performance GPU Cluster"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>

        <div className="grid-2">
          {/* Parent Facility */}
          <div className="form-group">
            <label className="form-label">
              Assigned Facility <span className="required">*</span>
            </label>
            <select
              value={formData.facilityId}
              onChange={e => handleFacilityChange(e.target.value)}
              className={`form-control ${errors.facilityId ? 'is-invalid' : ''}`}
            >
              <option value="">Select Facility...</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
              ))}
            </select>
            {errors.facilityId && <div className="invalid-feedback">{errors.facilityId}</div>}
          </div>

          {/* Resource Type */}
          <div className="form-group">
            <label className="form-label">Resource Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="form-control"
            >
              <option value="ROOM">Meeting / Syndicate Room</option>
              <option value="LAB">Computer / Scientific Lab</option>
              <option value="HALL">Lecture / Auditorium Hall</option>
              <option value="EQUIPMENT">Equipment / Projector</option>
              <option value="STUDIO">Media / Recording Studio</option>
              <option value="SPORTS_COURT">Sports Court / Field</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          {/* Capacity */}
          <div className="form-group">
            <label className="form-label">Seating Capacity</label>
            <input
              type="number"
              min={0}
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
            />
            {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ResourceStatus })}
              className="form-control"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>
        </div>

        {/* Approval Requirement Checkbox */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="requiresApprovalCheck"
            checked={formData.requiresApproval}
            onChange={e => setFormData({ ...formData, requiresApproval: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-800)' }}
          />
          <label htmlFor="requiresApprovalCheck" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--neutral-800)', cursor: 'pointer' }}>
            Requires Facility Manager Approval
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'var(--neutral-500)' }}>
              When enabled, reservations enter a pending approval queue before being confirmed.
            </span>
          </label>
        </div>

        {/* Specifications / Hardware Tags */}
        <div className="form-group">
          <label className="form-label">Specifications & Hardware</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. 10x RTX 4090 GPUs, Dual 4K Screens..."
              value={newSpec}
              onChange={e => setNewSpec(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpec(); } }}
              className="form-control"
            />
            <Button type="button" variant="outline" onClick={handleAddSpec}>
              <Plus size={16} />
            </Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {formData.specs.map((item, idx) => (
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
                  onClick={() => handleRemoveSpec(idx)}
                  style={{ color: 'var(--neutral-400)', display: 'flex', alignItems: 'center' }}
                  aria-label="Remove specification"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Resource Description</label>
          <textarea
            rows={3}
            placeholder="Special booking rules, software packages, or access instructions..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="form-control"
          />
        </div>
      </form>
    </Modal>
  );
};

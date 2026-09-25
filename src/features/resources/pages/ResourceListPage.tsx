import React, { useState, useEffect, useCallback } from 'react';
import { Resource, CreateResourceInput, ResourceType } from '../../../types/resource';
import { Facility } from '../../../types/facility';
import { resourceService } from '../../../services/resourceService';
import { facilityService } from '../../../services/facilityService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { ResourceFormModal } from '../components/ResourceFormModal';
import { ResourceDetailModal } from '../components/ResourceDetailModal';
import { ReservationFormModal } from '../../reservations/components/ReservationFormModal';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Users, 
  ShieldAlert, 
  Edit3, 
  Eye, 
  CalendarPlus, 
  Loader2,
  Trash2
} from 'lucide-react';

export const ResourceListPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { success, error } = useToast();
  const canManage = hasRole(['FACILITY_MANAGER', 'ADMIN']);

  const [resources, setResources] = useState<Resource[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [bookingResource, setBookingResource] = useState<Resource | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resData, facData] = await Promise.all([
        resourceService.getAllResources({
          search: searchTerm,
          facilityId: facilityFilter,
          type: typeFilter,
          status: statusFilter
        }),
        facilityService.getAllFacilities()
      ]);
      setResources(resData);
      setFacilities(facData);
    } catch (err: any) {
      error('Failed to Load Resources', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, facilityFilter, typeFilter, statusFilter, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFormSubmit = async (data: CreateResourceInput) => {
    try {
      setIsSubmitting(true);
      if (editingResource) {
        await resourceService.updateResource(editingResource.id, data);
        success('Resource Updated', `"${data.name}" was successfully updated.`);
      } else {
        await resourceService.createResource(data);
        success('Resource Created', `"${data.name}" was successfully added.`);
      }
      setIsFormOpen(false);
      setEditingResource(null);
      await loadData();
    } catch (err: any) {
      error('Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await resourceService.deleteResource(id);
        success('Resource Deleted', `"${name}" was removed.`);
        await loadData();
      } catch (err: any) {
        error('Deletion Failed', err.message);
      }
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>Resources</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Bookable rooms, labs, auditoriums, and specialized equipment.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => {
              setEditingResource(null);
              setIsFormOpen(true);
            }}
          >
            Add Resource
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--neutral-400)" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ border: 'none', boxShadow: 'none', padding: '0.4rem 0.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Facility Filter */}
          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Facilities</option>
            {facilities.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Resource Types</option>
            <option value="ROOM">Rooms & Suites</option>
            <option value="LAB">Computing & Science Labs</option>
            <option value="HALL">Auditoriums & Halls</option>
            <option value="EQUIPMENT">Specialized Equipment</option>
            <option value="SPORTS_COURT">Sports Courts</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Loading university resources...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && resources.length === 0 && (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Layers size={48} color="var(--neutral-300)" />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--neutral-800)' }}>No Resources Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', maxWidth: '420px', margin: 0 }}>
            No resources match your active search filters or facility selection.
          </p>
          {canManage && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              style={{ marginTop: '0.5rem' }}
              onClick={() => {
                setEditingResource(null);
                setIsFormOpen(true);
              }}
            >
              Add New Resource
            </Button>
          )}
        </div>
      )}

      {/* Resources Grid */}
      {!isLoading && resources.length > 0 && (
        <div className="grid-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Header Image */}
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img
                  src={resource.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80'}
                  alt={resource.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
                  <Badge variant={resource.status.toLowerCase() as any}>
                    {resource.status}
                  </Badge>
                  {resource.requiresApproval && (
                    <Badge variant="pending" icon={<ShieldAlert size={12} />}>
                      Approval Req.
                    </Badge>
                  )}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    fontSize: '0.725rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {resource.type}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary-800)', letterSpacing: '0.04em' }}>
                    {resource.code}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '0.2rem 0 0.4rem 0', color: 'var(--neutral-900)' }}>
                    {resource.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--neutral-500)', marginBottom: '0.85rem' }}>
                    <Building2 size={14} color="var(--neutral-400)" />
                    <span>{resource.facilityName}</span>
                  </div>

                  <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--neutral-600)',
                    lineHeight: 1.5,
                    marginBottom: '0.85rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {resource.description || 'Modern facility resource with all basic equipment.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--neutral-600)' }}>
                    <Users size={14} color="var(--neutral-400)" />
                    <span>Capacity: {resource.capacity} Pax (Qty: {resource.quantity})</span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye size={14} />}
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsDetailOpen(true);
                    }}
                  >
                    Details
                  </Button>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {resource.status === 'AVAILABLE' && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CalendarPlus size={14} />}
                        onClick={() => {
                          setBookingResource(resource);
                          setIsBookingModalOpen(true);
                        }}
                      >
                        Book
                      </Button>
                    )}

                    {canManage && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit Resource"
                          onClick={() => {
                            setEditingResource(resource);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete Resource"
                          onClick={() => handleDeleteResource(resource.id, resource.name)}
                        >
                          <Trash2 size={14} color="var(--danger-500)" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Form Modal */}
      <ResourceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResource(null);
        }}
        onSubmit={handleFormSubmit}
        facilities={facilities}
        initialData={editingResource}
        isLoading={isSubmitting}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedResource(null);
        }}
        resource={selectedResource}
        canManage={canManage}
        onEdit={(res) => {
          setIsDetailOpen(false);
          setEditingResource(res);
          setIsFormOpen(true);
        }}
        onReserve={(res) => {
          setIsDetailOpen(false);
          setBookingResource(res);
          setIsBookingModalOpen(true);
        }}
      />

      {/* Direct Booking Modal */}
      <ReservationFormModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingResource(null);
        }}
        preselectedResource={bookingResource}
        onSuccess={() => {
          setIsBookingModalOpen(false);
          setBookingResource(null);
          loadData();
        }}
      />
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Facility, CreateFacilityInput } from '../../../types/facility';
import { Resource } from '../../../types/resource';
import { facilityService } from '../../../services/facilityService';
import { resourceService } from '../../../services/resourceService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { FacilityFormModal } from '../components/FacilityFormModal';
import { FacilityDetailModal } from '../components/FacilityDetailModal';
import { ConfirmationModal } from '../../../components/common/ConfirmationModal';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Power, 
  Edit3, 
  Eye, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export const FacilityListPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { success, error } = useToast();
  const canManage = hasRole(['FACILITY_MANAGER', 'ADMIN']);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Status toggle confirmation
  const [facilityToToggle, setFacilityToToggle] = useState<Facility | null>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorState(null);
      const [facData, resData] = await Promise.all([
        facilityService.getAllFacilities({
          search: searchTerm,
          category: categoryFilter,
          status: statusFilter
        }),
        resourceService.getAllResources()
      ]);
      setFacilities(facData);
      setResources(resData);
    } catch (err: any) {
      setErrorState(err.message || 'Failed to fetch facilities from server.');
      error('Error Loading Facilities', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, categoryFilter, statusFilter, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create or Update
  const handleFormSubmit = async (data: CreateFacilityInput) => {
    try {
      setIsSubmitting(true);
      if (editingFacility) {
        await facilityService.updateFacility(editingFacility.id, data);
        success('Facility Updated', `"${data.name}" was successfully updated.`);
      } else {
        await facilityService.createFacility(data);
        success('Facility Created', `"${data.name}" was successfully created.`);
      }
      setIsFormOpen(false);
      setEditingFacility(null);
      await loadData();
    } catch (err: any) {
      error('Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Activate / Deactivate status toggle
  const handleConfirmToggle = async () => {
    if (!facilityToToggle) return;
    try {
      setIsSubmitting(true);
      const nextStatus = facilityToToggle.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await facilityService.updateFacilityStatus(facilityToToggle.id, nextStatus);
      success(
        'Status Changed',
        `Facility "${facilityToToggle.name}" is now ${nextStatus.toLowerCase()}.`
      );
      setIsToggleModalOpen(false);
      setFacilityToToggle(null);
      if (selectedFacility && selectedFacility.id === facilityToToggle.id) {
        setSelectedFacility(prev => prev ? { ...prev, status: nextStatus } : null);
      }
      await loadData();
    } catch (err: any) {
      error('Status Update Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>Facility Management</h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '4px' }}>
              USMG6-122
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Browse university complexes, inspect lab amenities, configure operating hours, and manage availability.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => {
              setEditingFacility(null);
              setIsFormOpen(true);
            }}
          >
            Register New Facility
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--neutral-400)" />
          <input
            type="text"
            placeholder="Search by facility name, code, building, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ border: 'none', boxShadow: 'none', padding: '0.4rem 0.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--neutral-500)" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="ALL">All Categories</option>
              <option value="LABORATORY">Laboratories</option>
              <option value="ACADEMIC">Academic</option>
              <option value="AUDITORIUM">Auditoriums</option>
              <option value="LIBRARY">Libraries</option>
              <option value="SPORTS">Sports Arena</option>
              <option value="STUDENT_CENTER">Student Center</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Loading university facilities...</span>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorState && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--danger-100)', backgroundColor: 'var(--danger-50)' }}>
          <AlertCircle size={36} color="var(--danger-500)" style={{ margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ color: 'var(--danger-700)', fontSize: '1.1rem' }}>Unable to load facilities</h3>
          <p style={{ color: 'var(--neutral-600)', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0' }}>{errorState}</p>
          <Button variant="outline" size="sm" onClick={loadData}>Retry Loading</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorState && facilities.length === 0 && (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={48} color="var(--neutral-300)" />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--neutral-800)' }}>No Facilities Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', maxWidth: '420px', margin: 0 }}>
            {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'No facilities match your active search filters. Try broadening your criteria.'
              : 'There are currently no registered facilities in the system.'}
          </p>
          {canManage && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              style={{ marginTop: '0.5rem' }}
              onClick={() => {
                setEditingFacility(null);
                setIsFormOpen(true);
              }}
            >
              Add First Facility
            </Button>
          )}
        </div>
      )}

      {/* Facilities Grid */}
      {!isLoading && !errorState && facilities.length > 0 && (
        <div className="grid-3">
          {facilities.map((facility) => {
            const facResources = resources.filter(r => r.facilityId === facility.id);
            return (
              <div
                key={facility.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Facility Image Cover */}
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                  <img
                    src={facility.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'}
                    alt={facility.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '0.4rem'
                    }}
                  >
                    <Badge variant={facility.status.toLowerCase() as any}>
                      {facility.status}
                    </Badge>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {facility.category}
                  </div>
                </div>

                {/* Facility Info Body */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)', letterSpacing: '0.04em' }}>
                      {facility.code}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0.2rem 0 0.5rem 0', color: 'var(--neutral-900)' }}>
                      {facility.name}
                    </h3>
                    <p style={{
                      fontSize: '0.825rem',
                      color: 'var(--neutral-600)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {facility.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--neutral-600)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={14} color="var(--neutral-400)" />
                        <span>{facility.building}, {facility.floor}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={14} color="var(--neutral-400)" />
                        <span>Capacity: {facility.capacity} • {facResources.length} sub-resources</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
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
                        setSelectedFacility(facility);
                        setIsDetailOpen(true);
                      }}
                    >
                      Details
                    </Button>

                    {canManage && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Edit Facility"
                          onClick={() => {
                            setEditingFacility(facility);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant={facility.status === 'ACTIVE' ? 'outline' : 'secondary'}
                          size="sm"
                          title={facility.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          onClick={() => {
                            setFacilityToToggle(facility);
                            setIsToggleModalOpen(true);
                          }}
                        >
                          <Power size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      <FacilityFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFacility(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingFacility}
        isLoading={isSubmitting}
      />

      {/* Details Modal */}
      <FacilityDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedFacility(null);
        }}
        facility={selectedFacility}
        resources={resources}
        canManage={canManage}
        onEdit={(fac) => {
          setIsDetailOpen(false);
          setEditingFacility(fac);
          setIsFormOpen(true);
        }}
        onToggleStatus={(fac) => {
          setFacilityToToggle(fac);
          setIsToggleModalOpen(true);
        }}
      />

      {/* Activate / Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={isToggleModalOpen}
        onClose={() => {
          setIsToggleModalOpen(false);
          setFacilityToToggle(null);
        }}
        onConfirm={handleConfirmToggle}
        isLoading={isSubmitting}
        variant={facilityToToggle?.status === 'ACTIVE' ? 'warning' : 'secondary'}
        title={facilityToToggle?.status === 'ACTIVE' ? 'Deactivate Facility' : 'Activate Facility'}
        message={
          facilityToToggle?.status === 'ACTIVE'
            ? `Are you sure you want to deactivate "${facilityToToggle?.name}"? New reservations will be paused until reactivated.`
            : `Are you sure you want to activate "${facilityToToggle?.name}"? It will become visible and open for reservations immediately.`
        }
        confirmLabel={facilityToToggle?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
      />
    </div>
  );
};

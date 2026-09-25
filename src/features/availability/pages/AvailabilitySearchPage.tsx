import React, { useState, useEffect } from 'react';
import { reservationService, AvailableResourceResult } from '../../../services/reservationService';
import { facilityService } from '../../../services/facilityService';
import { Facility } from '../../../types/facility';
import { Resource } from '../../../types/resource';
import { useToast } from '../../../context/ToastContext';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { ReservationFormModal } from '../../reservations/components/ReservationFormModal';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  CalendarPlus, 
  Loader2,
  Sparkles
} from 'lucide-react';

export const AvailabilitySearchPage: React.FC = () => {
  const { error } = useToast();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [minCapacity, setMinCapacity] = useState(0);

  const [results, setResults] = useState<AvailableResourceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Booking modal state
  const [selectedResourceToBook, setSelectedResourceToBook] = useState<Resource | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    facilityService.getAllFacilities().then(setFacilities).catch(console.error);
    // Initial search
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setHasSearched(true);
      const data = await reservationService.searchAvailability({
        facilityId: selectedFacilityId,
        type: selectedType,
        date,
        startTime,
        endTime,
        minCapacity
      });
      setResults(data);
    } catch (err: any) {
      error('Search Failed', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const availableCount = results.filter(r => r.isAvailable).length;
  const unavailableCount = results.filter(r => !r.isAvailable).length;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>Availability Search</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
          Real-time university timetable availability engine. Select dates and required hardware parameters to find open slots.
        </p>
      </div>

      {/* Search Criteria Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-800)' }}>
        <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
          {/* Facility Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Facility</label>
            <select
              value={selectedFacilityId}
              onChange={e => setSelectedFacilityId(e.target.value)}
              className="form-control"
            >
              <option value="ALL">All University Facilities</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Resource Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="form-control"
            >
              <option value="ALL">All Categories</option>
              <option value="ROOM">Rooms & Suites</option>
              <option value="LAB">Computing & Science Labs</option>
              <option value="HALL">Lecture / Auditoriums</option>
              <option value="EQUIPMENT">Specialized Equipment</option>
              <option value="SPORTS_COURT">Sports Courts</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Capacity */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Min. Capacity (Pax)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 15"
              value={minCapacity || ''}
              onChange={e => setMinCapacity(parseInt(e.target.value) || 0)}
              className="form-control"
            />
          </div>
        </div>

        {/* Time Slot Selector & Search Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--neutral-500)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--neutral-700)' }}>Time Window:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="form-control"
                style={{ width: '130px', padding: '0.4rem 0.6rem' }}
              />
              <span style={{ color: 'var(--neutral-400)' }}>to</span>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="form-control"
                style={{ width: '130px', padding: '0.4rem 0.6rem' }}
              />
            </div>
          </div>

          <Button
            variant="primary"
            leftIcon={<Search size={16} />}
            onClick={handleSearch}
            isLoading={isSearching}
          >
            Check Live Availability
          </Button>
        </div>
      </div>

      {/* Results Header */}
      {hasSearched && !isSearching && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--neutral-900)' }}>
              Search Results
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 700, backgroundColor: 'var(--success-50)', color: 'var(--success-700)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--success-100)' }}>
                {availableCount} Available
              </span>
              <span style={{ fontSize: '0.775rem', fontWeight: 700, backgroundColor: 'var(--neutral-100)', color: 'var(--neutral-600)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                {unavailableCount} Occupied / Restricted
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
            Timeslot: {date} ({startTime} - {endTime})
          </span>
        </div>
      )}

      {/* Loading */}
      {isSearching && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Querying schedule matrix...</span>
        </div>
      )}

      {/* Results List */}
      {!isSearching && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {results.map(({ resource, isAvailable, conflictReason, facilityName }) => (
            <div
              key={resource.id}
              className="card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderLeft: `4px solid ${isAvailable ? 'var(--success-500)' : 'var(--neutral-300)'}`,
                opacity: isAvailable ? 1 : 0.82
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: '300px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isAvailable ? 'var(--success-50)' : 'var(--neutral-100)',
                    color: isAvailable ? 'var(--success-700)' : 'var(--neutral-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isAvailable ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-800)' }}>
                      {resource.code}
                    </span>
                    <Badge variant={isAvailable ? 'available' : 'occupied'}>
                      {isAvailable ? 'Available to Book' : 'Unavailable'}
                    </Badge>
                    <span style={{ fontSize: '0.725rem', color: 'var(--neutral-400)' }}>
                      • {resource.type}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', margin: '0.2rem 0', color: 'var(--neutral-900)' }}>
                    {resource.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--neutral-600)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={13} color="var(--neutral-400)" />
                      <span>{facilityName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={13} color="var(--neutral-400)" />
                      <span>Capacity: {resource.capacity} pax</span>
                    </div>
                  </div>

                  {!isAvailable && conflictReason && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', color: 'var(--danger-700)', backgroundColor: 'var(--danger-50)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                      Reason: {conflictReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isAvailable ? (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<CalendarPlus size={15} />}
                    onClick={() => {
                      setSelectedResourceToBook(resource);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Reserve This Slot
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Slot Unavailable
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      <ReservationFormModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedResourceToBook(null);
        }}
        preselectedResource={selectedResourceToBook}
        preselectedDate={date}
        preselectedStartTime={startTime}
        preselectedEndTime={endTime}
        onSuccess={handleSearch}
      />
    </div>
  );
};

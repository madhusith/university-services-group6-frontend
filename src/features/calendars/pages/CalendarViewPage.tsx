import React, { useState, useEffect, useMemo } from 'react';
import { Reservation } from '../../../types/reservation';
import { Facility } from '../../../types/facility';
import { Resource } from '../../../types/resource';
import { reservationService } from '../../../services/reservationService';
import { facilityService } from '../../../services/facilityService';
import { resourceService } from '../../../services/resourceService';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { ReservationDetailModal } from '../../reservations/components/ReservationDetailModal';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Building2, 
  Layers, 
  Clock, 
  Eye, 
  Loader2
} from 'lucide-react';

export const CalendarViewPage: React.FC = () => {
  const { error } = useToast();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calendar View mode: 'MONTH' | 'WEEK'
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK'>('MONTH');

  // Calendar Filters (USMG6-56)
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('ALL');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('ALL');

  // Selected date cursor (defaults to current date)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Selected reservation for popup detail
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setIsLoading(true);
        const [facs, ress, resvs] = await Promise.all([
          facilityService.getAllFacilities(),
          resourceService.getAllResources(),
          reservationService.getAllReservations()
        ]);
        setFacilities(facs);
        setResources(ress);
        setReservations(resvs);
      } catch (err: any) {
        error('Failed to Load Calendar', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [error]);

  // Filter resources based on facility selection
  const availableResources = useMemo(() => {
    if (selectedFacilityId === 'ALL') return resources;
    return resources.filter(r => r.facilityId === selectedFacilityId);
  }, [resources, selectedFacilityId]);

  // Filter reservations based on facility and resource filters (USMG6-56)
  const filteredReservations = useMemo(() => {
    return reservations.filter(r => {
      if (selectedFacilityId !== 'ALL' && r.facilityId !== selectedFacilityId) return false;
      if (selectedResourceId !== 'ALL' && r.resourceId !== selectedResourceId) return false;
      return true;
    });
  }, [reservations, selectedFacilityId, selectedResourceId]);

  // Date Navigation Helpers
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month grid generator
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = prevMonthLastDate - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const str = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr: str, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const str = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dateStr: str, dayNum: i, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const str = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dateStr: str, dayNum: i, isCurrentMonth: false });
    }

    return days;
  }, [currentDate]);

  // Week days generator
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay(); // 0 is Sun
    const firstDay = new Date(curr.setDate(curr.getDate() - day)); // Sunday

    const days: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() + i);
      const str = d.toISOString().split('T')[0];
      days.push({
        dateStr: str,
        dayName: dayNames[i],
        dayNum: d.getDate(),
        isToday: str === todayStr
      });
    }
    return days;
  }, [currentDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--neutral-900)' }}>University Reservation Calendar</h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '4px' }}>
              USMG6-54 / 55 / 56
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
            Unified timeline view of scheduled facility usage, lab workshops, and reservation occupancy.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--neutral-100)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setViewMode('MONTH')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'MONTH' ? '#ffffff' : 'transparent',
              color: viewMode === 'MONTH' ? 'var(--primary-800)' : 'var(--neutral-600)',
              boxShadow: viewMode === 'MONTH' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Month View
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: viewMode === 'WEEK' ? '#ffffff' : 'transparent',
              color: viewMode === 'WEEK' ? 'var(--primary-800)' : 'var(--neutral-600)',
              boxShadow: viewMode === 'WEEK' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Week View
          </button>
        </div>
      </div>

      {/* Filter and Date Bar (USMG6-56) */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={viewMode === 'MONTH' ? prevMonth : prevWeek}
              aria-label="Previous Period"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={viewMode === 'MONTH' ? nextMonth : nextWeek}
              aria-label="Next Period"
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          <h2 style={{ fontSize: '1.15rem', color: 'var(--neutral-900)', margin: 0 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>

        {/* Facility and Resource Filters (USMG6-56) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={16} color="var(--neutral-400)" />
            <select
              value={selectedFacilityId}
              onChange={e => {
                setSelectedFacilityId(e.target.value);
                setSelectedResourceId('ALL');
              }}
              className="form-control"
              style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="ALL">All Facilities (USMG6-55)</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={16} color="var(--neutral-400)" />
            <select
              value={selectedResourceId}
              onChange={e => setSelectedResourceId(e.target.value)}
              className="form-control"
              style={{ width: 'auto', fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="ALL">All Resources (USMG6-54)</option>
              {availableResources.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} color="var(--primary-800)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--neutral-500)' }}>Building schedule calendar...</span>
        </div>
      )}

      {/* MONTH VIEW */}
      {!isLoading && viewMode === 'MONTH' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Day of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--border-light)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--border-light)', gap: '1px' }}>
            {monthDays.map((cell, idx) => {
              const cellReservations = filteredReservations.filter(r => r.date === cell.dateStr);
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: cell.isCurrentMonth ? '#ffffff' : 'var(--neutral-50)',
                    minHeight: '110px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: cell.isCurrentMonth ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isToday ? 800 : 600,
                        width: isToday ? '24px' : 'auto',
                        height: isToday ? '24px' : 'auto',
                        borderRadius: isToday ? '50%' : 'none',
                        backgroundColor: isToday ? 'var(--primary-800)' : 'transparent',
                        color: isToday ? '#ffffff' : 'var(--neutral-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {cell.dayNum}
                    </span>

                    {cellReservations.length > 0 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--neutral-400)', fontWeight: 600 }}>
                        {cellReservations.length} event{cellReservations.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Reservation pills inside day cell */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto', maxHeight: '80px' }}>
                    {cellReservations.map(resv => {
                      const isPending = resv.status === 'PENDING';
                      return (
                        <div
                          key={resv.id}
                          onClick={() => {
                            setSelectedReservation(resv);
                            setIsDetailOpen(true);
                          }}
                          style={{
                            fontSize: '0.675rem',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            backgroundColor: isPending ? 'var(--warning-50)' : 'var(--primary-50)',
                            color: isPending ? 'var(--warning-700)' : 'var(--primary-800)',
                            borderLeft: `3px solid ${isPending ? 'var(--warning-500)' : 'var(--primary-800)'}`,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontWeight: 600
                          }}
                          title={`${resv.startTime}-${resv.endTime}: ${resv.purpose} (${resv.resourceName})`}
                        >
                          {resv.startTime} {resv.resourceName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {!isLoading && viewMode === 'WEEK' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Day of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--border-light)' }}>
            {weekDays.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: '0.85rem 0.5rem',
                  textAlign: 'center',
                  backgroundColor: d.isToday ? 'var(--primary-50)' : 'transparent',
                  borderRight: i < 6 ? '1px solid var(--border-light)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: d.isToday ? 'var(--primary-800)' : 'var(--neutral-500)', textTransform: 'uppercase' }}>
                  {d.dayName}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: d.isToday ? 'var(--primary-800)' : 'var(--neutral-900)', marginTop: '2px' }}>
                  {d.dayNum}
                </div>
              </div>
            ))}
          </div>

          {/* Week Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '380px', backgroundColor: 'var(--border-light)', gap: '1px' }}>
            {weekDays.map((d, i) => {
              const dayReservations = filteredReservations.filter(r => r.date === d.dateStr);

              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: d.isToday ? '#fafcff' : '#ffffff',
                    padding: '0.65rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  {dayReservations.length === 0 ? (
                    <div style={{ fontSize: '0.725rem', color: 'var(--neutral-400)', textAlign: 'center', marginTop: '1rem' }}>
                      No bookings
                    </div>
                  ) : (
                    dayReservations.map(resv => {
                      const isPending = resv.status === 'PENDING';
                      return (
                        <div
                          key={resv.id}
                          onClick={() => {
                            setSelectedReservation(resv);
                            setIsDetailOpen(true);
                          }}
                          style={{
                            padding: '0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isPending ? 'var(--warning-50)' : 'var(--primary-50)',
                            borderLeft: `4px solid ${isPending ? 'var(--warning-500)' : 'var(--primary-800)'}`,
                            borderTop: '1px solid var(--border-light)',
                            borderRight: '1px solid var(--border-light)',
                            borderBottom: '1px solid var(--border-light)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: isPending ? 'var(--warning-700)' : 'var(--primary-800)', fontWeight: 700 }}>
                            <Clock size={11} />
                            <span>{resv.startTime} - {resv.endTime}</span>
                          </div>

                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-900)', lineHeight: 1.2 }}>
                            {resv.purpose}
                          </div>

                          <div style={{ fontSize: '0.725rem', color: 'var(--neutral-600)' }}>
                            {resv.resourceName}
                          </div>

                          <div style={{ fontSize: '0.675rem', color: 'var(--neutral-400)' }}>
                            By {resv.userName}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reservation Details Popup Modal */}
      <ReservationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />
    </div>
  );
};

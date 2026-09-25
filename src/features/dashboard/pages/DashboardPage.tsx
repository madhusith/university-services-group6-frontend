import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StatsCard } from '../../../components/common/StatsCard';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Facility } from '../../../types/facility';
import { Resource } from '../../../types/resource';
import { Reservation } from '../../../types/reservation';
import { facilityService } from '../../../services/facilityService';
import { resourceService } from '../../../services/resourceService';
import { reservationService } from '../../../services/reservationService';
import { ReservationDetailModal } from '../../reservations/components/ReservationDetailModal';
import { ReservationFormModal } from '../../reservations/components/ReservationFormModal';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  CalendarCheck2, 
  Clock, 
  Plus, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  CalendarDays,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, hasRole } = useAuth();
  const isManagerOrAdmin = hasRole(['FACILITY_MANAGER', 'ADMIN']);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [facs, ress, upcomings, pendings] = await Promise.all([
        facilityService.getAllFacilities(),
        resourceService.getAllResources(),
        reservationService.getUpcomingReservations(isManagerOrAdmin ? undefined : currentUser.id),
        reservationService.getPendingApprovals()
      ]);
      setFacilities(facs);
      setResources(ress);
      setUpcomingReservations(upcomings);
      setPendingApprovals(pendings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id, isManagerOrAdmin]);

  const activeFacilitiesCount = facilities.filter(f => f.status === 'ACTIVE').length;
  const availableResourcesCount = resources.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #1E40AF 0%, #1e3a8a 50%, #0F766E 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          border: 'none',
          boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Building2 size={13} />
            <span>Group 6 Campus Resource Management Engine</span>
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            Welcome back, {currentUser.name}!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
            {currentUser.department} • Active Role: <strong>{currentUser.role.replace('_', ' ')}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
            onClick={() => setIsNewBookingOpen(true)}
            leftIcon={<Plus size={16} />}
          >
            Quick Reservation
          </Button>
          <Link to="/availability">
            <Button
              variant="secondary"
              leftIcon={<Search size={16} />}
            >
              Search Availability
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatsCard
          title="Active Facilities"
          value={activeFacilitiesCount}
          subtitle={`Out of ${facilities.length} registered complexes`}
          icon={<Building2 size={22} />}
          colorVariant="primary"
          trend={{ value: `${facilities.length} Total`, isPositive: true }}
        />

        <StatsCard
          title="Bookable Resources"
          value={availableResourcesCount}
          subtitle="Labs, halls & workstations"
          icon={<Layers size={22} />}
          colorVariant="secondary"
          trend={{ value: `${resources.length} Total`, isPositive: true }}
        />

        <StatsCard
          title="Upcoming Bookings"
          value={upcomingReservations.length}
          subtitle={isManagerOrAdmin ? 'Campus-wide upcoming' : 'Your scheduled slots'}
          icon={<CalendarCheck2 size={22} />}
          colorVariant="primary"
          trend={{ value: 'USMG6-60', isPositive: true }}
        />

        <StatsCard
          title="Pending Approvals"
          value={pendingApprovals.length}
          subtitle={isManagerOrAdmin ? 'Requires manager review' : 'Awaiting confirmation'}
          icon={<Clock size={22} />}
          colorVariant={pendingApprovals.length > 0 ? 'warning' : 'secondary'}
          trend={{ value: 'USMG6-127', isPositive: pendingApprovals.length === 0 }}
        />
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* USMG6-60: Upcoming Reservations Widget */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--neutral-900)' }}>
                  Upcoming Reservations
                </h3>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 6px', borderRadius: '4px' }}>
                  USMG6-60
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                Excludes past bookings, chronological order
              </span>
            </div>

            <Link to="/reservations" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingReservations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
                No upcoming reservations on the schedule.
              </div>
            ) : (
              upcomingReservations.slice(0, 4).map(resv => (
                <div
                  key={resv.id}
                  onClick={() => {
                    setSelectedReservation(resv);
                    setIsDetailOpen(true);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: '#ffffff'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--neutral-50)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        padding: '0.5rem 0.65rem',
                        backgroundColor: 'var(--primary-50)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        lineHeight: 1.1
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary-800)', textTransform: 'uppercase' }}>
                        {new Date(resv.date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                        {resv.date.split('-')[2]}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                        {resv.purpose}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                        {resv.resourceName} • {resv.startTime} - {resv.endTime}
                      </div>
                    </div>
                  </div>

                  <Badge variant={resv.status.toLowerCase() as any}>
                    {resv.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Center & Approvals Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Manager Approvals Callout (USMG6-127) */}
          {isManagerOrAdmin && (
            <div className="card" style={{ borderLeft: '4px solid var(--warning-500)' }}>
              <div className="card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--neutral-900)' }}>
                      Pending Approvals
                    </h3>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', padding: '2px 6px', borderRadius: '4px' }}>
                      USMG6-127
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                    High-demand resources requiring Facility Manager review
                  </span>
                </div>

                <Link to="/approvals" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Queue ({pendingApprovals.length}) <ChevronRight size={14} />
                </Link>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pendingApprovals.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success-700)', backgroundColor: 'var(--success-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Zero pending approvals in queue!</span>
                  </div>
                ) : (
                  pendingApprovals.slice(0, 3).map(resv => (
                    <div
                      key={resv.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--neutral-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                          {resv.purpose}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                          By {resv.userName} • {resv.resourceName} ({resv.date})
                        </div>
                      </div>
                      <Link to="/approvals">
                        <Button variant="secondary" size="sm">Review</Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--neutral-900)' }}>
                System Quick Links
              </h3>
            </div>
            <div className="card-body grid-2">
              <Link to="/availability" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease' }}>
                  <Search size={18} color="var(--primary-800)" style={{ marginBottom: '0.35rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)' }}>Live Timetable</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Search available halls & lab computers</div>
                </div>
              </Link>

              <Link to="/calendars" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease' }}>
                  <CalendarDays size={18} color="var(--secondary-700)" style={{ marginBottom: '0.35rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)' }}>Master Calendar</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Month & week reservation schedules</div>
                </div>
              </Link>

              <Link to="/facilities" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease' }}>
                  <Building2 size={18} color="var(--tertiary-500)" style={{ marginBottom: '0.35rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)' }}>Facility Catalog</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Buildings, amenities & hours</div>
                </div>
              </Link>

              <Link to="/resources" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease' }}>
                  <Layers size={18} color="var(--neutral-700)" style={{ marginBottom: '0.35rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-800)' }}>Resource Catalog</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--neutral-500)' }}>Specs, capacity & equipment</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Modal */}
      <ReservationDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />

      {/* Quick Booking Modal */}
      <ReservationFormModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSuccess={loadDashboardData}
      />
    </div>
  );
};

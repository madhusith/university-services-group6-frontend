import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Feature Pages
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { FacilityListPage } from '../features/facilities/pages/FacilityListPage';
import { ResourceListPage } from '../features/resources/pages/ResourceListPage';
import { AvailabilitySearchPage } from '../features/availability/pages/AvailabilitySearchPage';
import { MyReservationsPage } from '../features/reservations/pages/MyReservationsPage';
import { ApprovalQueuePage } from '../features/approvals/pages/ApprovalQueuePage';
import { CalendarViewPage } from '../features/calendars/pages/CalendarViewPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Main Dashboard & Overview */}
        <Route path="/" element={<DashboardPage />} />

        {/* USMG6-122: Facility Management */}
        <Route path="/facilities" element={<FacilityListPage />} />

        {/* USMG6-123: Resource Management */}
        <Route path="/resources" element={<ResourceListPage />} />

        {/* USMG6-124: Availability Search */}
        <Route path="/availability" element={<AvailabilitySearchPage />} />

        {/* USMG6-126: Reservation Frontend */}
        <Route path="/reservations" element={<MyReservationsPage />} />

        {/* USMG6-127 & USMG6-61: Approvals Queue (Restricted to Manager and Admin) */}
        <Route
          path="/approvals"
          element={
            <ProtectedRoute allowedRoles={['FACILITY_MANAGER', 'ADMIN']}>
              <ApprovalQueuePage />
            </ProtectedRoute>
          }
        />

        {/* USMG6-54, USMG6-55, USMG6-56: Calendars */}
        <Route path="/calendars" element={<CalendarViewPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

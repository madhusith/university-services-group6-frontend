export type ReservationStatus = 
  | 'PENDING'    // Awaiting facility manager approval
  | 'CONFIRMED'  // Approved and active
  | 'REJECTED'   // Rejected by manager
  | 'CANCELLED'  // Cancelled by user or admin
  | 'COMPLETED';  // Past reservation completed

export interface Reservation {
  id: string;
  reservationNumber: string; // e.g. "RES-2026-081"
  resourceId: string;
  resourceName: string;
  resourceType: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  department: string;
  purpose: string;
  attendeesCount: number;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  status: ReservationStatus;
  notes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  requiresApproval: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationInput {
  resourceId: string;
  facilityId: string;
  purpose: string;
  attendeesCount: number;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface ReservationFilterParams {
  status?: string;
  resourceId?: string;
  facilityId?: string;
  userId?: string;
  date?: string;
  search?: string;
}

export interface AvailabilitySearchParams {
  facilityId?: string;
  type?: string;
  date: string;
  startTime: string;
  endTime: string;
  minCapacity?: number;
}

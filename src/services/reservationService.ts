import { 
  Reservation, 
  CreateReservationInput, 
  ReservationFilterParams, 
  AvailabilitySearchParams 
} from '../types/reservation';
import { Resource } from '../types/resource';
import { getStoredReservations, saveReservations, getStoredResources, getStoredFacilities } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const simulateDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AvailableResourceResult {
  resource: Resource;
  isAvailable: boolean;
  conflictReason?: string;
  facilityName: string;
}

export const reservationService = {
  // Get all reservations with filters
  async getAllReservations(params?: ReservationFilterParams): Promise<Reservation[]> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.resourceId) query.append('resourceId', params.resourceId);
        if (params?.facilityId) query.append('facilityId', params.facilityId);
        if (params?.userId) query.append('userId', params.userId);
        if (params?.date) query.append('date', params.date);
        const res = await fetch(`${API_BASE_URL}/api/reservations?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, using local reservations store:', err);
      }
    }

    await simulateDelay();
    let reservations = getStoredReservations();

    if (params?.status && params.status !== 'ALL') {
      reservations = reservations.filter(r => r.status === params.status);
    }

    if (params?.resourceId && params.resourceId !== 'ALL') {
      reservations = reservations.filter(r => r.resourceId === params.resourceId);
    }

    if (params?.facilityId && params.facilityId !== 'ALL') {
      reservations = reservations.filter(r => r.facilityId === params.facilityId);
    }

    if (params?.userId) {
      reservations = reservations.filter(r => r.userId === params.userId);
    }

    if (params?.date) {
      reservations = reservations.filter(r => r.date === params.date);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      reservations = reservations.filter(
        r => r.reservationNumber.toLowerCase().includes(q) ||
             r.resourceName.toLowerCase().includes(q) ||
             r.facilityName.toLowerCase().includes(q) ||
             r.userName.toLowerCase().includes(q) ||
             r.purpose.toLowerCase().includes(q)
      );
    }

    // Sort descending by date and time
    return reservations.sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));
  },

  // Get upcoming reservations (USMG6-60)
  async getUpcomingReservations(userId?: string): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    const all = await this.getAllReservations(userId ? { userId } : undefined);
    
    return all.filter(r => 
      (r.status === 'CONFIRMED' || r.status === 'PENDING') &&
      r.date >= today
    ).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  },

  // Get pending reservations for approval queue (USMG6-127)
  async getPendingApprovals(): Promise<Reservation[]> {
    return this.getAllReservations({ status: 'PENDING' });
  },

  // USMG6-124: Search availability for given slot & criteria
  async searchAvailability(params: AvailabilitySearchParams): Promise<AvailableResourceResult[]> {
    await simulateDelay();
    const resources = getStoredResources();
    const reservations = getStoredReservations();
    const facilities = getStoredFacilities();

    let filteredResources = resources;

    if (params.facilityId && params.facilityId !== 'ALL') {
      filteredResources = filteredResources.filter(r => r.facilityId === params.facilityId);
    }

    if (params.type && params.type !== 'ALL') {
      filteredResources = filteredResources.filter(r => r.type === params.type);
    }

    if (params.minCapacity && params.minCapacity > 0) {
      filteredResources = filteredResources.filter(r => r.capacity >= (params.minCapacity || 0));
    }

    // Check availability slot conflicts
    const results: AvailableResourceResult[] = filteredResources.map(resource => {
      const parentFacility = facilities.find(f => f.id === resource.facilityId);
      
      // Check if facility or resource is inactive/maintenance
      if (parentFacility?.status === 'INACTIVE') {
        return {
          resource,
          facilityName: parentFacility.name,
          isAvailable: false,
          conflictReason: `Facility (${parentFacility.name}) is currently inactive.`
        };
      }
      if (parentFacility?.status === 'MAINTENANCE') {
        return {
          resource,
          facilityName: parentFacility.name,
          isAvailable: false,
          conflictReason: `Facility (${parentFacility.name}) is undergoing maintenance.`
        };
      }
      if (resource.status !== 'AVAILABLE') {
        return {
          resource,
          facilityName: resource.facilityName,
          isAvailable: false,
          conflictReason: `Resource status is ${resource.status.toLowerCase()}.`
        };
      }

      // Check operating hours of parent facility
      if (parentFacility?.operatingHours) {
        if (params.startTime < parentFacility.operatingHours.open || params.endTime > parentFacility.operatingHours.close) {
          return {
            resource,
            facilityName: resource.facilityName,
            isAvailable: false,
            conflictReason: `Outside facility operating hours (${parentFacility.operatingHours.open} - ${parentFacility.operatingHours.close}).`
          };
        }
      }

      // Check overlapping reservations
      const conflicts = reservations.filter(resv => {
        if (resv.resourceId !== resource.id) return false;
        if (resv.date !== params.date) return false;
        if (resv.status !== 'CONFIRMED' && resv.status !== 'PENDING') return false;

        // Overlap condition: (StartA < EndB) and (EndA > StartB)
        return (params.startTime < resv.endTime && params.endTime > resv.startTime);
      });

      if (conflicts.length > 0) {
        const conflict = conflicts[0];
        return {
          resource,
          facilityName: resource.facilityName,
          isAvailable: false,
          conflictReason: `Booked by ${conflict.userName} (${conflict.startTime} - ${conflict.endTime}).`
        };
      }

      return {
        resource,
        facilityName: resource.facilityName,
        isAvailable: true
      };
    });

    return results;
  },

  // USMG6-126: Create reservation request
  async createReservation(
    input: CreateReservationInput,
    userInfo: { id: string; name: string; email: string; role: string; department: string }
  ): Promise<Reservation> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...input, ...userInfo })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, creating reservation locally:', err);
      }
    }

    await simulateDelay();
    const resources = getStoredResources();
    const targetResource = resources.find(r => r.id === input.resourceId);
    if (!targetResource) {
      throw new Error('Resource not found.');
    }

    // Overlap validation
    const reservations = getStoredReservations();
    const hasOverlap = reservations.some(r => 
      r.resourceId === input.resourceId &&
      r.date === input.date &&
      (r.status === 'CONFIRMED' || r.status === 'PENDING') &&
      input.startTime < r.endTime &&
      input.endTime > r.startTime
    );

    if (hasOverlap) {
      throw new Error('Selected time slot overlaps with an existing reservation.');
    }

    const newReservation: Reservation = {
      id: `resv-${Date.now()}`,
      reservationNumber: `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      resourceId: targetResource.id,
      resourceName: targetResource.name,
      resourceType: targetResource.type,
      facilityId: targetResource.facilityId,
      facilityName: targetResource.facilityName,
      userId: userInfo.id,
      userName: userInfo.name,
      userEmail: userInfo.email,
      userRole: userInfo.role,
      department: userInfo.department,
      purpose: input.purpose,
      attendeesCount: input.attendeesCount,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      notes: input.notes,
      requiresApproval: targetResource.requiresApproval,
      // If resource does not require approval, auto-confirm!
      status: targetResource.requiresApproval ? 'PENDING' : 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reservations.unshift(newReservation);
    saveReservations(reservations);
    return newReservation;
  },

  // USMG6-127: Approve reservation
  async approveReservation(reservationId: string, reviewerName = 'Facility Manager', reviewNote?: string): Promise<Reservation> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewerName, reviewNote })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, approving reservation locally:', err);
      }
    }

    await simulateDelay();
    const reservations = getStoredReservations();
    const index = reservations.findIndex(r => r.id === reservationId);

    if (index === -1) {
      throw new Error(`Reservation ${reservationId} not found.`);
    }

    const updated: Reservation = {
      ...reservations[index],
      status: 'CONFIRMED',
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString(),
      notes: reviewNote ? `${reservations[index].notes || ''}\n[Approved Note]: ${reviewNote}`.trim() : reservations[index].notes,
      updatedAt: new Date().toISOString()
    };

    reservations[index] = updated;
    saveReservations(reservations);
    return updated;
  },

  // USMG6-127: Reject reservation
  async rejectReservation(reservationId: string, rejectionReason: string, reviewerName = 'Facility Manager'): Promise<Reservation> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rejectionReason, reviewerName })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, rejecting reservation locally:', err);
      }
    }

    await simulateDelay();
    const reservations = getStoredReservations();
    const index = reservations.findIndex(r => r.id === reservationId);

    if (index === -1) {
      throw new Error(`Reservation ${reservationId} not found.`);
    }

    const updated: Reservation = {
      ...reservations[index],
      status: 'REJECTED',
      rejectionReason,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reservations[index] = updated;
    saveReservations(reservations);
    return updated;
  },

  // USMG6-127 / USMG6-126: Cancel reservation
  async cancelReservation(reservationId: string, cancellationReason = 'User cancelled reservation'): Promise<Reservation> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cancellationReason })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, cancelling reservation locally:', err);
      }
    }

    await simulateDelay();
    const reservations = getStoredReservations();
    const index = reservations.findIndex(r => r.id === reservationId);

    if (index === -1) {
      throw new Error(`Reservation ${reservationId} not found.`);
    }

    const updated: Reservation = {
      ...reservations[index],
      status: 'CANCELLED',
      cancellationReason,
      updatedAt: new Date().toISOString()
    };

    reservations[index] = updated;
    saveReservations(reservations);
    return updated;
  }
};

import { Facility, CreateFacilityInput, UpdateFacilityInput, FacilityFilterParams, FacilityStatus } from '../types/facility';
import { getStoredFacilities, saveFacilities } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Delay simulation for realistic async UI states
const simulateDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const facilityService = {
  // Get all facilities with optional filters
  async getAllFacilities(params?: FacilityFilterParams): Promise<Facility[]> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.category) query.append('category', params.category);
        if (params?.status) query.append('status', params.status);
        const res = await fetch(`${API_BASE_URL}/api/facilities?${query.toString()}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend unavailable, using local store for facilities:', err);
      }
    }

    await simulateDelay();
    let facilities = getStoredFacilities();

    if (params?.search) {
      const q = params.search.toLowerCase();
      facilities = facilities.filter(
        f => f.name.toLowerCase().includes(q) ||
             f.code.toLowerCase().includes(q) ||
             f.location.toLowerCase().includes(q) ||
             f.building.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== 'ALL') {
      facilities = facilities.filter(f => f.category === params.category);
    }

    if (params?.status && params.status !== 'ALL') {
      facilities = facilities.filter(f => f.status === params.status);
    }

    return facilities;
  },

  // Get single facility by ID
  async getFacilityById(id: string): Promise<Facility | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/facilities/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fetching facility locally:', err);
      }
    }

    await simulateDelay();
    const facilities = getStoredFacilities();
    return facilities.find(f => f.id === id) || null;
  },

  // Create new facility (USMG6-122)
  async createFacility(input: CreateFacilityInput): Promise<Facility> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/facilities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, creating facility locally:', err);
      }
    }

    await simulateDelay();
    const facilities = getStoredFacilities();

    // Check duplicate code
    if (facilities.some(f => f.code.toUpperCase() === input.code.toUpperCase())) {
      throw new Error(`Facility with code "${input.code}" already exists.`);
    }

    const newFacility: Facility = {
      ...input,
      id: `fac-${Date.now()}`,
      code: input.code.toUpperCase().trim(),
      totalResourcesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
    };

    facilities.unshift(newFacility);
    saveFacilities(facilities);
    return newFacility;
  },

  // Update existing facility (USMG6-122)
  async updateFacility(id: string, input: UpdateFacilityInput): Promise<Facility> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/facilities/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, updating facility locally:', err);
      }
    }

    await simulateDelay();
    const facilities = getStoredFacilities();
    const index = facilities.findIndex(f => f.id === id);

    if (index === -1) {
      throw new Error(`Facility with ID ${id} not found.`);
    }

    const updated: Facility = {
      ...facilities[index],
      ...input,
      code: input.code ? input.code.toUpperCase().trim() : facilities[index].code,
      updatedAt: new Date().toISOString()
    };

    facilities[index] = updated;
    saveFacilities(facilities);
    return updated;
  },

  // Toggle or set facility status (USMG6-122)
  async updateFacilityStatus(id: string, status: FacilityStatus): Promise<Facility> {
    return this.updateFacility(id, { status });
  },

  // Delete facility
  async deleteFacility(id: string): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/facilities/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend unavailable, deleting facility locally:', err);
      }
    }

    await simulateDelay();
    let facilities = getStoredFacilities();
    facilities = facilities.filter(f => f.id !== id);
    saveFacilities(facilities);
    return true;
  }
};

import { Resource, CreateResourceInput, UpdateResourceInput, ResourceFilterParams, ResourceStatus } from '../types/resource';
import { getStoredResources, saveResources, getStoredFacilities, saveFacilities } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const simulateDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const resourceService = {
  // Get all resources with optional filters
  async getAllResources(params?: ResourceFilterParams): Promise<Resource[]> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.facilityId) query.append('facilityId', params.facilityId);
        if (params?.type) query.append('type', params.type);
        if (params?.status) query.append('status', params.status);
        const res = await fetch(`${API_BASE_URL}/api/resources?${query.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, using local resources store:', err);
      }
    }

    await simulateDelay();
    let resources = getStoredResources();

    if (params?.facilityId && params.facilityId !== 'ALL') {
      resources = resources.filter(r => r.facilityId === params.facilityId);
    }

    if (params?.type && params.type !== 'ALL') {
      resources = resources.filter(r => r.type === params.type);
    }

    if (params?.status && params.status !== 'ALL') {
      resources = resources.filter(r => r.status === params.status);
    }

    if (params?.requiresApproval !== undefined) {
      resources = resources.filter(r => r.requiresApproval === params.requiresApproval);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      resources = resources.filter(
        r => r.name.toLowerCase().includes(q) ||
             r.code.toLowerCase().includes(q) ||
             r.facilityName.toLowerCase().includes(q) ||
             r.specs.some(s => s.toLowerCase().includes(q))
      );
    }

    return resources;
  },

  // Get single resource by ID
  async getResourceById(id: string): Promise<Resource | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, fetching resource locally:', err);
      }
    }

    await simulateDelay();
    const resources = getStoredResources();
    return resources.find(r => r.id === id) || null;
  },

  // Create new resource (USMG6-123)
  async createResource(input: CreateResourceInput): Promise<Resource> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, creating resource locally:', err);
      }
    }

    await simulateDelay();
    const resources = getStoredResources();

    if (resources.some(r => r.code.toUpperCase() === input.code.toUpperCase())) {
      throw new Error(`Resource with code "${input.code}" already exists.`);
    }

    const newResource: Resource = {
      ...input,
      id: `res-${Date.now()}`,
      code: input.code.toUpperCase().trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80'
    };

    resources.unshift(newResource);
    saveResources(resources);

    // Update parent facility's resource count
    const facilities = getStoredFacilities();
    const facIndex = facilities.findIndex(f => f.id === input.facilityId);
    if (facIndex !== -1) {
      facilities[facIndex].totalResourcesCount = (facilities[facIndex].totalResourcesCount || 0) + 1;
      saveFacilities(facilities);
    }

    return newResource;
  },

  // Update resource (USMG6-123)
  async updateResource(id: string, input: UpdateResourceInput): Promise<Resource> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend unavailable, updating resource locally:', err);
      }
    }

    await simulateDelay();
    const resources = getStoredResources();
    const index = resources.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error(`Resource with ID ${id} not found.`);
    }

    const updated: Resource = {
      ...resources[index],
      ...input,
      code: input.code ? input.code.toUpperCase().trim() : resources[index].code,
      updatedAt: new Date().toISOString()
    };

    resources[index] = updated;
    saveResources(resources);
    return updated;
  },

  // Set resource status
  async updateResourceStatus(id: string, status: ResourceStatus): Promise<Resource> {
    return this.updateResource(id, { status });
  },

  // Delete resource
  async deleteResource(id: string): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resources/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) return true;
      } catch (err) {
        console.warn('Backend unavailable, deleting resource locally:', err);
      }
    }

    await simulateDelay();
    let resources = getStoredResources();
    const target = resources.find(r => r.id === id);
    resources = resources.filter(r => r.id !== id);
    saveResources(resources);

    if (target) {
      const facilities = getStoredFacilities();
      const facIndex = facilities.findIndex(f => f.id === target.facilityId);
      if (facIndex !== -1 && (facilities[facIndex].totalResourcesCount || 0) > 0) {
        facilities[facIndex].totalResourcesCount = (facilities[facIndex].totalResourcesCount || 1) - 1;
        saveFacilities(facilities);
      }
    }

    return true;
  }
};

export type FacilityStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface OperatingHours {
  open: string;  // e.g. "08:00"
  close: string; // e.g. "21:00"
  days: string[]; // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}

export interface Facility {
  id: string;
  code: string; // e.g. "ENG-BLD-01"
  name: string; // e.g. "Engineering Research Complex"
  category: 'ACADEMIC' | 'LABORATORY' | 'SPORTS' | 'AUDITORIUM' | 'LIBRARY' | 'STUDENT_CENTER';
  building: string; // e.g. "Block E"
  floor: string; // e.g. "3rd Floor"
  location: string; // e.g. "North Campus, Innovation Hub"
  capacity: number;
  description: string;
  status: FacilityStatus;
  operatingHours: OperatingHours;
  contactEmail: string;
  contactPhone: string;
  amenities: string[];
  imageUrl?: string;
  totalResourcesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacilityInput {
  code: string;
  name: string;
  category: Facility['category'];
  building: string;
  floor: string;
  location: string;
  capacity: number;
  description: string;
  status: FacilityStatus;
  operatingHours: OperatingHours;
  contactEmail: string;
  contactPhone: string;
  amenities: string[];
  imageUrl?: string;
}

export type UpdateFacilityInput = Partial<CreateFacilityInput>;

export interface FacilityFilterParams {
  search?: string;
  category?: string;
  status?: string;
}

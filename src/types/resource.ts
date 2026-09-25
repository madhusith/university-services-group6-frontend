export type ResourceType = 'ROOM' | 'LAB' | 'HALL' | 'EQUIPMENT' | 'STUDIO' | 'SPORTS_COURT';

export type ResourceStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'OFFLINE';

export interface Resource {
  id: string;
  code: string; // e.g. "LAB-CS-302"
  name: string; // e.g. "AI & Robotics Lab Workstation"
  facilityId: string;
  facilityName: string;
  type: ResourceType;
  capacity: number;
  quantity: number;
  status: ResourceStatus;
  requiresApproval: boolean;
  specs: string[]; // e.g. ["NVIDIA RTX 4090 GPUs", "3D Printers", "Dual 4K Monitors"]
  hourlyRate?: number;
  imageUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceInput {
  code: string;
  name: string;
  facilityId: string;
  facilityName: string;
  type: ResourceType;
  capacity: number;
  quantity: number;
  status: ResourceStatus;
  requiresApproval: boolean;
  specs: string[];
  hourlyRate?: number;
  description: string;
  imageUrl?: string;
}

export type UpdateResourceInput = Partial<CreateResourceInput>;

export interface ResourceFilterParams {
  search?: string;
  facilityId?: string;
  type?: string;
  status?: string;
  requiresApproval?: boolean;
}

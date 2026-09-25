export type UserRole = 'STUDENT' | 'STAFF' | 'FACULTY' | 'FACILITY_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  studentStaffId: string;
}

export interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
  hasRole: (roles: UserRole[]) => boolean;
}

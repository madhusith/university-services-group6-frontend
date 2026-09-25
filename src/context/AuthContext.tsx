import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, AuthContextType } from '../types/auth';

const PRESET_USERS: Record<UserRole, User> = {
  FACILITY_MANAGER: {
    id: 'user-mgr-01',
    name: 'Dr. Chathura Samarasekara',
    email: 'chathura.s@uni.ac.lk',
    role: 'FACILITY_MANAGER',
    department: 'Estate & Facility Management Directorate',
    studentStaffId: 'STF-FAC-8821',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  ADMIN: {
    id: 'user-adm-01',
    name: 'Lakshan Wickramasinghe',
    email: 'admin.support@uni.ac.lk',
    role: 'ADMIN',
    department: 'University Central IT & Infrastructure',
    studentStaffId: 'ADM-SYS-1002',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  FACULTY: {
    id: 'user-fac-01',
    name: 'Prof. Senaka Mendis',
    email: 'senaka.m@uni.ac.lk',
    role: 'FACULTY',
    department: 'Department of Electrical & Electronic Engineering',
    studentStaffId: 'STF-ENG-4512',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  STAFF: {
    id: 'user-stf-02',
    name: 'Priyantha De Silva',
    email: 'priyantha.d@uni.ac.lk',
    role: 'STAFF',
    department: 'Campus Security & Estate Operations',
    studentStaffId: 'STF-OPS-3310',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  STUDENT: {
    id: 'user-stu-01',
    name: 'Thanushika Madhusith',
    email: 'thanushika.m@student.uni.ac.lk',
    role: 'STUDENT',
    department: 'Software Engineering (Faculty of Computing)',
    studentStaffId: 'IT21849204',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'group6_active_user_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return (saved as UserRole) || 'FACILITY_MANAGER';
  });

  const currentUser = PRESET_USERS[currentRole] || PRESET_USERS.FACILITY_MANAGER;

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    localStorage.setItem(AUTH_STORAGE_KEY, newRole);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        availableUsers: Object.values(PRESET_USERS),
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

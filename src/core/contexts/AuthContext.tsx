import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types/global';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { mockAdminUser, mockStudentUser } from '../../features/auth/constants/mockData';

interface AuthContextType { user: User | null; loginDemo: (role: Role, specificUser?: User | null) => void; logout: () => void; updateProfile: (data: Partial<User>) => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => StorageService.getSession());
  useEffect(() => { const session = StorageService.getSession(); if (session) setUser(session); }, []);
  const loginDemo = (role: Role, specificUser?: User | null) => {
    const mockUser: User = specificUser || (role === 'admin' ? mockAdminUser : mockStudentUser);
    setUser(mockUser); StorageService.saveSession(mockUser);
  };
  const logout = () => { setUser(null); StorageService.clearSession(); };
  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      StorageService.saveSession(updatedUser);
      // Cập nhật cả trong danh sách users nếu cần
      const users = await StorageService.getUsers();
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      // Cập nhật lên Supabase
      await StorageService.updateUser(updatedUser);
    }
  };
  return <AuthContext.Provider value={{ user, loginDemo, logout, updateProfile }}>{children}</AuthContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error(''); return ctx; };


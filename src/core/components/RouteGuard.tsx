import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/global';
export const RouteGuard: React.FC<{children: React.ReactNode; allowedRoles: Role[]}> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user && allowedRoles.includes('guest')) return <>{children}</>;
  if (!user && !allowedRoles.includes('guest')) return <Navigate to="/" replace />;
  if (user && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'student') return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/global';
import { useData } from '../contexts/DataContext';
import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
export const RouteGuard: React.FC<{children: React.ReactNode; allowedRoles: Role[]}> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const { systemSettings } = useData();

  if (systemSettings?.maintenanceMode && user?.role !== 'admin') {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC', p: 3, textAlign: 'center' }}>
        <ConstructionIcon sx={{ fontSize: 80, color: '#F59E0B', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>Hệ Thống Đang Bảo Trì</Typography>
        <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 500 }}>
          Xin lỗi vì sự bất tiện này. Chúng tôi đang tiến hành bảo trì và nâng cấp hệ thống. Vui lòng quay lại sau!
        </Typography>
      </Box>
    );
  }

  if (!user && allowedRoles.includes('guest')) return <>{children}</>;
  if (!user && !allowedRoles.includes('guest')) return <Navigate to="/" replace />;
  if (user && !allowedRoles.includes(user.role)) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'student') return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';

const menuItems = [
  { id: 'overview', label: 'Tổng quan', icon: <DashboardRoundedIcon fontSize="small" /> },
  { id: 'courses', label: 'Quản lý khóa học', icon: <SchoolRoundedIcon fontSize="small" /> },
  { id: 'videos', label: 'Quản lý bài giảng', icon: <VideoLibraryRoundedIcon fontSize="small" /> },
  { id: 'exams', label: 'Quản lý đề thi', icon: <AssignmentRoundedIcon fontSize="small" /> },
  { id: 'documents', label: 'Quản lý tài liệu', icon: <DescriptionRoundedIcon fontSize="small" /> },
  { id: 'students', label: 'Quản lý học viên', icon: <PeopleRoundedIcon fontSize="small" /> },
  { id: 'codes', label: 'Mã kích hoạt', icon: <VpnKeyRoundedIcon fontSize="small" /> },
  { id: 'orders', label: 'Quản lý đơn hàng', icon: <ShoppingCartRoundedIcon fontSize="small" /> },
  { id: 'tuition', label: 'Quản lý học phí', icon: <PaymentsRoundedIcon fontSize="small" /> },
  { id: 'stats', label: 'Thống kê & Báo cáo', icon: <BarChartRoundedIcon fontSize="small" /> },
  { id: 'settings', label: 'Cài đặt hệ thống', icon: <SettingsRoundedIcon fontSize="small" /> },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        bgcolor: '#1A2035',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '4px 0 16px rgba(0,0,0,0.12)',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          pt: 3,
          pb: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
          '&:hover': { opacity: 0.8 },
        }}
        onClick={() => navigate('/')}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ height: 26, filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.05rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            background: 'linear-gradient(135deg, #FF8C2F, #FFB86C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MVA Study
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ mx: 2, mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 40, height: 40,
              bgcolor: '#FF8C2F',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: '2px solid rgba(255,140,47,0.35)',
              boxShadow: '0 2px 8px rgba(255,140,47,0.25)',
            }}
          >
            {!user?.avatar && (user?.name?.split(' ').pop()?.charAt(0) || 'A')}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontFamily: '"Plus Jakarta Sans", sans-serif', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Quản trị viên'}
            </Typography>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.4,
              bgcolor: 'rgba(255,140,47,0.15)', color: '#FF8C2F',
              px: 1, py: 0.2, borderRadius: '999px', mt: 0.3,
            }}>
              <AdminPanelSettingsRoundedIcon sx={{ fontSize: 11 }} />
              <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 2 }} />

      {/* Menu */}
      <List sx={{ flex: 1, px: 1.5, py: 1.5 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.4 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => onTabChange(item.id)}
                sx={{
                  borderRadius: '12px',
                  py: 1.1,
                  px: 1.6,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 140, 47, 0.14)',
                    color: '#FF8C2F',
                    '& .MuiListItemIcon-root': { color: '#FF8C2F' },
                    '&:hover': { bgcolor: 'rgba(255, 140, 47, 0.20)' },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0, top: '20%', bottom: '20%',
                      width: '3px',
                      bgcolor: '#FF8C2F',
                      borderRadius: '0 4px 4px 0',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: isActive ? '#FF8C2F' : '#94a3b8', transition: 'color 0.2s' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.83rem',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: isActive ? '#FF8C2F' : '#94a3b8',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 3 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 1.5 }} />
        <ListItemButton
          onClick={() => { logout(); navigate('/'); }}
          sx={{
            borderRadius: '12px',
            py: 1.1,
            px: 1.6,
            color: '#F87171',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.10)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: '#F87171' }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

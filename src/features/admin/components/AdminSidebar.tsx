import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';

const menuItems = [
  { id: 'overview', label: 'Tổng quan', icon: <DashboardIcon /> },
  { id: 'courses', label: 'Quản lý khóa học', icon: <SchoolIcon /> },
  { id: 'videos', label: 'Quản lý bài giảng', icon: <VideoLibraryIcon /> },
  { id: 'exams', label: 'Quản lý đề thi', icon: <AssignmentIcon /> },
  { id: 'documents', label: 'Quản lý tài liệu', icon: <DescriptionIcon /> },
  { id: 'students', label: 'Quản lý học viên', icon: <PeopleIcon /> },
  { id: 'codes', label: 'Mã kích hoạt', icon: <VpnKeyIcon /> },
  { id: 'orders', label: 'Quản lý đơn hàng', icon: <ShoppingCartIcon /> },
  { id: 'stats', label: 'Thống kê & Báo cáo', icon: <BarChartIcon /> },
  { id: 'settings', label: 'Cài đặt hệ thống', icon: <SettingsIcon /> },
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
        bgcolor: '#1A202C',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ height: 28 }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#FF8C2F',
          }}
        >
          MVA Study
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={user?.avatar}
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#FF8C2F',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {!user?.avatar && (user?.name?.split(' ').pop()?.charAt(0) || 'A')}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'Quản trị viên'}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Quản trị viên
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Menu */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => onTabChange(item.id)}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  px: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 140, 47, 0.15)',
                    color: '#FF8C2F',
                    '& .MuiListItemIcon-root': { color: '#FF8C2F' },
                    '&:hover': { bgcolor: 'rgba(255, 140, 47, 0.2)' },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#FF8C2F' : 'rgba(255,255,255,0.5)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />
        <ListItemButton
          onClick={() => { logout(); navigate('/'); }}
          sx={{
            borderRadius: 1,
            py: 1.2,
            px: 1.5,
            color: '#EF4444',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#EF4444' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

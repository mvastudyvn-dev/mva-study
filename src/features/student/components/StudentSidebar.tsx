import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import QuizIcon from '@mui/icons-material/Quiz';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';

const menuItems = [
  { id: 'overview', label: 'Trang chủ', icon: <HomeIcon /> },
  { id: 'courses', label: 'Khóa học của tôi', icon: <SchoolIcon /> },
  { id: 'videos', label: 'Bài giảng', icon: <VideoLibraryIcon /> },
  { id: 'exams', label: 'Đề thi thử', icon: <AssignmentIcon /> },
  { id: 'documents', label: 'Tài liệu', icon: <DescriptionIcon /> },
  { id: 'tuition', label: 'Học phí', icon: <MenuBookIcon /> },

  { id: 'notifications', label: 'Thông báo', icon: <NotificationsIcon /> },
  { id: 'settings', label: 'Cài đặt tài khoản', icon: <SettingsIcon /> },
];

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        bgcolor: '#fff',
        borderRight: '1px solid #ECECEC',
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
            background: 'linear-gradient(135deg, #FF8C2F, #FF6B00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
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
          {!user?.avatar && (user?.name?.split(' ').pop()?.charAt(0) || 'U')}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.name || 'Học viên'}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF' }}>
            Học viên
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Menu */}
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => onTabChange(item.id)}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 1.5,
                  '&.Mui-selected': {
                    bgcolor: '#FFF3E8',
                    color: '#FF8C2F',
                    '& .MuiListItemIcon-root': { color: '#FF8C2F' },
                    '&:hover': { bgcolor: '#FFE8D4' },
                  },
                  '&:hover': {
                    bgcolor: '#FFF8F2',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#FF8C2F' : '#6B7280' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <ListItemButton
          onClick={() => { logout(); navigate('/'); }}
          sx={{
            borderRadius: 1,
            py: 1,
            px: 1.5,
            color: '#EF4444',
            '&:hover': { bgcolor: '#FEF2F2' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#EF4444' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Đăng xuất
              </Typography>
            }
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

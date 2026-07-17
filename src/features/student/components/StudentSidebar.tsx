import React from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Badge, Tooltip
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo1.png';

const menuItems = [
  { id: 'overview', label: 'Trang chủ', icon: <HomeRoundedIcon fontSize="small" /> },
  { id: 'courses', label: 'Khóa học của tôi', icon: <SchoolRoundedIcon fontSize="small" /> },
  { id: 'videos', label: 'Bài giảng', icon: <VideoLibraryRoundedIcon fontSize="small" /> },
  { id: 'exams', label: 'Đề thi thử', icon: <AssignmentRoundedIcon fontSize="small" /> },
  { id: 'documents', label: 'Tài liệu', icon: <DescriptionRoundedIcon fontSize="small" /> },
  { id: 'tuition', label: 'Học phí', icon: <PaymentsRoundedIcon fontSize="small" /> },
  { id: 'notifications', label: 'Thông báo', icon: <NotificationsRoundedIcon fontSize="small" /> },
  { id: 'settings', label: 'Cài đặt tài khoản', icon: <SettingsRoundedIcon fontSize="small" /> },
];

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingTuitionCount, setPendingTuitionCount] = React.useState(0);

  React.useEffect(() => {
    if (user?.id) {
      fetch(`/api/payment/tuition/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const pending = data.filter(inv => inv.status === 'pending');
            setPendingTuitionCount(pending.length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
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
          '&:hover': { opacity: 0.85 },
        }}
        onClick={() => navigate('/')}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ height: 28 }} />
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: '1.05rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            background: 'linear-gradient(135deg, #FF8C2F, #FF6B00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MVA Study
        </Typography>
      </Box>

      {/* User Info Card */}
      <Box sx={{ mx: 2, mb: 2, p: 2, bgcolor: '#FFF8F2', borderRadius: '14px', border: '1px solid rgba(255,140,47,0.12)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 40, height: 40,
              bgcolor: '#FF8C2F',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: '2px solid rgba(255,140,47,0.25)',
              boxShadow: '0 2px 8px rgba(255,140,47,0.20)',
            }}
          >
            {!user?.avatar && (user?.name?.split(' ').pop()?.charAt(0) || 'U')}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Học viên'}
            </Typography>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.4,
              bgcolor: 'rgba(255,140,47,0.12)', color: '#FF8C2F',
              px: 1, py: 0.2, borderRadius: '999px', mt: 0.3,
            }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Học viên
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mx: 2.5, borderColor: 'rgba(0,0,0,0.05)' }} />

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
                    bgcolor: '#FFF3E8',
                    color: '#FF8C2F',
                    '& .MuiListItemIcon-root': { color: '#FF8C2F' },
                    '&:hover': { bgcolor: '#FFE8D4' },
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
                    bgcolor: '#FFF8F2',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: isActive ? '#FF8C2F' : '#9CA3AF', transition: 'color 0.2s' }}>
                  {item.id === 'tuition' ? (
                    <Badge badgeContent={pendingTuitionCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 14, height: 14 } }}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: isActive ? '#FF8C2F' : '#374151',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 3 }}>
        <Divider sx={{ mb: 1.5, borderColor: 'rgba(0,0,0,0.05)' }} />
        <ListItemButton
          onClick={() => { logout(); navigate('/'); }}
          sx={{
            borderRadius: '12px',
            py: 1.1,
            px: 1.6,
            color: '#EF4444',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: '#FEF2F2' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 34, color: '#EF4444' }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

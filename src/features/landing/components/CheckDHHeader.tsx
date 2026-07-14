import React from 'react';
import { AppBar, Toolbar, Box, Container, Typography, Button } from '@mui/material';
import logo from '../../../assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';

export const CheckDHHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px !important' }}>
          {/* Left: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box component="img" src={logo} alt="MVA Study Logo" sx={{ height: 32, objectFit: 'contain' }} />
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#FF8C2F', lineHeight: 1 }}>
                MVA Uni
              </Typography>
            </Box>
          </Box>

          {/* Center: Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <Typography sx={{ color: '#4B5563', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }} onClick={() => navigate('/')}>
              Trang chủ
            </Typography>
            <Typography sx={{ color: '#4B5563', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
              Điểm chuẩn 2026
            </Typography>
            <Typography sx={{ color: '#4B5563', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
              Lịch xét tuyển 2027
            </Typography>
          </Box>

          {/* Right: Login Button or User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!user ? (
              <Button
                variant="outlined"
                onClick={() => navigate('/login', { state: { from: '/uni' } })}
                sx={{
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  borderRadius: '50px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  bgcolor: '#fff',
                  '&:hover': {
                    borderColor: '#D1D5DB',
                    bgcolor: '#F9FAFB'
                  }
                }}
              >
                Đăng nhập
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}
                  sx={{
                    borderColor: '#FF8C2F',
                    color: '#FF8C2F',
                    fontWeight: 600,
                    borderRadius: '50px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    bgcolor: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(255, 140, 47, 0.05)'
                    }
                  }}
                >
                  Đến Hệ thống
                </Button>
                <Button
                  onClick={logout}
                  sx={{ color: '#EF4444', fontWeight: 600, textTransform: 'none' }}
                >
                  Đăng xuất
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

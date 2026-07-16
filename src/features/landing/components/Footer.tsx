import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Grid, IconButton, Stack } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useData } from '../../../core/contexts/DataContext';
import logo from '../../../assets/logo1.png';

export const Footer: React.FC = () => {
  const { systemSettings } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (id: string, path: string = '/') => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#FF8C2F', color: '#fff', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Logo & Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box component="img" src={logo} alt="Logo" sx={{ height: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                {systemSettings?.contactName || 'MVA Study'}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '0.8rem', opacity: 0.9, mb: 2, lineHeight: 1.6 }}>
              Học tin học – Vững tương lai
            </Typography>
            <Stack direction="row" alignItems="flex-start" spacing={1} mb={1}>
              <LocationOnIcon sx={{ fontSize: 16, mt: 0.3, opacity: 0.9 }} />
              <Typography sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Việt Nam
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <PhoneIcon sx={{ fontSize: 16, opacity: 0.9 }} />
              <Typography sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {systemSettings?.contactPhone || '0123 456 789'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon sx={{ fontSize: 16, opacity: 0.9 }} />
              <Typography sx={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {systemSettings?.contactEmail || 'info@mvastudy.vn'}
              </Typography>
            </Stack>
          </Grid>

          {/* Liên kết nhanh */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
              Liên kết nhanh
            </Typography>
            {[
              { label: 'Trang chủ', action: () => location.pathname !== '/' ? navigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { label: 'Khóa học', action: () => navigate('/courses') },
              { label: 'Giảng viên', action: () => handleNavigation('section-teachers') },
              { label: 'Tiện ích', action: () => navigate('/uni') }
            ].map((item) => (
              <Typography
                key={item.label}
                onClick={item.action}
                sx={{
                  fontSize: '0.8rem',
                  opacity: 0.9,
                  mb: 1,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>

          {/* Chính sách */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
              Chính sách
            </Typography>
            {[
              { label: 'Chính sách bảo mật', path: '/privacy-policy' },
              { label: 'Điều khoản sử dụng', path: '/terms-of-use' },
              { label: 'Chính sách thanh toán', path: '/payment-policy' }
            ].map((item) => (
              <Typography
                key={item.label}
                onClick={() => item.path !== '#' && navigate(item.path)}
                sx={{
                  fontSize: '0.8rem',
                  opacity: 0.9,
                  mb: 1,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>

          {/* Social */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
              Kết nối với MVA Study
            </Typography>
            <Box display="flex" gap={1}>
              {[FacebookIcon, YouTubeIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    width: 36,
                    height: 36,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.3)',
            pt: 2,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
            © 2026 {systemSettings?.contactName || 'MVA Study'}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

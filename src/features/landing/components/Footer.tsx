import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Grid, IconButton, Stack, Divider } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
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

  const quickLinks = [
    { label: 'Trang chủ', action: () => location.pathname !== '/' ? navigate('/') : window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Khóa học', action: () => navigate('/courses') },
    { label: 'Giảng viên', action: () => handleNavigation('section-teachers') },
    { label: 'Tiện ích', action: () => handleNavigation('section-partners') },
  ];

  const policies = [
    { label: 'Chính sách bảo mật', path: '/privacy-policy' },
    { label: 'Điều khoản sử dụng', path: '/terms-of-use' },
    { label: 'Chính sách thanh toán', path: '/payment-policy' },
  ];

  const linkStyle = {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    lineHeight: 1,
    '&:hover': {
      color: 'rgba(255,255,255,0.90)',
      paddingLeft: '4px',
    },
  };

  return (
    <Box
      sx={{
        bgcolor: '#111827',
        color: '#fff',
        pt: 8,
        pb: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box sx={{
        position: 'absolute', top: '-20%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.04) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.03) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={5} sx={{ mb: 6 }}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Logo + Name */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
              <Box component="img" src={logo} alt="Logo" sx={{ height: 30, filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #FF8C2F, #FFB86C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  whiteSpace: 'nowrap',
                }}
              >
                {systemSettings?.contactName || 'MVA Study'}
              </Typography>
            </Stack>

            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, mb: 3, maxWidth: 280 }}>
              Nền tảng học tin học trực tuyến hàng đầu — chất lượng, tận tâm, hiệu quả.
            </Typography>

            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { icon: <LocationOnRoundedIcon sx={{ fontSize: 16 }} />, text: 'Việt Nam' },
                { icon: <PhoneRoundedIcon sx={{ fontSize: 16 }} />, text: systemSettings?.contactPhone || '0123 456 789' },
                { icon: <EmailRoundedIcon sx={{ fontSize: 16 }} />, text: systemSettings?.contactEmail || 'info@mvastudy.vn' },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box sx={{ color: '#FF8C2F', flexShrink: 0 }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Liên kết nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {quickLinks.map((item) => (
                <Typography key={item.label} onClick={item.action} sx={linkStyle}>
                  {item.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Policies */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Chính sách
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {policies.map((item) => (
                <Typography key={item.label} onClick={() => navigate(item.path)} sx={linkStyle}>
                  {item.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Social */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 3, fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Kết nối với chúng tôi
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
              {[
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: YouTubeIcon, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <IconButton
                  key={label}
                  aria-label={label}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.65)',
                    width: 40, height: 40,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,140,47,0.15)',
                      color: '#FF8C2F',
                      borderColor: 'rgba(255,140,47,0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </IconButton>
              ))}
            </Box>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255,140,47,0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(255,140,47,0.12)',
              }}
            >
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                📚 Đang hoạt động tại Việt Nam • Hỗ trợ 24/7
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            © 2026 {systemSettings?.contactName || 'MVA Study'}. All rights reserved.
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
            Made with ❤️ in Vietnam
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 55%, #FFF3E8 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 6,
        px: 3,
      }}
    >
      {/* Background decorations */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.10) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.07) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      {/* Grid pattern */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,140,47,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* 404 Number */}
        <Typography
          sx={{
            fontSize: { xs: '7rem', md: '10rem' },
            fontWeight: 900,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 50%, #FFB86C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            mb: 0,
          }}
        >
          404
        </Typography>

        {/* Illustration emoji */}
        <Box sx={{ fontSize: '4rem', mb: 3, mt: -1 }}>
          🗺️
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#0F172A',
            mb: 1.5,
            fontSize: { xs: '1.5rem', md: '1.8rem' },
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            letterSpacing: '-0.025em',
          }}
        >
          Oops! Trang không tìm thấy
        </Typography>

        <Typography
          sx={{
            color: '#64748B',
            mb: 5,
            fontSize: '1rem',
            lineHeight: 1.75,
            maxWidth: 380,
            mx: 'auto',
          }}
        >
          Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại.
        </Typography>

        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeRoundedIcon />}
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
              color: '#fff',
              fontWeight: 700,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              borderRadius: '14px',
              px: '28px',
              py: '13px',
              fontSize: '0.95rem',
              boxShadow: '0 8px 28px rgba(255,140,47,0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                boxShadow: '0 12px 36px rgba(255,140,47,0.45)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: '14px',
              borderWidth: '1.5px',
              borderColor: 'rgba(0,0,0,0.10)',
              color: '#374151',
              fontWeight: 700,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              px: '24px',
              py: '12px',
              fontSize: '0.95rem',
              transition: 'all 0.25s ease',
              '&:hover': {
                borderWidth: '1.5px',
                borderColor: 'rgba(255,140,47,0.4)',
                color: '#FF8C2F',
                bgcolor: 'rgba(255,140,47,0.04)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;

import React from 'react';
import { Box, Container, Typography, Button, Grid, Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useNavigate } from 'react-router-dom';

const bulletPoints = [
  'Bài giảng dễ hiểu',
  'Học mọi lúc, mọi nơi',
  'Giáo viên tận tâm',
  'Hỗ trợ giải đáp 24/7',
];

const statsRow = [
  { icon: <PeopleRoundedIcon sx={{ fontSize: 18 }} />, value: '1.200+', label: 'Học viên' },
  { icon: <EmojiEventsRoundedIcon sx={{ fontSize: 18 }} />, value: '98%', label: 'Pass rate' },
  { icon: <StarRoundedIcon sx={{ fontSize: 18 }} />, value: '4.9 ⭐', label: 'Đánh giá' },
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 55%, #FFF3E8 100%)',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
      }}
    >
      {/* Decorative background blobs */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: { xs: 300, md: 500 },
        height: { xs: 300, md: 500 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.12) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-15%',
        right: '-5%',
        width: { xs: 250, md: 450 },
        height: { xs: 250, md: 450 },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      {/* Subtle grid pattern */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,140,47,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Left: Text Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Label chip */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 2,
                py: 0.8,
                bgcolor: 'rgba(255,140,47,0.10)',
                borderRadius: '999px',
                border: '1px solid rgba(255,140,47,0.20)',
                mb: 3,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 16, color: '#FF8C2F' }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em' }}>
                Nền tảng học tin học hàng đầu Việt Nam
              </Typography>
            </Box>

            {/* Main Heading */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                color: '#0F172A',
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                lineHeight: 1.1,
                mb: 1,
                letterSpacing: '-0.03em',
              }}
            >
              Học Tin Học
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 60%, #FFB86C 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dễ Dàng Hơn
            </Typography>
            <Typography
              sx={{
                color: '#64748B',
                fontSize: { xs: '1.05rem', md: '1.15rem' },
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 480,
              }}
            >
              Hệ thống học trực tuyến chất lượng cao của{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#FF8C2F' }}>MVA Study</Box>
              {' '}— nơi kiến thức gặp đam mê.
            </Typography>

            {/* Bullet Points */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 5, maxWidth: 460 }}>
              {bulletPoints.map((point) => (
                <Box key={point} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#FF8C2F', flexShrink: 0 }} />
                  <Typography sx={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/courses')}
                sx={{
                  background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  borderRadius: '14px',
                  px: '28px',
                  py: '14px',
                  fontSize: '1rem',
                  boxShadow: '0 8px 28px rgba(255,140,47,0.35)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                    boxShadow: '0 12px 36px rgba(255,140,47,0.45)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Khám phá khóa học
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#374151',
                  fontWeight: 600,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  borderRadius: '14px',
                  px: '24px',
                  py: '13px',
                  fontSize: '1rem',
                  border: '1.5px solid rgba(0,0,0,0.10)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: '#fff',
                    borderColor: 'rgba(255,140,47,0.4)',
                    color: '#FF8C2F',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  },
                }}
              >
                Đăng nhập →
              </Button>
            </Box>

            {/* Stats Row */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                pt: 3,
                borderTop: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {statsRow.map((stat) => (
                <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: '#FF8C2F' }}>{stat.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.2 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right: Illustration Card */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', width: 460, height: 420 }}>
              {/* Main card */}
              <Box
                sx={{
                  width: 420,
                  height: 340,
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,242,0.90) 100%)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,140,47,0.15)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 8px 24px rgba(255,140,47,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Orange top accent line */}
                <Box sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #FF8C2F, #FFB86C, #FF6B00)',
                }} />

                {/* Inner video preview */}
                <Box
                  sx={{
                    width: 360,
                    height: 280,
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #FFF3E8 0%, #FFE8D4 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    border: '1px solid rgba(255,140,47,0.10)',
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: '#FF8C2F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 28px rgba(255,140,47,0.40)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.08)', boxShadow: '0 12px 36px rgba(255,140,47,0.50)' },
                    }}
                  >
                    <PlayCircleFilledWhiteIcon sx={{ fontSize: 40, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Xem bài giảng demo miễn phí
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['Word', 'Excel', 'PowerPoint', 'IC3'].map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,140,47,0.12)',
                          color: '#FF8C2F',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          border: 'none',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Floating badge — bottom right */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: -20,
                  bgcolor: '#fff',
                  borderRadius: '16px',
                  px: 2.5,
                  py: 1.5,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  animation: 'float 4s ease-in-out infinite',
                }}
              >
                <Typography sx={{ fontSize: '1.8rem' }}>🎓</Typography>
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.3 }}>Học viên đang học</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.3 }}>1,200+</Typography>
                </Box>
              </Box>

              {/* Floating badge — top left */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: -20,
                  bgcolor: '#fff',
                  borderRadius: '14px',
                  px: 2,
                  py: 1.2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  animation: 'float 5s ease-in-out infinite 1s',
                }}
              >
                <Box sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <EmojiEventsRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF', lineHeight: 1.2 }}>Pass rate</Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.2 }}>98%</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

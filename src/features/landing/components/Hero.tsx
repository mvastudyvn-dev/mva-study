import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { keyframes } from '@emotion/react';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CodeIcon from '@mui/icons-material/Code';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { useNavigate } from 'react-router-dom';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation1 = keyframes`
  0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
  33% { transform: translate(30px, -50px) rotate(120deg) scale(1.1); }
  66% { transform: translate(-20px, 20px) rotate(240deg) scale(0.9); }
  100% { transform: translate(0px, 0px) rotate(360deg) scale(1); }
`;

const floatAnimation2 = keyframes`
  0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
  33% { transform: translate(-30px, 50px) rotate(-120deg) scale(1.2); }
  66% { transform: translate(20px, -20px) rotate(-240deg) scale(0.8); }
  100% { transform: translate(0px, 0px) rotate(-360deg) scale(1); }
`;

const bulletPoints = [
  'Bài giảng dễ hiểu',
  'Học mọi lúc, mọi nơi',
  'Giáo viên tận tâm',
  'Hỗ trợ giải đáp 24/7',
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(-45deg, #FF8C2F, #FFB86A, #FF6B00, #FFD4A8)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 12s ease infinite`,
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          animation: `${floatAnimation1} 20s infinite linear`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          animation: `${floatAnimation2} 25s infinite linear`,
        },
      }}
    >
      {/* Background Floating Icons */}
      <Box sx={{ position: 'absolute', top: '15%', left: '8%', animation: `${floatAnimation1} 20s infinite linear` }}>
        <CodeIcon sx={{ fontSize: 100, color: 'rgba(255, 255, 255, 0.15)', transform: 'rotate(-15deg)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '10%', left: '45%', animation: `${floatAnimation2} 24s infinite linear reverse` }}>
        <LanguageIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.12)', transform: 'rotate(25deg)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '20%', right: '5%', animation: `${floatAnimation1} 22s infinite linear reverse` }}>
        <MenuBookIcon sx={{ fontSize: 90, color: 'rgba(255, 255, 255, 0.15)', transform: 'rotate(20deg)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', left: '15%', animation: `${floatAnimation2} 26s infinite linear` }}>
        <EmojiObjectsIcon sx={{ fontSize: 85, color: 'rgba(255, 255, 255, 0.14)', transform: 'rotate(-10deg)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '15%', left: '40%', animation: `${floatAnimation1} 25s infinite linear` }}>
        <LaptopMacIcon sx={{ fontSize: 120, color: 'rgba(255, 255, 255, 0.12)', transform: 'rotate(10deg)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '10%', right: '25%', animation: `${floatAnimation2} 21s infinite linear reverse` }}>
        <SchoolIcon sx={{ fontSize: 110, color: 'rgba(255, 255, 255, 0.13)', transform: 'rotate(-20deg)' }} />
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left: Text */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '2rem', md: '3.2rem' },
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              HỌC   TIN   HỌC   DỄ   DÀNG
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '2rem', md: '3.2rem' },
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              NÂNG TẦM KỸ NĂNG
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 4,
                maxWidth: 600,
              }}
            >
              Hệ thống học trực tuyến chất lượng cao của MVA Study
            </Typography>

            {/* Bullet Points */}
            <Grid container spacing={2} sx={{ mb: 5 }}>
              {bulletPoints.map((point) => (
                <Grid size={{ xs: 6 }} key={point}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexDirection: 'row' }}>
                    <CheckCircleOutlinedIcon sx={{ color: '#fff', fontSize: 24 }} />
                    <Typography sx={{ color: '#fff', fontSize: { xs: '0.9rem', md: '1.1rem' }, fontWeight: 500 }}>
                      {point}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/courses')}
                sx={{
                  bgcolor: '#fff',
                  color: '#FF8C2F',
                  fontWeight: 700,
                  borderRadius: '50px',
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: '#FFF3E8',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Khám phá khóa học
              </Button>

            </Box>
          </Grid>

          {/* Right: Illustration */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: 480,
                height: 400,
              }}
            >
              {/* Main illustration frame */}
              <Box
                sx={{
                  width: 440,
                  height: 320,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Simulated video/course preview */}
                <Box
                  sx={{
                    width: 380,
                    height: 280,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    sx={{
                      width: 360,
                      height: 220,
                      borderRadius: 1.5,
                      background: 'linear-gradient(135deg, #FFF3E8, #FFE0C2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.5,
                    }}
                  >
                    <PlayCircleFilledIcon sx={{ fontSize: 72, color: '#FF8C2F', opacity: 0.8 }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 600 }}>
                    Xem bài giảng demo
                  </Typography>
                </Box>
              </Box>

              {/* Floating badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: -10,
                  bgcolor: '#fff',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontSize: '2rem' }}>🎓</Typography>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>Học viên</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>1,200+</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

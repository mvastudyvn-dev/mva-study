import React from 'react';
import { Box, Container, Typography, Grid, GlobalStyles } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const ProBullet = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: '10px',
      bgcolor: 'rgba(255, 140, 47, 0.10)',
      color: '#FF8C2F',
      flexShrink: 0,
      mt: 0.2,
      transition: 'all 0.2s ease',
    }}>
      {icon}
    </Box>
    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7, pt: 0.7, fontSize: '0.9rem' }}>
      {children}
    </Typography>
  </Box>
);

export const TeacherSection: React.FC = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#FAFAFA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GlobalStyles styles={{
        '@keyframes teacherFloat1': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(8deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
        '@keyframes teacherFloat2': {
          '0%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(14px) rotate(-12deg) scale(1.05)' },
          '100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
        },
        '@keyframes teacherFloat3': {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-10px) translateX(12px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
      }} />

      {/* Background blobs */}
      <Box sx={{
        position: 'absolute', top: 0, right: 0,
        width: 400, height: 400,
        background: 'radial-gradient(circle at top right, rgba(255,140,47,0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              px: 2,
              py: 0.8,
              bgcolor: 'rgba(255,140,47,0.08)',
              borderRadius: '999px',
              border: '1px solid rgba(255,140,47,0.16)',
              mb: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 14, color: '#FF8C2F' }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Đội ngũ giảng dạy
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              fontSize: { xs: '1.7rem', md: '2.2rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Thông tin{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Leader
            </Box>
          </Typography>
        </Box>

        <Grid container spacing={5} alignItems="stretch">
          {/* Left Column: Image */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: 320,
              }}
            >
              {/* Floating decorative icons */}
              <Box sx={{ position: 'absolute', top: '12%', left: '8%', animation: 'teacherFloat1 6s ease-in-out infinite', opacity: 0.25, color: '#FF8C2F', zIndex: 0 }}>
                <SchoolIcon sx={{ fontSize: 52 }} />
              </Box>
              <Box sx={{ position: 'absolute', bottom: '12%', right: '4%', animation: 'teacherFloat2 7s ease-in-out infinite', opacity: 0.2, color: '#FF8C2F', zIndex: 0 }}>
                <PsychologyIcon sx={{ fontSize: 68 }} />
              </Box>
              <Box sx={{ position: 'absolute', top: '8%', right: '18%', animation: 'teacherFloat3 5s ease-in-out infinite', opacity: 0.18, color: '#FF8C2F', zIndex: 0 }}>
                <AutoAwesomeIcon sx={{ fontSize: 38 }} />
              </Box>
              <Box sx={{ position: 'absolute', bottom: '22%', left: '12%', animation: 'teacherFloat1 8s ease-in-out infinite reverse', opacity: 0.18, color: '#FF8C2F', zIndex: 0 }}>
                <AutoFixHighIcon sx={{ fontSize: 42 }} />
              </Box>

              <Box
                component="img"
                src="/teacher-kid.png"
                alt="Teacher KID"
                sx={{
                  width: '100%',
                  maxWidth: '260px',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 24px 48px rgba(0, 0, 0, 0.10))',
                  transition: 'transform 0.4s ease',
                  zIndex: 1,
                  position: 'relative',
                  '&:hover': { transform: 'translateY(-10px)' },
                }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '<div style="width: 240px; height: 240px; background: linear-gradient(135deg, #FF8C2F, #FF6B00); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: bold; text-align: center; padding: 20px; z-index: 1; position: relative;">Giảng viên MVA Study</div>';
                    e.target.parentElement.appendChild(fallback);
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Right Column: Two Info Cards */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Achievements Card */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: '20px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '12px',
                      bgcolor: 'rgba(245,158,11,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <EmojiEventsIcon sx={{ fontSize: 22, color: '#F59E0B' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Thành tích nổi bật
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <ProBullet icon={<WorkspacePremiumIcon fontSize="small" />}>
                      Đạt <strong>9,5 điểm</strong> Tin học THPTQG.
                    </ProBullet>
                    <ProBullet icon={<EmojiEventsIcon fontSize="small" />}>
                      <strong>4 lần</strong> đạt giải HSG Tin học cấp Tỉnh, Thành phố.
                    </ProBullet>
                    <ProBullet icon={<LaptopMacIcon fontSize="small" />}>
                      Đạt chứng chỉ <strong>MOS Associate — Microsoft 365 Apps</strong>.
                    </ProBullet>
                    <ProBullet icon={<SchoolIcon fontSize="small" />}>
                      Đạt chứng chỉ <strong>Google Certified Educator Level 1, 2</strong>.
                    </ProBullet>
                    <ProBullet icon={<AutoAwesomeIcon fontSize="small" />}>
                      Đạt chứng chỉ <strong>Gemini Certified Educator</strong> và <strong>Gemini Certified University Student</strong>.
                    </ProBullet>
                  </Box>
                </Box>
              </Grid>

              {/* Teaching Style Card */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: '20px',
                    bgcolor: '#FFF8F2',
                    border: '1px solid rgba(255,140,47,0.12)',
                    boxShadow: '0 2px 16px rgba(255,140,47,0.04)',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(255,140,47,0.10)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{
                      width: 40, height: 40, borderRadius: '12px',
                      bgcolor: 'rgba(255,140,47,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FlashOnIcon sx={{ fontSize: 22, color: '#FF8C2F' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF8C2F', fontSize: '1rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      Phong cách giảng dạy
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <ProBullet icon={<GpsFixedIcon fontSize="small" />}>
                      Dạy đúng trọng tâm và chuẩn cấu trúc chương trình mới.
                    </ProBullet>
                    <ProBullet icon={<PsychologyIcon fontSize="small" />}>
                      Đi sâu vào bản chất, rèn luyện tư duy để xử lý bài tập linh hoạt, không máy móc.
                    </ProBullet>
                    <ProBullet icon={<AutoFixHighIcon fontSize="small" />}>
                      Sáng tạo, chậm rãi — Cứu vớt các "chúa tể mất gốc".
                    </ProBullet>
                    <ProBullet icon={<FlashOnIcon fontSize="small" />}>
                      Mẹo hack lý thuyết nhìn phát chọn luôn.
                    </ProBullet>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

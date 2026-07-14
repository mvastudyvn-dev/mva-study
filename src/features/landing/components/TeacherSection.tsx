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
      bgcolor: 'rgba(255, 140, 47, 0.1)',
      color: '#FF8C2F',
      flexShrink: 0,
      mt: 0.3,
      boxShadow: '0 4px 12px rgba(255,140,47,0.05)'
    }}>
      {icon}
    </Box>
    <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6, pt: 0.6 }}>
      {children}
    </Typography>
  </Box>
);

export const TeacherSection: React.FC = () => {
  return (
    <Box sx={{ pt: { xs: 0, md: 1 }, pb: { xs: 4, md: 6 }, bgcolor: '#fff' }}>
      <GlobalStyles styles={{
        '@keyframes float1': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' }
        },
        '@keyframes float2': {
          '0%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(15px) rotate(-15deg) scale(1.1)' },
          '100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' }
        },
        '@keyframes float3': {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) translateX(15px) rotate(20deg)' },
          '100%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' }
        }
      }} />
      <Container maxWidth="xl">
        {/* Tiêu đề */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
          <Box sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            bgcolor: 'rgba(255, 140, 47, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 8px 16px rgba(255,140,47,0.08)'
          }}>
            <PersonIcon sx={{ color: '#FF8C2F', fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1F2937', fontSize: { xs: '1.6rem', md: '2rem' } }}
          >
            Thông tin <span style={{ color: '#FF8C2F' }}>Leader</span>
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Left Column: Image */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Floating Icons Background */}
              <Box sx={{ position: 'absolute', top: '15%', left: '10%', animation: 'float1 6s ease-in-out infinite', opacity: 0.3, color: '#FF8C2F', zIndex: 0 }}>
                <SchoolIcon sx={{ fontSize: 60 }} />
              </Box>
              <Box sx={{ position: 'absolute', bottom: '15%', right: '5%', animation: 'float2 7s ease-in-out infinite', opacity: 0.25, color: '#FF8C2F', zIndex: 0 }}>
                <PsychologyIcon sx={{ fontSize: 80 }} />
              </Box>
              <Box sx={{ position: 'absolute', top: '10%', right: '20%', animation: 'float3 5s ease-in-out infinite', opacity: 0.2, color: '#FF8C2F', zIndex: 0 }}>
                <AutoAwesomeIcon sx={{ fontSize: 45 }} />
              </Box>
              <Box sx={{ position: 'absolute', bottom: '25%', left: '15%', animation: 'float1 8s ease-in-out infinite reverse', opacity: 0.2, color: '#FF8C2F', zIndex: 0 }}>
                <AutoFixHighIcon sx={{ fontSize: 50 }} />
              </Box>

              <Box
                component="img"
                src="/teacher-kid.png"
                alt="Teacher KID"
                sx={{
                  width: '100%',
                  maxWidth: '240px',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.08))',
                  transition: 'transform 0.3s ease',
                  zIndex: 1,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    const fallback = document.createElement('div');
                    fallback.innerHTML = '<div style="width: 300px; height: 300px; background-color: #FF8C2F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; text-align: center; padding: 20px; z-index: 1; position: relative;">Thay thế ảnh bằng file teacher-kid.png trong thư mục public</div>';
                    e.target.parentElement.appendChild(fallback);
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Right Column: Information (Side by Side) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Thông tin giáo viên */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, borderRadius: '16px', bgcolor: '#F9FAFB', border: '1px solid #F3F4F6', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827', mb: 3 }}>
                    🏆 Thành tích nổi bật
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <ProBullet icon={<WorkspacePremiumIcon fontSize="medium" />}>
                      Đạt <strong>9,5 điểm</strong> Tin học THPTQG.
                    </ProBullet>
                    <ProBullet icon={<EmojiEventsIcon fontSize="medium" />}>
                      <strong>4 lần</strong> đạt giải HSG Tin học cấp Tỉnh, Thành phố.
                    </ProBullet>
                    <ProBullet icon={<LaptopMacIcon fontSize="medium" />}>
                      Đạt chứng chỉ <strong>MOS Associate - Microsoft 365 Apps</strong>.
                    </ProBullet>
                    <ProBullet icon={<SchoolIcon fontSize="medium" />}>
                      Đạt chứng chỉ Nhà giáo dục của Google: <strong>Google Certified Educator Level 1, 2</strong>.
                    </ProBullet>
                    <ProBullet icon={<AutoAwesomeIcon fontSize="medium" />}>
                      Đạt chứng chỉ Nhà giáo dục AI của Google: <strong>Gemini Certified Educator</strong>.
                    </ProBullet>
                    <ProBullet icon={<AutoAwesomeIcon fontSize="medium" />}>
                      Đạt chứng chỉ Sinh viên AI của Google: <strong>Gemini Certified University Student</strong>.
                    </ProBullet>
                  </Box>
                </Box>
              </Grid>

              {/* Phong cách giảng dạy */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFF8F2', border: '1px solid rgba(255,140,47,0.15)', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF8C2F', mb: 3 }}>
                    💡 Phong cách giảng dạy
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <ProBullet icon={<GpsFixedIcon fontSize="medium" />}>
                      Dạy đúng trọng tâm và chuẩn cấu trúc chương trình mới.
                    </ProBullet>
                    <ProBullet icon={<PsychologyIcon fontSize="medium" />}>
                      Đi sâu vào bản chất, rèn luyện tư duy để có thể xử lý bài tập linh hoạt, không máy móc.
                    </ProBullet>
                    <ProBullet icon={<AutoFixHighIcon fontSize="medium" />}>
                      Sáng tạo, chậm rãi – Cứu vớt các "chúa tể mất gốc".
                    </ProBullet>
                    <ProBullet icon={<FlashOnIcon fontSize="medium" />}>
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

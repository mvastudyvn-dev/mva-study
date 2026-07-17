import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const features = [
  { icon: <SchoolRoundedIcon sx={{ fontSize: 18 }} />, text: 'Bài giảng video chất lượng cao' },
  { icon: <EmojiEventsRoundedIcon sx={{ fontSize: 18 }} />, text: 'Đề thi thử chuẩn THPT' },
  { icon: <StarRoundedIcon sx={{ fontSize: 18 }} />, text: 'Giáo viên tận tâm, hỗ trợ 24/7' },
  { icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />, text: '98% học viên đạt kết quả tốt' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 60%, #FFF3E8 100%)',
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 1080,
          bgcolor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 72px rgba(0,0,0,0.09), 0 8px 24px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.06)',
          minHeight: 580,
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Side: Brand Panel */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            width: '45%',
            flexDirection: 'column',
            justifyContent: 'center',
            p: '56px 48px',
            background: 'linear-gradient(160deg, #FF8C2F 0%, #FF6B00 50%, #E05A00 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Pattern overlay */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            zIndex: 0,
          }} />
          {/* Blob decorations */}
          <Box sx={{
            position: 'absolute', top: '-15%', right: '-15%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 0,
          }} />
          <Box sx={{
            position: 'absolute', bottom: '-10%', left: '-10%',
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0,
          }} />

          <Fade in={show} timeout={800}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Brand badge */}
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: '999px', px: 2, py: 0.8, mb: 4,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <SchoolRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.04em' }}>
                  MVA Study
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  lineHeight: 1.15,
                  mb: 1.5,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, mb: 5 }}>
                Nền tảng học tin học trực tuyến hàng đầu Việt Nam.
              </Typography>

              {/* Feature list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {features.map((f, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: '10px',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', flexShrink: 0,
                    }}>
                      {f.icon}
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                      {f.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Stats row */}
              <Box sx={{ display: 'flex', gap: 4, mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                {[{ v: '1.2K+', l: 'Học viên' }, { v: '98%', l: 'Pass rate' }, { v: '4.9★', l: 'Đánh giá' }].map((s) => (
                  <Box key={s.l}>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>
                      {s.v}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', mt: 0.3 }}>
                      {s.l}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Right Side: Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '55%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, sm: 5, md: '56px 52px' },
            bgcolor: '#FFFFFF',
            overflowY: 'auto',
          }}
        >
          <Fade in={show} timeout={1000} style={{ transitionDelay: '150ms' }}>
            <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto' }}>
              {children}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Paper } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useData } from '../../../core/contexts/DataContext';

export const CountdownSection: React.FC = () => {
  const { systemSettings } = useData();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!systemSettings?.countdownTargetDate) return;
    const examDate = new Date(systemSettings.countdownTargetDate);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = examDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [systemSettings?.countdownTargetDate]);

  if (!systemSettings?.countdownEnabled) return null;

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF8C2F 0%, #FFB86C 100%)',
            borderRadius: '24px',
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(255, 140, 47, 0.15)',
          }}
        >
          {/* Subtle grid pattern background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: 0.05,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              zIndex: 0
            }}
          />

          {/* Watermark Icons */}
          <TimerOutlinedIcon sx={{ position: 'absolute', top: -30, left: '5%', fontSize: 240, color: 'white', opacity: 0.15, transform: 'rotate(-15deg)', zIndex: 0 }} />
          <SchoolOutlinedIcon sx={{ position: 'absolute', bottom: -40, left: '25%', fontSize: 200, color: 'white', opacity: 0.12, transform: 'rotate(20deg)', zIndex: 0 }} />
          <MenuBookOutlinedIcon sx={{ position: 'absolute', top: 20, right: '25%', fontSize: 180, color: 'white', opacity: 0.12, transform: 'rotate(15deg)', zIndex: 0 }} />
          <DescriptionOutlinedIcon sx={{ position: 'absolute', bottom: -30, right: '-2%', fontSize: 260, color: 'white', opacity: 0.15, transform: 'rotate(-20deg)', zIndex: 0 }} />

          {/* Content: Countdown */}
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.3 }}>
              {systemSettings?.countdownTitle || 'Đếm Ngược Kỳ Thi'}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, fontSize: '1.1rem', mb: 5, letterSpacing: '0.5px' }}>
              {systemSettings?.countdownSubtitle || ''}
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={{ xs: 2, md: 3 }}>
              {[
                { value: timeLeft.days, label: 'Ngày' },
                { value: timeLeft.hours, label: 'Giờ' },
                { value: timeLeft.minutes, label: 'Phút' },
                { value: timeLeft.seconds, label: 'Giây' }
              ].map((item, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: { xs: 85, sm: 110, md: 130 },
                      height: { xs: 95, sm: 120, md: 140 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px',
                      bgcolor: 'white',
                      mb: 2,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                        fontWeight: 800,
                        color: '#E67923',
                        lineHeight: 1
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </Typography>
                  </Paper>
                  <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '1.1rem' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

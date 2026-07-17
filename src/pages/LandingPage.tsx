import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Header, Hero, CourseSection, TeacherSection, NewsLeaderboardSection, CountdownSection, ConsultationForm, Footer, FeedbackSection, PartnerSection, Chatbot } from '../features/landing';
import { useData } from '../core/contexts/DataContext';
import logo from '../assets/logo1.png';

const LandingPage: React.FC = () => {
  const { systemSettings } = useData();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (systemSettings?.popupEnabled && !sessionStorage.getItem('popupClosed')) {
      setShowPopup(true);
    }
  }, [systemSettings]);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('popupClosed', 'true');
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
        <Box 
          component="img" 
          src={logo} 
          alt="MVA Logo" 
          sx={{ 
            height: 60, 
            mb: 4, 
            objectFit: 'contain',
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            }
          }} 
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                bgcolor: '#FF8C2F',
                borderRadius: '50%',
                animation: 'bounceDots 1.4s infinite ease-in-out both',
                animationDelay: `${i * 0.16 - 0.32}s`,
                '@keyframes bounceDots': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      animation: 'contentFadeInUp 0.8s ease-out',
      '@keyframes contentFadeInUp': {
        '0%': { opacity: 0, transform: 'translateY(30px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      }
    }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box id="section-hero"><Hero /></Box>
        <Box id="section-courses"><CourseSection /></Box>
        <Box id="section-news"><NewsLeaderboardSection /></Box>
        <Box id="section-teachers"><TeacherSection /></Box>
        <Box id="section-feedback"><FeedbackSection /></Box>
        {systemSettings?.countdownEnabled && (
          <Box id="section-countdown"><CountdownSection /></Box>
        )}
        <Box id="section-partners"><PartnerSection /></Box>
        <Box id="section-consultation"><ConsultationForm /></Box>
        
        <Dialog 
          open={showPopup} 
          onClose={handleClosePopup}
          PaperProps={{ 
            sx: { 
              borderRadius: 1, 
              maxWidth: 420,
              width: '100%',
              bgcolor: '#ffffff',
              backgroundImage: 'none',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            } 
          }}
        >
          {/* Nút đóng */}
          <IconButton 
            onClick={handleClosePopup} 
            sx={{ 
              position: 'absolute', 
              right: 12, 
              top: 12, 
              zIndex: 10, 
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
            }}
            size="small"
          >
            <CloseIcon fontSize="small" sx={{ color: '#6B7280' }} />
          </IconButton>

          <Box sx={{ position: 'relative', overflow: 'hidden', p: 4, textAlign: 'center' }}>
            {/* Nền Blur với màu chủ đạo */}
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, bgcolor: 'rgba(255, 140, 47, 0.1)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, bgcolor: 'rgba(255, 140, 47, 0.15)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Icon Box */}
              <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#FFF8F2', borderRadius: '50%', mb: 2 }}>
                <Typography variant="h3" sx={{ lineHeight: 1 }}>🎁</Typography>
              </Box>
              
              {/* Tiêu đề */}
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1F2937', mb: 1 }}>
                {systemSettings?.popupTitle}
              </Typography>
              
              {/* Nội dung */}
              <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.5, mb: 4, px: 1 }}>
                {systemSettings?.popupContent}
              </Typography>
              
              {/* Nút bấm (Màu Website) */}
              <Button 
                variant="contained" 
                onClick={handleClosePopup} 
                fullWidth
                sx={{ 
                  py: 1.5, 
                  borderRadius: 1, 
                  bgcolor: '#FF8C2F',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(255, 140, 47, 0.3)',
                  '&:hover': {
                    bgcolor: '#E67E22',
                    boxShadow: '0 6px 20px rgba(255, 140, 47, 0.4)',
                  }
                }}
              >
                Khám phá ngay
              </Button>
              
              <Typography 
                variant="caption" 
                sx={{ display: 'block', mt: 2, color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280', textDecoration: 'underline' } }} 
                onClick={handleClosePopup}
              >
                Bỏ qua
              </Typography>
            </Box>
          </Box>
        </Dialog>
      </Box>
      <Footer />
      <Chatbot />
    </Box>
  );
};
export default LandingPage;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade, Divider } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 76px)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FFFFFF', py: { xs: 4, md: 8 } }}>
      <Box sx={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: 1200, 
        bgcolor: '#FFFFFF', 
        overflow: 'hidden',
        minHeight: 600,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Left Side: Illustration & Title (55%) */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            width: '55%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: '80px',
            position: 'relative',
            background: 'linear-gradient(180deg, #FFF8F2, #FFFFFF)',
            overflow: 'hidden'
          }}
        >
          <Fade in={show} timeout={800}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                mb: '32px', 
                zIndex: 1, 
                animation: 'slideUp 0.8s ease-out', 
                '@keyframes slideUp': { 
                  from: { opacity: 0, transform: 'translateY(30px)' }, 
                  to: { opacity: 1, transform: 'translateY(0)' } 
                } 
              }}
            >
              <Typography 
                variant="h1" 
                fontWeight="700" 
                color="#F59E42" 
                sx={{ 
                  lineHeight: 1.1, 
                  fontSize: '58px', 
                  fontFamily: '"Quicksand", sans-serif'
                }}
              >
                {title}
              </Typography>
            </Box>
          </Fade>
          
          <Fade in={show} timeout={1200}>
            <Box 
              component="img"
              src="https://firebasestorage.googleapis.com/v0/b/mapuni-345314.appspot.com/o/illustrations%2Flogin-illust.png?alt=media"
              alt="Premium Study Illustration"
              onError={(e: any) => { e.target.src = 'https://illustrations.popsy.co/amber/student.svg'; }}
              sx={{ 
                width: '100%', 
                maxWidth: { md: 450, lg: 520 }, 
                zIndex: 1,
                animation: 'slideUp 1s ease-out 0.2s both'
              }}
            />
          </Fade>
        </Box>

        {/* Divider */}
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#F4D8B8', borderRightWidth: 1 }} />

        {/* Right Side: Form (45%) */}
        <Box 
          sx={{ 
            width: { xs: '100%', md: '45%' },
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: '80px' },
            bgcolor: '#FFFFFF',
            position: 'relative'
          }}
        >
          <Fade in={show} timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Box sx={{ width: { xs: '92%', sm: '100%' }, maxWidth: 460, mx: 'auto' }}>
              {children}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

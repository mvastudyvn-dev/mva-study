import React from 'react';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import logo from '../../../assets/logo1.png';

export const CheckDHFooter: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #E5E7EB', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'space-between' }}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box component="img" src={logo} alt="MVA Study Logo" sx={{ height: 36, objectFit: 'contain' }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#FF8C2F', lineHeight: 1.2 }}>
                  MVA Uni
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 360 }}>
              Hệ thống tra cứu và phân tích điểm chuẩn thông minh, giúp học sinh tối ưu chiến lược 15 nguyện vọng để nắm chắc cơ hội đỗ Đại học 2027.
            </Typography>
          </Grid>

          {/* Features Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography sx={{ fontWeight: 700, color: '#1F2937', mb: 2.5, fontSize: '1rem' }}>
              Tính năng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Điểm chuẩn 2027
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Điểm chuẩn 2026
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Chiến thuật 15 nguyện vọng
              </Typography>
            </Box>
          </Grid>

          {/* Support Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography sx={{ fontWeight: 700, color: '#1F2937', mb: 2.5, fontSize: '1rem' }}>
              Hỗ trợ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Hướng dẫn sử dụng
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Câu hỏi thường gặp
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
                Điều khoản & Bảo mật
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#F3F4F6', mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 500 }}>
            © 2026 MVA Study. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
              Facebook
            </Typography>
            <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
              Tiktok
            </Typography>
            <Typography sx={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#FF8C2F' } }}>
              Zalo
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

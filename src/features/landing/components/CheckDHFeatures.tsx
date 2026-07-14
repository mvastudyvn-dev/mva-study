import React from 'react';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const features = [
  {
    icon: <AnalyticsIcon sx={{ fontSize: 28, color: '#3B82F6' }} />,
    iconBg: '#EFF6FF',
    title: 'Phân tích thông minh',
    desc: 'Dữ liệu chuẩn xác và cập nhật liên tục từ 200+ trường Đại học.',
  },
  {
    icon: <TrackChangesIcon sx={{ fontSize: 28, color: '#EF4444' }} />,
    iconBg: '#FEF2F2',
    title: 'Tối đa tỷ lệ đỗ',
    desc: 'Chiến thuật 15 nguyện vọng An Toàn - Phù Hợp - Mơ Ước.',
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 28, color: '#F59E0B' }} />,
    iconBg: '#FFFBEB',
    title: 'Báo cáo trực quan',
    desc: 'Xuất file PDF chuyên nghiệp để lưu trữ và tham khảo cùng gia đình.',
  },
  {
    icon: <LocalCafeIcon sx={{ fontSize: 28, color: '#10B981' }} />,
    iconBg: '#ECFDF5',
    title: 'Chi phí cực rẻ',
    desc: 'Sở hữu chuyên gia tư vấn số 24/7 với mức giá vô cùng tiết kiệm.',
  },
];

export const CheckDHFeatures: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#F8FAFC', py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Vì sao nên nâng cấp MVA Uni PRO?
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
            Sở hữu lợi thế tuyệt đối trong kỳ thi đại học chỉ với một quyết định.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ width: 260 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                    borderColor: 'transparent'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: feature.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#1E293B', mb: 1, fontSize: '1.05rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

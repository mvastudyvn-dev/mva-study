import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useData } from '../../../core/contexts/DataContext';

export const AdminStudentChart: React.FC = () => {
  const { monthlyStats } = useData();

  const maxVal = Math.max(...monthlyStats.map((s) => Math.max(s.newStudents, s.activeStudents)));

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem' }}>
            Thống kê học viên
          </Typography>
          <Box display="flex" gap={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#FF8C2F' }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#6B7280' }}>Học viên mới</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#FFD4A8' }} />
              <Typography sx={{ fontSize: '0.7rem', color: '#6B7280' }}>Học viên hoạt động</Typography>
            </Box>
          </Box>
        </Box>

        {/* Bar Chart */}
        <Box sx={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: '6px', px: 1 }}>
          {monthlyStats.map((stat) => {
            const newH = (stat.newStudents / maxVal) * 180;
            const activeH = (stat.activeStudents / maxVal) * 180;

            return (
              <Box
                key={stat.month}
                sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
              >
                <Box sx={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: 180 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: activeH,
                      bgcolor: '#FFD4A8',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                      '&:hover': { bgcolor: '#FFB86A' },
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: newH,
                      bgcolor: '#FF8C2F',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                      '&:hover': { bgcolor: '#FF6B00' },
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.6rem', color: '#9CA3AF', mt: 0.5 }}>
                  {stat.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

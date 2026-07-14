import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const DonutChart: React.FC<{ correct: number; wrong: number }> = ({ correct, wrong }) => {
  const total = correct + wrong;
  const correctPct = (correct / total) * 100;
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const correctDash = (correctPct / 100) * circumference;
  const wrongDash = circumference - correctDash;

  return (
    <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto' }}>
      <svg viewBox="0 0 150 150" width="150" height="150">
        <circle
          cx="75" cy="75" r={radius}
          fill="none"
          stroke="#FEE2E2"
          strokeWidth="18"
        />
        <circle
          cx="75" cy="75" r={radius}
          fill="none"
          stroke="#FF8C2F"
          strokeWidth="18"
          strokeDasharray={`${correctDash} ${wrongDash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#1F2937', lineHeight: 1 }}>
          {Math.round(correctPct)}%
        </Typography>
      </Box>
    </Box>
  );
};

export const AdminTestResults: React.FC = () => (
  <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none', height: '100%' }}>
    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: '#1F2937', mb: 3, fontSize: '1rem', alignSelf: 'flex-start' }}
      >
        Tỉ lệ làm bài
      </Typography>

      <DonutChart correct={75} wrong={25} />

      {/* Legend */}
      <Box display="flex" flexDirection="column" gap={1} mt={3} width="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.8}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF8C2F' }} />
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>Đúng</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>
            75% (24,433 bài)
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.8}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FEE2E2' }} />
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>Sai</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937' }}>
            25% (8,130 bài)
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

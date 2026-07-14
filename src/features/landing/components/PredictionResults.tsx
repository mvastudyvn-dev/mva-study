import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Grid, Chip, Skeleton, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface PredictionResultsProps {
  isLoading: boolean;
  result: any | null;
}

const getStatusColor = (chance: string) => {
  const lower = chance.toLowerCase();
  if (lower.includes('an toàn')) return '#10B981'; // Green
  if (lower.includes('cao')) return '#3B82F6'; // Blue
  if (lower.includes('cạnh tranh')) return '#F59E0B'; // Yellow/Orange
  if (lower.includes('khó') && !lower.includes('rất')) return '#EF4444'; // Red
  return '#991B1B'; // Dark Red
};

const getStatusIcon = (chance: string, color: string) => {
  const lower = chance.toLowerCase();
  if (lower.includes('an toàn') || lower.includes('cao')) return <CheckCircleIcon sx={{ color, fontSize: 20 }} />;
  if (lower.includes('cạnh tranh')) return <WarningAmberIcon sx={{ color, fontSize: 20 }} />;
  return <ErrorOutlineIcon sx={{ color, fontSize: 20 }} />;
};

export const PredictionResults: React.FC<PredictionResultsProps> = ({ isLoading, result }) => {
  if (isLoading) {
    return (
      <Box sx={{ mt: 8, textAlign: 'left', animation: 'fadeIn 0.5s ease' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <AutoAwesomeIcon sx={{ color: '#FF8C2F', animation: 'pulse 1.5s infinite' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
            AI đang phân tích phổ điểm...
          </Typography>
        </Box>
        
        <Skeleton variant="rounded" height={100} sx={{ mb: 4, borderRadius: 3 }} />
        
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!result || !result.universities || result.universities.length === 0) return null;

  return (
    <Box sx={{ mt: 8, textAlign: 'left', animation: 'fadeInUpContent 0.6s ease-out' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <AutoAwesomeIcon sx={{ color: '#FF8C2F' }} />
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1F2937' }}>
          Kết quả phân tích từ AI
        </Typography>
      </Box>

      {/* Lời khuyên tổng quan */}
      <Box 
        sx={{ 
          bgcolor: '#FFF7ED', 
          p: 3, 
          borderRadius: 3, 
          border: '1px solid #FFEDD5',
          mb: 5,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 120, color: '#FF8C2F' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#9A3412', mb: 1, fontSize: '1.1rem' }}>
          Chiến lược đặt nguyện vọng
        </Typography>
        <Typography sx={{ color: '#431407', lineHeight: 1.7, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
          {result.overall_advice}
        </Typography>
      </Box>

      {/* Danh sách trường & ngành */}
      {result.universities.map((uni: any, uniIdx: number) => (
        <Box key={uniIdx} sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#374151', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon sx={{ color: '#6B7280' }} />
            {uni.name}
          </Typography>

          <Grid container spacing={3}>
            {uni.majors.map((major: any, majorIdx: number) => {
              const color = getStatusColor(major.chance);
              return (
                <Grid item xs={12} md={6} lg={4} key={majorIdx}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      border: '1px solid #E5E7EB',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                        borderColor: color
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.1rem', lineHeight: 1.3, pr: 2 }}>
                          {major.name}
                        </Typography>
                        <Chip 
                          label={major.chance} 
                          sx={{ 
                            bgcolor: `${color}15`, 
                            color: color, 
                            fontWeight: 700,
                            borderRadius: '8px'
                          }} 
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusIcon(major.chance, color)}
                        <Typography sx={{ color: '#4B5563', fontWeight: 600 }}>
                          Khả năng đỗ: <Box component="span" sx={{ color }}>{major.probability}%</Box>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: '#6B7280', fontSize: '0.9rem' }}>
                          Dự kiến điểm chuẩn: <Box component="span" sx={{ fontWeight: 700, color: '#374151' }}>{major.predicted_benchmark}</Box>
                        </Typography>
                      </Box>

                      <LinearProgress 
                        variant="determinate" 
                        value={major.probability} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#F3F4F6',
                          mb: 3,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: color,
                            borderRadius: 4,
                          }
                        }} 
                      />

                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography sx={{ color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {major.advice}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

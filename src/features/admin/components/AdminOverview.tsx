import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useData } from '../../../core/contexts/DataContext';

export const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const { users, courses, activationCodes } = useData();

  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeCodes = activationCodes.filter(c => c.isUsed).length;
  const usageRate = activationCodes.length > 0 ? ((activeCodes / activationCodes.length) * 100).toFixed(1) + '%' : '0%';
  
  const kpiCards = [
    {
      label: 'Học viên',
      value: totalStudents.toLocaleString(),
      change: 'Tổng số học viên',
      icon: <PeopleIcon />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      label: 'Khóa học',
      value: courses.length.toString(),
      change: 'Khóa học hệ thống',
      icon: <SchoolIcon />,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      label: 'Lượt kích hoạt',
      value: activeCodes.toString(),
      change: `Trên tổng ${activationCodes.length} mã`,
      icon: <VisibilityIcon />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      label: 'Tỉ lệ kích hoạt',
      value: usageRate,
      change: 'So với tổng số mã',
      icon: <CheckCircleIcon />,
      color: '#FF8C2F',
      bgColor: '#FFF8F2',
    },
  ];

  return (
    <Box mb={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.3rem' }}
        >
          Tổng quan
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpiCards.map((kpi) => (
          <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
            <Card
              sx={{
                borderRadius: 1,
                border: '1px solid #F3F4F6',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: kpi.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: kpi.color,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                </Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1F2937', lineHeight: 1.2, mb: 0.5 }}
                >
                  {kpi.value}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, mb: 0.5 }}>
                  {kpi.label}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.3}>
                  <TrendingUpIcon sx={{ fontSize: 12, color: '#10B981' }} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>
                    {kpi.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

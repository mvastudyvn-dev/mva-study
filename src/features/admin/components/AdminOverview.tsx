import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useData } from '../../../core/contexts/DataContext';

export const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const { users, courses, activationCodes } = useData();

  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeCodes = activationCodes.filter(c => c.isUsed).length;
  const usageRate = activationCodes.length > 0 ? ((activeCodes / activationCodes.length) * 100).toFixed(1) + '%' : '0%';

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Chào buổi sáng' : now.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const kpiCards = [
    {
      label: 'Học viên',
      value: totalStudents.toLocaleString(),
      change: 'Tổng số học viên',
      icon: <PeopleRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      trend: '+12%',
      trendPositive: true,
    },
    {
      label: 'Khóa học',
      value: courses.length.toString(),
      change: 'Khóa học trong hệ thống',
      icon: <SchoolRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#10B981',
      bgColor: '#ECFDF5',
      trend: '+2',
      trendPositive: true,
    },
    {
      label: 'Lượt kích hoạt',
      value: activeCodes.toString(),
      change: `Trên tổng ${activationCodes.length} mã`,
      icon: <VpnKeyRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      trend: '+8%',
      trendPositive: true,
    },
    {
      label: 'Tỉ lệ kích hoạt',
      value: usageRate,
      change: 'So với tổng số mã',
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#FF8C2F',
      bgColor: '#FFF8F2',
      trend: 'Tốt',
      trendPositive: true,
    },
  ];

  return (
    <Box mb={4}>
      {/* Welcome Banner */}
      <Box
        sx={{
          p: 3.5,
          mb: 3.5,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #1A2035 0%, #252D45 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{
          position: 'absolute', top: '-30%', right: '-5%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
          zIndex: 0,
        }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{
            fontWeight: 900,
            color: '#fff',
            fontSize: '1.25rem',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}>
            {greeting},{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #FF8C2F, #FFB86C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {user?.name || 'Admin'}
            </Box>
            !
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
            <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
              {now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center', gap: 0.6,
          bgcolor: 'rgba(16,185,129,0.12)',
          color: '#10B981',
          px: 2, py: 0.8,
          borderRadius: '999px',
          border: '1px solid rgba(16,185,129,0.2)',
          position: 'relative', zIndex: 1,
        }}>
          <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Hệ thống hoạt động tốt
          </Typography>
        </Box>
      </Box>

      {/* Section Label */}
      <Typography sx={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#94A3B8',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mb: 2,
      }}>
        Thống kê tổng quan
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpiCards.map((kpi) => (
          <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
            <Card
              sx={{
                borderRadius: '18px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  boxShadow: '0 10px 32px rgba(0,0,0,0.08)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                {/* Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44, height: 44,
                      borderRadius: '14px',
                      bgcolor: kpi.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: kpi.color,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 0.4,
                    bgcolor: kpi.trendPositive ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
                    color: kpi.trendPositive ? '#10B981' : '#EF4444',
                    px: 1, py: 0.3, borderRadius: '999px',
                  }}>
                    <TrendingUpRoundedIcon sx={{ fontSize: 12 }} />
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      {kpi.trend}
                    </Typography>
                  </Box>
                </Box>

                {/* Value */}
                <Typography sx={{
                  fontWeight: 900,
                  fontSize: '1.7rem',
                  color: '#0F172A',
                  lineHeight: 1.1,
                  mb: 0.4,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  letterSpacing: '-0.02em',
                }}>
                  {kpi.value}
                </Typography>

                {/* Label */}
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, mb: 0.3 }}>
                  {kpi.label}
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>
                  {kpi.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

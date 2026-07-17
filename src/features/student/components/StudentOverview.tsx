import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useData } from '../../../core/contexts/DataContext';

export const StudentOverview: React.FC = () => {
  const { user } = useAuth();
  const { courses, lessons, activationCodes, exams = [], allUserProgress } = useData();

  const stats = React.useMemo(() => {
    const userCodes = activationCodes.filter((c) => c.isUsed && c.usedByEmail === user?.email);
    const enrolledCourseIds = Array.from(new Set([
      ...userCodes.map(c => c.courseId),
      ...(user?.enrolledCourses || [])
    ]));

    const myCourses = courses.filter((course) => enrolledCourseIds.includes(course.id));

    const progress = user?.id && allUserProgress ? allUserProgress[user.id] : null;
    const completedLessonIds = progress?.completedLessons || [];
    const completedExamIds = progress?.completedExams ? progress.completedExams.map(e => e.examId) : [];

    const myLessons = lessons.filter(l => enrolledCourseIds.includes(l.courseId));
    const completedLessons = myLessons.filter(l => completedLessonIds.includes(l.id));

    let totalVideoMinutes = 0;
    completedLessons.forEach(l => {
      if (l.duration) {
        const parts = l.duration.split(':').map(Number);
        if (parts.length === 2) {
          totalVideoMinutes += parts[0] + parts[1] / 60;
        } else if (parts.length === 3) {
          totalVideoMinutes += parts[0] * 60 + parts[1] + parts[2] / 60;
        }
      }
    });

    const myExams = exams.filter(e => enrolledCourseIds.includes(e.courseId));
    const completedExams = myExams.filter(e => completedExamIds.includes(e.id));
    let totalExamMinutes = 0;
    completedExams.forEach(e => {
      if (e.timeLimit) {
        totalExamMinutes += e.timeLimit;
      }
    });

    const totalMinutes = Math.round(totalVideoMinutes + totalExamMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const completionRate = myLessons.length > 0
      ? Math.round((completedLessons.length / myLessons.length) * 100)
      : 0;

    return {
      myCoursesCount: myCourses.length,
      timeStr: `${hours > 0 ? `${hours}g ` : ''}${minutes > 0 ? `${minutes}p` : ''}`.trim() || '0 phút',
      lessonsCount: completedLessons.length,
      completionRate,
      completionRateStr: `${completionRate}%`,
    };
  }, [user, courses, lessons, activationCodes, exams, allUserProgress]);

  const statCards = [
    {
      label: 'Khóa học đang học',
      value: stats.myCoursesCount.toString(),
      change: 'Tổng khóa học đã đăng ký',
      icon: <SchoolRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      progress: null,
    },
    {
      label: 'Bài giảng đã hoàn thành',
      value: stats.lessonsCount.toString(),
      change: 'Trên toàn bộ khóa học',
      icon: <AutoStoriesRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#10B981',
      bgColor: '#ECFDF5',
      progress: null,
    },
    {
      label: 'Tỉ lệ hoàn thành',
      value: stats.completionRateStr,
      change: 'Tiến độ học tập tổng thể',
      icon: <PercentRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      progress: stats.completionRate,
    },
    {
      label: 'Tổng thời gian học',
      value: stats.timeStr,
      change: 'Thời gian đã đầu tư',
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />,
      color: '#FF8C2F',
      bgColor: '#FFF8F2',
      progress: null,
    },
  ];

  const firstName = user?.name?.split(' ').pop() || 'Học viên';

  return (
    <Box mb={4}>
      {/* Welcome Header */}
      <Box
        sx={{
          p: 3.5,
          mb: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFF8F2 0%, #FFF3E8 100%)',
          border: '1px solid rgba(255,140,47,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <WavingHandRoundedIcon sx={{ fontSize: 22, color: '#F59E0B' }} />
            <Typography
              sx={{
                fontWeight: 900,
                color: '#0F172A',
                fontSize: '1.3rem',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Xin chào,{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #FF8C2F, #FF6B00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {firstName}!
              </Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              Hãy tiếp tục học tập — mỗi ngày một bước tiến!
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'rgba(16,185,129,0.10)',
          color: '#10B981',
          px: 2,
          py: 0.8,
          borderRadius: '999px',
          border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Đang tiến bộ
          </Typography>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
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
                <Box
                  sx={{
                    width: 44, height: 44,
                    borderRadius: '14px',
                    bgcolor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>

                {/* Value */}
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.6rem',
                    color: '#0F172A',
                    lineHeight: 1.1,
                    mb: 0.4,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </Typography>

                {/* Label */}
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, mb: stat.progress !== null ? 1.5 : 0.4, lineHeight: 1.4 }}>
                  {stat.label}
                </Typography>

                {/* Progress Bar for completion */}
                {stat.progress !== null && (
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 5,
                      borderRadius: '999px',
                      bgcolor: '#EDE9FE',
                      mb: 0.8,
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                        borderRadius: '999px',
                      },
                    }}
                  />
                )}

                {/* Change text */}
                <Typography sx={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PercentIcon from '@mui/icons-material/Percent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
      timeStr: `${hours > 0 ? `${hours} giờ ` : ''}${minutes > 0 ? `${minutes} phút` : ''}`.trim() || '0 phút',
      lessonsCount: completedLessons.length,
      completionRate: `${completionRate}%`,
    };
  }, [user, courses, lessons, activationCodes, exams, allUserProgress]);

  const statCards = [
    {
      label: 'Khóa học đang học',
      value: stats.myCoursesCount.toString(),
      change: '+1 so với tháng trước',
      icon: <SchoolIcon />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      label: 'Bài giảng đã học',
      value: stats.lessonsCount.toString(),
      change: '+2 bài so với tuần trước',
      icon: <AutoStoriesIcon />,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      label: 'Tỉ lệ hoàn thành',
      value: stats.completionRate,
      change: '+5% so với tuần trước',
      icon: <PercentIcon />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    {
      label: 'Tổng thời gian học',
      value: stats.timeStr,
      change: '+3 giờ so với tuần trước',
      icon: <AccessTimeIcon />,
      color: '#FF8C2F',
      bgColor: '#FFF8F2',
    },
  ];

  return (
    <Box mb={4}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#FF8C2F', mb: 0.5, fontSize: '1.3rem' }}
          >
            Xin chào, {user?.name || 'Học viên'}!
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              Hãy tiếp tục học tập nhé!
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#1F2937', lineHeight: 1.2, mb: 0.5 }}
                >
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, mb: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>
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

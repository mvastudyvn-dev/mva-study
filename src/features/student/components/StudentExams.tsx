import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, Button, Select, MenuItem, FormControl, Chip } from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';

interface StudentExamsProps {
  onStartExam: (examId: string) => void;
}

export const StudentExams: React.FC<StudentExamsProps> = ({ onStartExam }) => {
  const { exams = [], activationCodes = [], courses = [] } = useData();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const courseParam = searchParams.get('course');

  const userCodes = activationCodes.filter((c) => c.isUsed && c.usedByEmail === user?.email);
  const enrolledCourseIds = Array.from(new Set([
    ...userCodes.map(c => c.courseId),
    ...(user?.enrolledCourses || [])
  ]));

  const myCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
  const selectedCourseId = courseParam || (myCourses.length > 0 ? myCourses[0].id : '');

  const setSelectedCourseId = (id: string) => {
    setSearchParams(prev => {
      prev.set('course', id);
      return prev;
    }, { replace: true });
  };

  const filteredExams = exams.filter(exam => exam.courseId === selectedCourseId);

  const formatLabel = (format: string) =>
    format === 'thpt_2025' ? 'THPT 2025' : 'Tiêu chuẩn';

  const formatColor = (format: string) =>
    ({ bg: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', border: 'rgba(59, 130, 246, 0.2)' });

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            Đề thi thử
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            {filteredExams.length} đề thi có sẵn cho khóa học này
          </Typography>
        </Box>

        {myCourses.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListRoundedIcon sx={{ color: '#64748B', fontSize: 20 }} />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <Select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: '10px',
                  bgcolor: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E2E8F0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#94A3B8',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3B82F6',
                  },
                }}
              >
                {myCourses.map((course) => (
                  <MenuItem key={course.id} value={course.id} sx={{ fontSize: '0.875rem' }}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {/* Empty state */}
      {myCourses.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10,
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SchoolOutlinedIcon sx={{ fontSize: 36, color: '#2563EB' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
            Chưa có khóa học
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center', maxWidth: 300 }}>
            Bạn chưa kích hoạt khóa học nào. Hãy nhập mã kích hoạt để bắt đầu làm bài thi.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredExams.map((exam) => {
            const fc = formatColor(exam.format);
            return (
              <Grid item xs={12} sm={6} lg={4} key={exam.id}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  {/* Card top accent bar */}
                  <Box
                    sx={{
                      height: 4,
                      background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                    }}
                  />

                  <Box sx={{ p: 3, flex: 1 }}>
                    {/* Icon + Title */}
                    <Box display="flex" alignItems="flex-start" gap={2} mb={2.5}>
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(96,165,250,0.1))',
                          color: '#2563EB',
                          flexShrink: 0,
                        }}
                      >
                        <AssignmentOutlinedIcon sx={{ fontSize: 22 }} />
                      </Box>
                      <Box flex={1}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: '#0F172A',
                            fontSize: '0.975rem',
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {exam.title}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Chips */}
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        icon={<AccessTimeOutlinedIcon style={{ fontSize: 13 }} />}
                        label={`${exam.timeLimit} phút`}
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: 'rgba(15,23,42,0.06)',
                          color: '#475569',
                          borderRadius: '8px',
                          height: 26,
                          '& .MuiChip-icon': { color: '#64748B' },
                        }}
                      />
                      <Chip
                        label={formatLabel(exam.format)}
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: fc.bg,
                          color: fc.color,
                          border: `1px solid ${fc.border}`,
                          borderRadius: '8px',
                          height: 26,
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={() => onStartExam(exam.id)}
                      sx={{
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        py: 1.1,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Vào thi ngay
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}

          {filteredExams.length === 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  py: 8,
                  textAlign: 'center',
                  bgcolor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px dashed #CBD5E1',
                }}
              >
                <AssignmentOutlinedIcon sx={{ fontSize: 40, color: '#CBD5E1', mb: 1 }} />
                <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  Chưa có đề thi nào cho khóa học này.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

  // Tìm các khóa học đã được kích hoạt qua mã hoặc có sẵn trong mock data
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

  // Chỉ hiển thị các đề thi thuộc về khóa học đang chọn
  const filteredExams = exams.filter(exam => exam.courseId === selectedCourseId);

  return (
    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
          Đề thi thử
        </Typography>

        {myCourses.length > 0 && (
          <FormControl sx={{ minWidth: 250 }} size="small">
            <InputLabel>Chọn khóa học</InputLabel>
            <Select
              value={selectedCourseId}
              label="Chọn khóa học"
              onChange={(e) => setSelectedCourseId(e.target.value)}
              sx={{ borderRadius: 1, bgcolor: '#fff' }}
            >
              {myCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {myCourses.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa kích hoạt khóa học nào.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredExams.map((exam) => (
            <Grid item xs={12} md={6} lg={4} key={exam.id}>
              <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1, color: '#3B82F6' }}>
                      <AssignmentIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', mb: 0.5, fontSize: '1.1rem' }}>
                        {exam.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" /> {exam.timeLimit} phút
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box mt={2}>
                    <Typography variant="body2" sx={{ color: '#4B5563', mb: 1 }}>
                      <strong>Định dạng:</strong> {exam.format === 'thpt_2025' ? 'THPT 2025 (Tin học)' : 'Tiêu chuẩn'}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, borderTop: '1px solid #F3F4F6' }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => onStartExam(exam.id)}
                    sx={{ bgcolor: '#3B82F6', borderRadius: 1, textTransform: 'none', fontWeight: 600 }}
                  >
                    Vào thi ngay
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
          {filteredExams.length === 0 && (
            <Grid item xs={12}>
              <Typography sx={{ color: '#6B7280' }}>Hiện chưa có đề thi nào cho khóa học này.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import { StorageService } from '../../../core/services/storage';
import { useNavigate } from 'react-router-dom';
import { courseThumbnails } from '../../../core/constants/courseThumbnails';

export const StudentCourses: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courses, activationCodes, refreshData, allUserProgress, lessons } = useData();
  const [openModal, setOpenModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');

  const userCodes = activationCodes.filter((c) => c.isUsed && c.usedByEmail === user?.email);
  const myCourses = courses.filter((course) => userCodes.some((c) => c.courseId === course.id));

  const handleActivate = () => {
    const codeObj = activationCodes.find((c) => c.code === inputCode);
    if (!codeObj) {
      setError('Mã không tồn tại!');
      return;
    }
    if (codeObj.isUsed) {
      setError('Mã đã được sử dụng!');
      return;
    }
    StorageService.updateActivationCode({
      ...codeObj,
      isUsed: true,
      status: 'Đã sử dụng',
      usedByEmail: user?.email,
      activationDate: new Date().toLocaleDateString('vi-VN'),
    });
    refreshData();
    setOpenModal(false);
    setInputCode('');
    setError('');
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1F2937', fontSize: '1.1rem' }}>
        Khóa học của tôi
      </Typography>

      <Grid container spacing={2.5}>
        {myCourses.map((course) => {
          const currentUserProgress = allUserProgress[user?.id || ''];
          const completedLessons = currentUserProgress?.completedLessons || [];
          const courseLessons = lessons.filter((l) => l.courseId === course.id);
          const completedCourseLessons = courseLessons.filter((l) => completedLessons.includes(l.id));
          const progress = courseLessons.length > 0 
            ? Math.round((completedCourseLessons.length / courseLessons.length) * 100)
            : 0;
            
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
              <Card
                onClick={() => navigate(`/courses/${course.id}`)}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid #F3F4F6',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  },
                }}
              >
                {/* Course Icon Area */}
                <Box
                  sx={{
                    height: 110,
                    background: courseThumbnails[course.id] ? 'transparent' : course.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {courseThumbnails[course.id] ? (
                    <Box
                      component="img"
                      src={courseThumbnails[course.id]}
                      alt={course.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff', textAlign: 'center', whiteSpace: 'pre-line' }}>
                      {course.shortTitle}
                    </Typography>
                  )}
                </Box>

                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1F2937', mb: 1 }}>
                    {course.title}
                  </Typography>

                  {/* Progress */}
                  <Typography sx={{ fontSize: '0.7rem', color: '#6B7280', mb: 0.5 }}>
                    Tiến độ: {progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      bgcolor: '#F3F4F6',
                      mb: 1.5,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        bgcolor: '#FF8C2F',
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    sx={{
                      bgcolor: '#FF8C2F',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      py: 0.8,
                      '&:hover': { bgcolor: '#FF6B00' },
                    }}
                  >
                    Tiếp tục
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {/* Add Course Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            onClick={() => setOpenModal(true)}
            sx={{
              height: '100%',
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px dashed #D1D5DB',
              borderRadius: 1,
              bgcolor: '#FAFAFA',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#FF8C2F',
                bgcolor: '#FFF8F2',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#FFF3E8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <AddIcon sx={{ fontSize: 24, color: '#FF8C2F' }} />
              </Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#6B7280' }}>
                Kích hoạt khóa học
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF', mt: 0.5 }}>
                Nhập mã kích hoạt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activation Modal */}
      <Dialog
        open={openModal}
        onClose={() => { setOpenModal(false); setError(''); }}
        PaperProps={{ sx: { borderRadius: 1, p: 1, minWidth: 380 } }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
            Nhập mã kích hoạt
          </Typography>
          <IconButton onClick={() => { setOpenModal(false); setError(''); }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.85rem', color: '#6B7280', mb: 2 }}>
            Nhập mã kích hoạt để mở khóa khóa học mới.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            placeholder="VD: MVA-EXCEL-0003"
            value={inputCode}
            onChange={(e) => { setInputCode(e.target.value.toUpperCase()); setError(''); }}
            error={!!error}
            helperText={error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF8C2F' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => { setOpenModal(false); setError(''); }}
            sx={{ color: '#6B7280', borderRadius: 1 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleActivate}
            variant="contained"
            sx={{
              bgcolor: '#FF8C2F',
              borderRadius: 1,
              fontWeight: 600,
              '&:hover': { bgcolor: '#FF6B00' },
            }}
          >
            Kích hoạt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

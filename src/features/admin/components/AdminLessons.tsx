import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, CircularProgress, Tooltip, Stack
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import type { Lesson } from '../../../core/types/global';

export const AdminLessons: React.FC = () => {
  const { courses, lessons, refreshData } = useData();
  
  // Safe fallbacks in case of HMR old context state
  const safeCourses = courses || [];
  const safeLessons = lessons || [];

  const [searchParams, setSearchParams] = useSearchParams();
  const courseParam = searchParams.get('course');
  const selectedCourseId = courseParam || (safeCourses.length > 0 ? safeCourses[0].id : '');

  const setSelectedCourseId = (id: string) => {
    setSearchParams(prev => {
      prev.set('course', id);
      return prev;
    }, { replace: true });
  };
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lesson>>({
    id: '', courseId: '', title: '', duration: '', videoUrl: '', order: 1
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await StorageService.uploadFile(file, 'lessons');
      if (url) {
        setFormData({ ...formData, videoUrl: url });
      } else {
        alert('Lỗi tải video. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi tải video');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredLessons = safeLessons.filter(l => l.courseId === selectedCourseId).sort((a, b) => a.order - b.order);

  const handleOpen = (lesson?: Lesson) => {
    if (lesson) {
      setFormData(lesson);
      setIsEditing(true);
    } else {
      setFormData({
        id: `l${Date.now()}`,
        courseId: selectedCourseId,
        title: '',
        duration: '',
        videoUrl: '',
        order: filteredLessons.length + 1
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (isEditing) {
      await StorageService.updateLesson(formData as Lesson);
    } else {
      await StorageService.saveLesson(formData as Lesson);
    }
    refreshData();
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      await StorageService.deleteLesson(id);
      refreshData();
    }
  };

  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#1F2937', m: 0, whiteSpace: 'nowrap' }}>
          Quản lý bài giảng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={!selectedCourseId}
          sx={{ 
            bgcolor: '#FF8C2F', 
            borderRadius: 1, 
            px: 3,
            boxShadow: '0 4px 14px 0 rgba(255, 140, 47, 0.39)',
            transition: 'all 0.2s',
            '&:hover': { 
              bgcolor: '#FF6B00',
              boxShadow: '0 6px 20px rgba(255, 140, 47, 0.23)'
            },
            whiteSpace: 'nowrap'
          }}
        >
          Thêm bài giảng
        </Button>
      </Stack>

      {/* Course Filter */}
      <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            select
            fullWidth
            label="Chọn khóa học để xem bài giảng"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            size="small"
          >
            {safeCourses.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* Lessons Table */}
      <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280', width: 80 }}>Thứ tự</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Tên bài giảng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Thời lượng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Video URL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#6B7280' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id} sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                      <TableCell sx={{ color: '#1F2937', fontWeight: 600 }}>{lesson.order}</TableCell>
                      <TableCell sx={{ color: '#1F2937', fontWeight: 600 }}>{lesson.title}</TableCell>
                      <TableCell sx={{ color: '#6B7280' }}>{lesson.duration}</TableCell>
                      <TableCell sx={{ color: '#3B82F6', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lesson.videoUrl}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa bài giảng">
                          <IconButton size="small" onClick={() => handleOpen(lesson)} sx={{ color: '#3B82F6', mr: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa bài giảng">
                          <IconButton size="small" onClick={() => handleDelete(lesson.id)} sx={{ color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#6B7280' }}>
                      Chưa có bài giảng nào trong khóa học này.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Lesson Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isEditing ? 'Chỉnh sửa bài giảng' : 'Thêm bài giảng mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Tên bài giảng"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Thời lượng (VD: 12:30)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth type="number" label="Thứ tự bài"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} alignItems="center">
                <TextField
                  fullWidth label="Link Video (YouTube, Vimeo, hoặc file Upload)"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                <Button 
                  variant="contained" 
                  component="label"
                  startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                  disabled={isUploading}
                  sx={{ minWidth: 150, height: 56, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  {isUploading ? 'Đang tải...' : 'Tải Video'}
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleUploadVideo}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Hủy bỏ</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.title || !formData.videoUrl || isUploading}
            sx={{ 
              bgcolor: '#FF8C2F', 
              borderRadius: 1, 
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(255, 140, 47, 0.39)',
              '&:hover': { bgcolor: '#FF6B00' } 
            }}
          >
            Lưu bài giảng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

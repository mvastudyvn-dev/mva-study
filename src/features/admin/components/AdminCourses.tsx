import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Tooltip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import type { Course } from '../../../core/types/global';
import { courseThumbnails } from '../../../core/constants/courseThumbnails';

export const AdminCourses: React.FC = () => {
  const { courses, refreshData } = useData();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({
    id: '', title: '', shortTitle: '', description: '', icon: '🎓',
    lessonsCount: 0, rating: 5, ratingCount: 0, price: 0,
    colorCode: '#FF8C2F', bgGradient: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
    durationMonths: 6,
  });

  const handleOpen = (course?: Course) => {
    if (course) {
      setFormData(course);
      setIsEditing(true);
    } else {
      setFormData({
        id: `c${Date.now()}`, title: '', shortTitle: '', description: '', icon: '🎓',
        lessonsCount: 0, rating: 5, ratingCount: 0, price: 0,
        colorCode: '#FF8C2F', bgGradient: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
        durationMonths: 6,
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (isEditing) {
      await StorageService.updateCourse(formData as Course);
    } else {
      await StorageService.saveCourse(formData as Course);
    }
    refreshData();
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      await StorageService.deleteCourse(id);
      refreshData();
    }
  };

  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#1F2937', m: 0, whiteSpace: 'nowrap' }}>
          Quản lý khóa học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
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
          Thêm khóa học
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Icon</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Tên khóa học</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Mã khóa</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Thời hạn</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Giá (VNĐ)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#6B7280' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                    <TableCell sx={{ color: '#1F2937', fontWeight: 500 }}>{course.id}</TableCell>
                    <TableCell sx={{ fontSize: '1.5rem' }}>
                      {courseThumbnails[course.id] ? (
                        <Box component="img" src={courseThumbnails[course.id]} sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }} />
                      ) : (
                        course.icon
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#1F2937', fontWeight: 600 }}>{course.title}</TableCell>
                    <TableCell sx={{ color: '#6B7280' }}>{course.shortTitle}</TableCell>
                    <TableCell sx={{ color: '#6B7280' }}>{course.durationMonths ? `${course.durationMonths} tháng` : 'Vĩnh viễn'}</TableCell>
                    <TableCell sx={{ color: '#FF8C2F', fontWeight: 600 }}>{course.price.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Chỉnh sửa khóa học">
                        <IconButton size="small" onClick={() => handleOpen(course)} sx={{ color: '#3B82F6', mr: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa khóa học">
                        <IconButton size="small" onClick={() => handleDelete(course.id)} sx={{ color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Course Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isEditing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Tên khóa học"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Mã khóa (Short Title)"
                value={formData.shortTitle}
                onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Icon (Emoji)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Mô tả" multiline rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth type="number" label="Giá (VNĐ)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth type="number" label="Thời hạn (Tháng)"
                value={formData.durationMonths || 0}
                onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                helperText="Nhập 0 cho vĩnh viễn"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Ảnh thumbnail (URL)"
                value={formData.thumbnail || ''}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                helperText="URL ảnh bìa khóa học (để trống nếu dùng icon emoji)"
                placeholder="https://... hoặc /images/courses/ten-anh.png"
              />
              {formData.thumbnail && (
                <Box
                  component="img"
                  src={formData.thumbnail}
                  alt="preview"
                  sx={{ mt: 1, width: '100%', height: 120, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#6B7280', fontWeight: 600 }}>Hủy bỏ</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.title}
            sx={{ 
              bgcolor: '#FF8C2F', 
              borderRadius: 1, 
              px: 3,
              boxShadow: '0 4px 14px 0 rgba(255, 140, 47, 0.39)',
              '&:hover': { bgcolor: '#FF6B00' } 
            }}
          >
            Lưu khóa học
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

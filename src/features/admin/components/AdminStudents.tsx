import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, Grid, Button
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import type { User } from '../../../core/types/global';

export const AdminStudents: React.FC = () => {
  const { users, refreshData } = useData();
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const students = (users || []).filter(u => u.role === 'student');

  const handleToggleLock = async (user: User) => {
    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    if (window.confirm(`Bạn có chắc muốn ${newStatus === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản của ${user.name}?`)) {
      await StorageService.updateUser({ ...user, status: newStatus });
      refreshData();
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', mb: 3 }}>
        Quản lý Học viên
      </Typography>

      <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Họ và tên / Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Lớp & Trường</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Khóa học</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>{student.name}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{student.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>{student.class || 'N/A'} - {student.school || 'N/A'}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{student.province || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={`${(student.enrolledCourses || []).length} khóa`} sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={student.status === 'locked' ? 'Bị khóa' : 'Hoạt động'} 
                      color={student.status === 'locked' ? 'error' : 'success'} 
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton color="info" onClick={() => setSelectedStudent(student)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      color={student.status === 'locked' ? 'success' : 'error'} 
                      onClick={() => handleToggleLock(student)}
                      title={student.status === 'locked' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    >
                      {student.status === 'locked' ? <LockOpenIcon /> : <LockIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#6B7280' }}>
                    Chưa có học viên nào trong hệ thống.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Chi tiết học viên */}
      <Dialog 
        open={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, p: 1 } }}
      >
        {selectedStudent && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Hồ sơ Học viên</Typography>
              <IconButton onClick={() => setSelectedStudent(null)} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Họ và tên</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Ngày sinh</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.dob || 'Chưa cập nhật'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Lớp</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.class || 'Chưa cập nhật'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Trường</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.school || 'Chưa cập nhật'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Tỉnh/Thành phố</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.province || 'Chưa cập nhật'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Ngày tham gia</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStudent.joinDate || 'Chưa rõ'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Mã các khóa đã đăng ký</Typography>
                  <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
                    {(selectedStudent.enrolledCourses || []).map(cid => (
                      <Chip key={cid} label={cid} size="small" sx={{ bgcolor: '#FFF8F2', color: '#FF8C2F', fontWeight: 600 }} />
                    ))}
                    {!(selectedStudent.enrolledCourses || []).length && (
                      <Typography variant="body2" color="text.secondary">Chưa đăng ký khóa nào</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Box mt={3} p={2} bgcolor="#F9FAFB" borderRadius={2} textAlign="center">
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Báo cáo tiến độ chi tiết đang được xây dựng ở Phase tiếp theo.
                </Typography>
                <Button variant="outlined" size="small" disabled>Xem biểu đồ học tập</Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

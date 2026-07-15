import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';

export const ActivationCodesTable: React.FC = () => {
  const { activationCodes, courses, refreshData } = useData();
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleGen = async () => {
    const course = courses.find((c) => c.id === selectedCourse);
    for (let i = 0; i < quantity; i++) {
      const randomPart = Array.from({ length: 9 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
      await StorageService.saveActivationCode({
        code: `MVA${randomPart}`,
        courseId: selectedCourse || 'c1',
        courseName: course?.title || 'IC3 GS6',
        status: 'Chưa sử dụng',
        isUsed: false,
      });
    }
    refreshData();
    setOpen(false);
    setSelectedCourse('');
    setQuantity(1);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add a toast here
  };

  const handleDelete = async (code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mã ${code} không?`)) {
      await StorageService.deleteActivationCode(code);
      refreshData();
    }
  };

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none', mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm="auto">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem', lineHeight: 1.5 }}>
              Mã kích hoạt gần đây
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
                sx={{
                  bgcolor: '#FF8C2F',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#FF6B00' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Tạo mã mới
              </Button>
            </Box>
          </Grid>
        </Grid>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>Mã kích hoạt</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>Khóa học</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>Người dùng</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>Ngày kích hoạt</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6', textAlign: 'right' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activationCodes.map((code) => (
                <TableRow key={code.code} sx={{ '&:hover': { bgcolor: '#FAFAFA' }, '& td': { borderBottom: '1px solid #F3F4F6' } }}>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1F2937' }}>{code.code}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{code.courseName}</TableCell>
                  <TableCell>
                    <Chip
                      label={code.isUsed ? 'Đã sử dụng' : code.usedByEmail ? 'Đã bán' : 'Chưa sử dụng'}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        height: 24,
                        bgcolor: code.isUsed ? '#ECFDF5' : code.usedByEmail ? '#EFF6FF' : '#FFF8F2',
                        color: code.isUsed ? '#059669' : code.usedByEmail ? '#3B82F6' : '#FF8C2F',
                        border: `1px solid ${code.isUsed ? '#A7F3D0' : code.usedByEmail ? '#BFDBFE' : '#FFD4A8'}`,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{code.usedByEmail || '—'}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#6B7280' }}>{code.activationDate || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleCopy(code.code)} sx={{ color: '#6B7280' }}><ContentCopyIcon fontSize="small" /></IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(code.code)} 
                      disabled={code.isUsed || !!code.usedByEmail}
                      sx={{ color: (code.isUsed || !!code.usedByEmail) ? '#E5E7EB' : '#EF4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Generate Code Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 1, p: 1, minWidth: 380 } }}>
          <DialogTitle><Typography variant="h6" sx={{ fontWeight: 700 }}>Tạo mã kích hoạt mới</Typography></DialogTitle>
          <DialogContent>
            <TextField select fullWidth label="Chọn khóa học" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} sx={{ mt: 1 }}>
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
              ))}
            </TextField>
            <TextField 
              fullWidth 
              label="Số lượng" 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
              sx={{ mt: 2 }} 
              inputProps={{ min: 1, max: 100 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#6B7280' }}>Hủy</Button>
            <Button onClick={handleGen} variant="contained" disabled={!selectedCourse} sx={{ bgcolor: '#FF8C2F', fontWeight: 600, borderRadius: 1, '&:hover': { bgcolor: '#FF6B00' } }}>Tạo mã</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

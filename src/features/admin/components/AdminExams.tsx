import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem, Tooltip, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import type { Exam } from '../../../core/types/global';
import * as XLSX from 'xlsx';

export const AdminExams: React.FC = () => {
  const { courses, exams, refreshData } = useData();
  
  // Safe fallbacks for HMR
  const safeCourses = courses || [];
  const safeExams = exams || [];

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
  const [formData, setFormData] = useState<Partial<Exam>>({
    id: '', courseId: '', title: '', timeLimit: 50, format: 'thpt_2025', fileUrl: '', answerKey: ''
  });
  const [answerKeyText, setAnswerKeyText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredExams = safeExams.filter(e => e.courseId === selectedCourseId);

  const defaultTHPTKey = JSON.stringify({
    part1: Array(24).fill('A'),
    part2: Array(6).fill(['T', 'F', 'T', 'F'])
  }, null, 2);

  const defaultStandardKey = JSON.stringify({
    part1: Array(10).fill('A')
  }, null, 2);

  const handleDownloadTemplate = () => {
    const ws_data = [
      ['Phần', 'Câu số', 'Đáp án (Phần 1) / Ý a (Phần 2)', 'Ý b (Chỉ dùng cho Phần 2)', 'Ý c (Chỉ dùng cho Phần 2)', 'Ý d (Chỉ dùng cho Phần 2)']
    ];
    for (let i = 1; i <= 24; i++) ws_data.push([1, i, 'A']);
    for (let i = 1; i <= 6; i++) ws_data.push([2, i, 'Đ', 'S', 'Đ', 'S']);
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DapAn");
    XLSX.writeFile(wb, "Template_DapAn_THPT2025.xlsx");
  };

  const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        const part1 = Array(24).fill('A');
        const part2 = Array(6).fill(['T', 'F', 'T', 'F']);
        
        // Bỏ qua dòng tiêu đề (index 0)
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length < 3) continue;
          const phan = Number(row[0]);
          const cau = Number(row[1]);
          if (phan === 1 && cau >= 1 && cau <= 24) {
            part1[cau - 1] = String(row[2]).trim().toUpperCase();
          } else if (phan === 2 && cau >= 1 && cau <= 6) {
            const yA = String(row[2] || 'S').trim().toUpperCase() === 'Đ' ? 'T' : 'F';
            const yB = String(row[3] || 'S').trim().toUpperCase() === 'Đ' ? 'T' : 'F';
            const yC = String(row[4] || 'S').trim().toUpperCase() === 'Đ' ? 'T' : 'F';
            const yD = String(row[5] || 'S').trim().toUpperCase() === 'Đ' ? 'T' : 'F';
            part2[cau - 1] = [yA, yB, yC, yD];
          }
        }
        
        setAnswerKeyText(JSON.stringify({ part1, part2 }, null, 2));
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đọc file Excel. Vui lòng đảm bảo file đúng định dạng mẫu.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpen = (exam?: Exam) => {
    if (exam) {
      setFormData(exam);
      setAnswerKeyText(typeof exam.answerKey === 'object' ? JSON.stringify(exam.answerKey, null, 2) : exam.answerKey || '');
      setIsEditing(true);
    } else {
      setFormData({
        id: `e${Date.now()}`,
        courseId: selectedCourseId,
        title: '',
        timeLimit: 50,
        format: 'thpt_2025',
        fileUrl: '',
      });
      setAnswerKeyText(defaultTHPTKey);
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    let parsedKey = answerKeyText;
    try {
      parsedKey = JSON.parse(answerKeyText);
    } catch(_e) {
      // If not valid JSON, keep as string
    }

    const examToSave = { ...formData, answerKey: parsedKey } as Exam;
    
    if (isEditing) {
      await StorageService.updateExam(examToSave);
    } else {
      await StorageService.saveExam(examToSave);
    }
    refreshData();
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi thử này?')) {
      await StorageService.deleteExam(id);
      refreshData();
    }
  };

  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#1F2937', lineHeight: 1.5, m: 0, whiteSpace: 'nowrap' }}>
          Quản lý Đề thi thử
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
          Thêm đề thi
        </Button>
      </Stack>

      {/* Course Filter */}
      <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            select
            fullWidth
            label="Chọn khóa học để xem đề thi thử"
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

      {/* Exams Table */}
      <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Tên đề thi</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Định dạng</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Thời gian làm bài</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6B7280' }}>Link Đề thi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#6B7280' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <TableRow key={exam.id} sx={{ '&:hover': { bgcolor: '#FAFAFA' } }}>
                      <TableCell sx={{ color: '#1F2937', fontWeight: 600 }}>{exam.title}</TableCell>
                      <TableCell sx={{ color: '#1F2937' }}>
                        {exam.format === 'thpt_2025' ? 'THPT 2025 (Tin học)' : 'Tiêu chuẩn'}
                      </TableCell>
                      <TableCell sx={{ color: '#6B7280' }}>{exam.timeLimit} phút</TableCell>
                      <TableCell sx={{ color: '#3B82F6', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <a href={exam.fileUrl} target="_blank" rel="noreferrer">{exam.fileUrl || 'Chưa có link'}</a>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa đề thi">
                          <IconButton size="small" onClick={() => handleOpen(exam)} sx={{ color: '#3B82F6', mr: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa đề thi">
                          <IconButton size="small" onClick={() => handleDelete(exam.id)} sx={{ color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#6B7280' }}>
                      Chưa có đề thi thử nào trong khóa học này.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Exam Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isEditing ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth label="Tên đề thi thử"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth type="number" label="Thời gian (Phút)"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth label="Định dạng bài thi"
                value={formData.format || 'standard'}
                onChange={(e) => {
                  const newFormat = e.target.value as any;
                  setFormData({ ...formData, format: newFormat });
                  setAnswerKeyText(newFormat === 'standard' ? defaultStandardKey : defaultTHPTKey);
                }}
              >
                <MenuItem value="thpt_2025">Cấu trúc THPT 2025 (Tin học)</MenuItem>
                <MenuItem value="standard">Tiêu chuẩn (A,B,C,D)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Link File Đề thi (Google Drive / URL)"
                value={formData.fileUrl || ''}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} mb={1}>
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadTemplate}
                  size="small"
                >
                  Tải File Mẫu (Excel)
                </Button>
                <Button 
                  variant="contained" 
                  component="label"
                  startIcon={<UploadIcon />}
                  size="small"
                  sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Tải lên Đáp án (Excel)
                  <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls, .csv"
                    ref={fileInputRef}
                    onChange={handleUploadExcel}
                  />
                </Button>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={10}
                label="Đáp án (JSON)"
                value={answerKeyText}
                onChange={(e) => setAnswerKeyText(e.target.value)}
                helperText="Bạn có thể sửa trực tiếp chuỗi JSON ở đây sau khi tải Excel lên."
                sx={{ fontFamily: 'monospace' }}
              />
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
            Lưu đề thi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

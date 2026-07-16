import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Checkbox, FormControlLabel, Grid, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useData } from '../../../core/contexts/DataContext';

export const AdminTuition: React.FC = () => {
  const { users } = useData();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter only students
  const students = (users || []).filter(u => u.role === 'student');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/tuition');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvoices(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách học phí:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateInvoice = async () => {
    if (selectedUsers.length === 0 || !amount || !description) {
      alert('Vui lòng điền đầy đủ thông tin (Học sinh, Số tiền, Nội dung).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payment/create-tuition-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers,
          amount: Number(amount),
          description
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Tạo hóa đơn và gửi email thành công!');
        setOpenModal(false);
        setSelectedUsers([]);
        setAmount('');
        setDescription('');
        fetchInvoices();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi hệ thống khi gọi API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return <Chip label="Đã thanh toán" color="success" size="small" />;
      case 'pending':
        return <Chip label="Đang chờ" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="Đã hủy" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Quản lý Học phí</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          + Tạo đơn thanh toán
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Học sinh</b></TableCell>
                <TableCell><b>Số tiền</b></TableCell>
                <TableCell><b>Nội dung</b></TableCell>
                <TableCell><b>Trạng thái</b></TableCell>
                <TableCell><b>Ngày tạo</b></TableCell>
                <TableCell><b>Mã PayOS</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Chưa có hóa đơn nào.</TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>{invoice.userName || invoice.userId} <br/> <small style={{color: '#888'}}>{invoice.userEmail}</small></TableCell>
                    <TableCell>{Number(invoice.amount).toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{renderStatus(invoice.status)}</TableCell>
                    <TableCell>{new Date(invoice.createdAt || '').toLocaleString('vi-VN')}</TableCell>
                    <TableCell>{invoice.orderCode || '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal Tạo Hóa Đơn */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tạo hóa đơn học phí
          <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Chọn học sinh (Trải dài 100%) */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Chọn học sinh ({selectedUsers.length} đã chọn):
              </Typography>
              <Paper variant="outlined" sx={{ width: '100%', maxHeight: 300, overflow: 'auto', p: 1 }}>
                {students.length === 0 ? (
                  <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>Không có học sinh nào trong hệ thống.</Typography>
                ) : (
                  students.map(student => (
                    <Box key={student.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={selectedUsers.includes(student.id)} 
                            onChange={() => handleToggleUser(student.id)} 
                          />
                        }
                        label={
                          <Box sx={{ pr: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-word' }}>
                              {student.email}
                              {` • SN: ${((student as any).birthYear || student.dob) ? ((student as any).birthYear || (student.dob?.includes('-') ? student.dob.split('-')[0] : (student.dob?.includes('/') ? student.dob.split('/')[2] : student.dob))) : 'Chưa có'}`}
                              {student.school && ` • THPT ${student.school.replace(/^THPT\s+/i, '')}`}
                            </Typography>
                          </Box>
                        }
                        sx={{ ml: 0, width: '100%', py: 0.5 }}
                      />
                    </Box>
                  ))
                )}
              </Paper>
            </Box>

            {/* Thông tin hóa đơn */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Thông tin hóa đơn:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Số tiền (VNĐ)"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  InputProps={{ inputProps: { min: 1000 } }}
                />
                <TextField
                  fullWidth
                  label="Nội dung"
                  placeholder="VD: Học phí tháng 7 - Toán"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </Box>
            </Box>

            {/* Lưu ý */}
            <Box sx={{ p: 2, bgcolor: '#FFF8F2', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark">
                * Hệ thống sẽ tạo hóa đơn và tự động gửi email nhắc nhở thanh toán đến <strong>{selectedUsers.length}</strong> học sinh đã chọn.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Hủy</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateInvoice}
            disabled={isSubmitting || selectedUsers.length === 0 || !amount || !description}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Tạo hóa đơn'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

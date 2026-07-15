import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import type { Course } from '../../core/types/global';

interface PaymentModalProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, course, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!course) return;
    setLoading(true);
    setError(null);

    try {
      // Giả sử có 1 userId cố định để test nếu chưa làm auth (bạn cần thay bằng userId thực tế sau khi có chức năng login)
      const userSession = localStorage.getItem('mva_session');
      const currentUser = userSession ? JSON.parse(userSession) : null;
      
      const userId = currentUser?.id || 'guest_123'; // Tạm thời dùng guest nếu chưa login

      const response = await fetch('/api/payment/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          courseId: course.id,
          courseName: course.title,
          amount: course.price,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Chuyển hướng người dùng sang trang thanh toán của PayOS
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Lỗi tạo link thanh toán');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1F2937' }}>
        Xác nhận thanh toán
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">Khóa học bạn chọn:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E3A8A' }}>
            {course.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#F3F4F6', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Tổng thanh toán:</Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#FF8C2F' }}>
            {new Intl.NumberFormat('vi-VN').format(course.price)} đ
          </Typography>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2, fontSize: '0.9rem' }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Hủy bỏ
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePayment} 
          disabled={loading}
          sx={{ bgcolor: '#FF8C2F', '&:hover': { bgcolor: '#E07B29' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Thanh toán qua PayOS'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;

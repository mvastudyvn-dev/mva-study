import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Button, CircularProgress
} from '@mui/material';
import { useAuth } from '../../../core/contexts/AuthContext';

export const StudentTuition: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingFor, setPayingFor] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/tuition/${user?.id}`);
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

  const handlePayment = async (invoiceId: string) => {
    setPayingFor(invoiceId);
    try {
      const res = await fetch('/api/payment/create-tuition-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Lỗi: ' + (data.error || 'Không thể tạo link thanh toán'));
        setPayingFor(null);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi hệ thống khi gọi API.');
      setPayingFor(null);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return <Chip label="Đã thanh toán" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'pending':
        return <Chip label="Chưa thanh toán" color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'cancelled':
        return <Chip label="Đã hủy" color="default" size="small" sx={{ fontWeight: 'bold' }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#1F2937' }}>
        Học phí của tôi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Danh sách các khoản học phí cần thanh toán. Cảm ơn bạn đã đồng hành cùng MVA Study!
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell><b>Nội dung</b></TableCell>
                <TableCell><b>Số tiền</b></TableCell>
                <TableCell><b>Trạng thái</b></TableCell>
                <TableCell><b>Ngày tạo</b></TableCell>
                <TableCell align="right"><b>Thao tác</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">Bạn chưa có khoản học phí nào.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{invoice.description}</TableCell>
                    <TableCell sx={{ color: '#FF8C2F', fontWeight: 'bold' }}>
                      {Number(invoice.amount).toLocaleString('vi-VN')} đ
                    </TableCell>
                    <TableCell>{renderStatus(invoice.status)}</TableCell>
                    <TableCell>{new Date(invoice.created_at || '').toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      {invoice.status === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ 
                            bgcolor: '#FF8C2F', 
                            '&:hover': { bgcolor: '#E67E22' },
                            fontWeight: 'bold',
                            textTransform: 'none'
                          }}
                          disabled={payingFor === invoice.id}
                          onClick={() => handlePayment(invoice.id)}
                        >
                          {payingFor === invoice.id ? 'Đang chuyển...' : 'Thanh toán ngay'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

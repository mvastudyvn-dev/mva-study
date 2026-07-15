import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, CircularProgress } from '@mui/material';
import { StorageService } from '../../../core/services/storage';
import { useData } from '../../../core/contexts/DataContext';
import type { Order } from '../../../core/types/global';

export const AdminOrders: React.FC = () => {
  const { users, courses } = useData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuingCodeFor, setIssuingCodeFor] = useState<string | number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await StorageService.getOrders();
    // Sort orders by created_at desc (newest first)
    data.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    setOrders(data);
    setLoading(false);
  };

  const handleIssueCode = async (orderCode: string | number) => {
    setIssuingCodeFor(orderCode);
    try {
      const res = await fetch('/api/payment/issue-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode })
      });
      const data = await res.json();
      if (data.success) {
        alert('Cấp mã và gửi Email thành công!');
        fetchOrders();
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (error) {
      alert('Đã xảy ra lỗi hệ thống khi gọi API.');
    } finally {
      setIssuingCodeFor(null);
    }
  };

  const getUserName = (userId: string) => {
    const u = users.find(x => x.id === userId);
    return u ? `${u.name} (${u.email})` : userId;
  };

  const getCourseName = (courseId: string) => {
    const c = courses.find(x => x.id === courseId);
    return c ? c.title : courseId;
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return <Chip label="Đã thanh toán" color="success" size="small" />;
      case 'needs_manual_code':
        return <Chip label="Thiếu mã kích hoạt" color="error" size="small" />;
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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Quản lý Đơn hàng</Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Mã ĐH</b></TableCell>
                <TableCell><b>Học sinh</b></TableCell>
                <TableCell><b>Khóa học</b></TableCell>
                <TableCell><b>Số tiền</b></TableCell>
                <TableCell><b>Trạng thái</b></TableCell>
                <TableCell><b>Thời gian</b></TableCell>
                <TableCell align="right"><b>Hành động</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Chưa có đơn hàng nào.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.order_code} hover>
                    <TableCell>{order.order_code}</TableCell>
                    <TableCell>{getUserName(order.user_id)}</TableCell>
                    <TableCell>{getCourseName(order.course_id)}</TableCell>
                    <TableCell>{order.amount.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>{renderStatus(order.status)}</TableCell>
                    <TableCell>{new Date(order.created_at || '').toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      {order.status === 'needs_manual_code' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={issuingCodeFor === order.order_code}
                          onClick={() => handleIssueCode(order.order_code)}
                        >
                          {issuingCodeFor === order.order_code ? 'Đang xử lý...' : 'Cấp mã bù'}
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

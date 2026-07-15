import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Header, Footer } from '../features/landing';
import { useData } from '../core/contexts/DataContext';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshData } = useData();
  const status = searchParams.get('status');
  const cancel = searchParams.get('cancel');
  
  // PayOS ghi đè tham số status thành 'PAID' hoặc 'CANCELLED'
  const isSuccess = status === 'PAID' || status === 'success' || cancel === 'false';
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isSuccess) {
      refreshData();
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/courses');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 4, border: '1px solid #E5E7EB' }}>
            {isSuccess ? (
              <>
                <CheckCircleOutlinedIcon sx={{ fontSize: 80, color: '#10B981', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1F2937' }}>
                  Thanh toán thành công!
                </Typography>
                <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, lineHeight: 1.6 }}>
                  Hệ thống đã nhận được thanh toán của bạn. Một email chứa mã kích hoạt khóa học vừa được tự động gửi đến hòm thư của bạn. Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam) nhé.
                </Typography>
              </>
            ) : (
              <>
                <CancelOutlinedIcon sx={{ fontSize: 80, color: '#EF4444', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1F2937' }}>
                  Thanh toán đã hủy
                </Typography>
                <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, lineHeight: 1.6 }}>
                  Giao dịch thanh toán chưa được hoàn tất. Nếu bạn gặp lỗi trong quá trình thanh toán, vui lòng liên hệ với bộ phận CSKH của chúng tôi để được hỗ trợ.
                </Typography>
              </>
            )}

            <Button 
              variant="contained" 
              onClick={() => navigate('/courses')}
              sx={{ bgcolor: '#FF8C2F', '&:hover': { bgcolor: '#E07B29' }, px: 4, py: 1.5, borderRadius: 2 }}
            >
              Quay lại danh sách khóa học ({countdown}s)
            </Button>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default PaymentResultPage;

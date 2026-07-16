import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header, Footer, Chatbot } from '../features/landing';

const PaymentPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F3F4F6' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: { xs: 3, md: 6 }, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center', mb: 4, textTransform: 'uppercase' }}>
              CHÍNH SÁCH THANH TOÁN
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              Hình thức thanh toán và phương thức cung ứng dịch vụ
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 2, lineHeight: 1.8 }}>
              1. Bạn có thể mua tài khoản MVA Study bằng tiền mặt hoặc chuyển khoản vào tài khoản ngân hàng của MVA Study. Sau khi nhận được chuyển khoản, MVA Study sẽ tiến hành nâng cấp tài khoản của bạn trong vòng 24 tiếng.
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 2, lineHeight: 1.8 }}>
              2. Nếu bạn không trả phí đúng hạn, tài khoản mà bạn đã đăng kí sẽ vẫn hoạt động tuy nhiên bạn sẽ không thể xem video các khoá học.
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 2, lineHeight: 1.8 }}>
              3. MVA Study cung cấp gói dùng thử miễn phí các tính năng xem video bài giảng để bạn có thể trải nghiệm sản phẩm trước khi quyết định mua. Vì vậy khi đã nâng cấp tài khoản, MVA Study không hỗ trợ hoàn trả phí. Nếu bạn hủy Dịch vụ giữa chừng, phần tiền dư cho thời gian còn lại chúng tôi không hoàn trả.
            </Typography>

          </Box>
        </Container>
      </Box>
      <Footer />
      <Chatbot />
    </Box>
  );
};

export default PaymentPolicyPage;

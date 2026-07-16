import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header, Footer, Chatbot } from '../features/landing';

const PaymentGuidePage: React.FC = () => {
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
              HƯỚNG DẪN THANH TOÁN
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, lineHeight: 1.8 }}>
              Chào mừng bạn đến với trang Hướng dẫn thanh toán của MVA Study. Nhằm mang lại sự thuận tiện tối đa cho học viên, chúng tôi hỗ trợ nhiều phương thức thanh toán linh hoạt và an toàn. Vui lòng làm theo các hướng dẫn dưới đây để hoàn tất việc đăng ký khóa học.
            </Typography>

            {/* Phương thức 1: Chuyển khoản ngân hàng */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                1. Chuyển khoản ngân hàng
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 2, lineHeight: 1.8 }}>
                Đây là phương thức thanh toán phổ biến và nhanh chóng nhất. Học viên có thể chuyển khoản học phí qua Internet Banking hoặc nộp tiền trực tiếp tại quầy giao dịch ngân hàng theo thông tin sau:
              </Typography>
              <Box sx={{ bgcolor: '#F9FAFB', p: 3, borderRadius: 2, border: '1px solid #E5E7EB' }}>
                <Typography variant="body1" sx={{ color: '#1F2937', fontWeight: 600, mb: 1 }}>Thông tin tài khoản:</Typography>
                <Typography variant="body2" sx={{ color: '#4B5563', mb: 0.5 }}>- Ngân hàng: <Box component="span" sx={{ fontWeight: 600 }}>Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</Box></Typography>
                <Typography variant="body2" sx={{ color: '#4B5563', mb: 0.5 }}>- Tên tài khoản: <Box component="span" sx={{ fontWeight: 600 }}>CÔNG TY TNHH MVA STUDY</Box></Typography>
                <Typography variant="body2" sx={{ color: '#4B5563', mb: 0.5 }}>- Số tài khoản: <Box component="span" sx={{ fontWeight: 600 }}>0123456789</Box></Typography>
                <Typography variant="body2" sx={{ color: '#4B5563', mt: 2 }}>
                  - Nội dung chuyển khoản: <Box component="span" sx={{ fontWeight: 600, color: 'error.main' }}>[Họ và tên] - [Số điện thoại] - [Tên khóa học]</Box>
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic', mt: 2 }}>
                *Lưu ý: Sau khi chuyển khoản thành công, hệ thống sẽ tự động kích hoạt khóa học trong vòng 5-10 phút. Nếu sau 30 phút chưa được kích hoạt, vui lòng liên hệ bộ phận Chăm sóc khách hàng.
              </Typography>
            </Box>

            {/* Phương thức 2: Thanh toán trực tuyến */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                2. Thanh toán trực tuyến (Cổng thanh toán/Ví điện tử)
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                MVA Study hỗ trợ thanh toán trực tiếp trên website qua các cổng thanh toán uy tín và ví điện tử:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• VNPay / Momo / ZaloPay:</Box> Quét mã QR code trên màn hình thanh toán bằng ứng dụng ngân hàng hoặc ví điện tử tương ứng.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Thẻ ATM nội địa / Thẻ quốc tế (Visa, Mastercard):</Box> Nhập thông tin thẻ trên cổng thanh toán bảo mật của chúng tôi.
              </Typography>
            </Box>

            {/* Phương thức 3: Thanh toán trực tiếp */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                3. Thanh toán trực tiếp tại trung tâm
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Nếu bạn muốn được tư vấn trực tiếp và thanh toán bằng tiền mặt, bạn có thể đến văn phòng của MVA Study trong giờ hành chính (8h00 - 17h30, từ Thứ 2 đến Thứ 7):
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Địa chỉ:</Box> Văn phòng MVA Study, Hà Nội, Việt Nam.
              </Typography>
            </Box>

            {/* Hỗ trợ */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                4. Cần hỗ trợ?
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Trong quá trình thanh toán, nếu có bất kỳ thắc mắc hoặc sự cố nào, xin vui lòng liên hệ ngay với chúng tôi:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 0.5, lineHeight: 1.8 }}>
                - Hotline: <Box component="span" sx={{ fontWeight: 700 }}>0123 456 789</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 0.5, lineHeight: 1.8 }}>
                - Email hỗ trợ: <Box component="span" sx={{ fontWeight: 700 }}>support@mvastudy.vn</Box>
              </Typography>
            </Box>

          </Box>
        </Container>
      </Box>
      <Footer />
      <Chatbot />
    </Box>
  );
};

export default PaymentGuidePage;

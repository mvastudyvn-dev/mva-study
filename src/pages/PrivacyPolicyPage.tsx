import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header, Footer, Chatbot } from '../features/landing';

const PrivacyPolicyPage: React.FC = () => {
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
              CHÍNH SÁCH BẢO MẬT
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, lineHeight: 1.8 }}>
              Tại MVA Study, chúng tôi cam kết bảo vệ quyền riêng tư và an toàn thông tin của người dùng. Chính sách Bảo Mật này cung cấp cái nhìn chi tiết về cách thức chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn truy cập và sử dụng dịch vụ của chúng tôi.
            </Typography>

            {/* Mục I */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅰ. Thông Tin Chúng Tôi Thu Thập:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Thông Tin Cá Nhân:</Box> Khi đăng ký sử dụng dịch vụ của chúng tôi, bạn có thể cần cung cấp tên, địa chỉ email, ngày sinh, và địa chỉ liên lạc.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Thông Tin Tự Động Thu Thập:</Box> Chúng tôi cũng thu thập thông tin về cách bạn sử dụng dịch vụ của chúng tôi, bao gồm loại trình duyệt, thời gian truy cập, và các trang bạn đã xem.
              </Typography>
            </Box>

            {/* Mục II */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅱ. Mục Đích Sử Dụng Thông Tin:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Cải Thiện Dịch Vụ:</Box> Thông tin của bạn giúp chúng tôi cá nhân hóa trải nghiệm của bạn và cải thiện các dịch vụ của chúng tôi.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Hỗ Trợ Khách Hàng:</Box> Thông tin cá nhân bạn cung cấp cho phép chúng tôi trả lời các câu hỏi và giải quyết các vấn đề bạn có thể gặp phải.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Thông Tin và Ưu Đãi:</Box> Chúng tôi có thể gửi thông tin về các dịch vụ mới hoặc các ưu đãi đặc biệt mà bạn có thể quan tâm, nếu bạn chọn nhận thông tin này.
              </Typography>
            </Box>

            {/* Mục III */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅲ. Chia Sẻ Thông Tin:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Không Chia Sẻ Thông Tin:</Box> MVA Study cam kết không bán, cho thuê, hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào mà không có sự đồng ý rõ ràng từ bạn, trừ khi pháp luật yêu cầu.
              </Typography>
            </Box>

            {/* Mục IV */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅳ. Bảo Mật Thông Tin:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Biện Pháp Bảo Mật:</Box> Chúng tôi áp dụng các biện pháp bảo mật công nghệ và tổ chức để bảo vệ thông tin của bạn khỏi truy cập hoặc tiết lộ không được phép.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Cam Kết Bảo Mật:</Box> Chúng tôi cam kết duy trì bảo mật và tính bảo mật của thông tin cá nhân của bạn.
              </Typography>
            </Box>

            {/* Mục V */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅴ. Thay Đổi Chính Sách Bảo Mật:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Cập Nhật Chính Sách:</Box> Chính sách Bảo Mật này có thể được cập nhật từ thời gian này sang thời gian khác. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào thông qua trang web của chúng tôi.
              </Typography>
            </Box>

            {/* Mục VI */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ⅵ. Liên Hệ:
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                <Box component="span" sx={{ fontWeight: 700, color: '#1F2937' }}>• Hỗ Trợ:</Box> Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này hoặc cách thông tin của bạn được xử lý, xin vui lòng liên hệ với chúng tôi thông qua các kênh liên lạc đã được cung cấp trên trang web.
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

export default PrivacyPolicyPage;

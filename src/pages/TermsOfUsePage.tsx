import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header, Footer, Chatbot } from '../features/landing';

const TermsOfUsePage: React.FC = () => {
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
              THỎA THUẬN VÀ ĐIỀU KIỆN SỬ DỤNG DỊCH VỤ
            </Typography>

            <Typography variant="body1" sx={{ color: '#4B5563', mb: 4, lineHeight: 1.8 }}>
              Chào mừng bạn đến với nền tảng giáo dục MVA Study! Chúng tôi rất vui được đồng hành cùng bạn trên con đường chinh phục tri thức. Để đảm bảo quyền lợi tối đa cũng như mang lại một môi trường học tập chất lượng, vui lòng dành chút thời gian đọc kỹ các quy định dưới đây. Việc bạn truy cập và sử dụng dịch vụ đồng nghĩa với việc bạn đã hiểu và chấp thuận toàn bộ thỏa thuận này.
            </Typography>

            {/* Mục 1 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                1. Nguyên tắc Hoạt động
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Khi thiết lập tài khoản và tham gia học tập tại MVA Study, bạn đồng ý tuân thủ các quy chuẩn do chúng tôi đề ra. Những nguyên tắc này được xây dựng nhằm duy trì một môi trường giáo dục trực tuyến an toàn, minh bạch và hợp pháp. MVA Study giữ quyền điều chỉnh các quy định này để phù hợp với định hướng phát triển theo từng giai đoạn và cam kết sẽ có thông báo rõ ràng đến cộng đồng học viên.
              </Typography>
            </Box>

            {/* Mục 2 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                2. Chính sách Bảo vệ Dữ liệu Cá nhân
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Sự riêng tư của học viên là ưu tiên hàng đầu tại MVA Study. Chúng tôi áp dụng các tiêu chuẩn bảo mật khắt khe nhất để lưu trữ dữ liệu của bạn. Chúng tôi tuyên bố tuyệt đối không mua bán, trao đổi hay tiết lộ thông tin cá nhân của người dùng cho bất kỳ bên thứ ba nào nhằm mục đích trục lợi, ngoại trừ trường hợp có sự đồng ý trực tiếp từ bạn hoặc khi có yêu cầu bắt buộc từ cơ quan chức năng có thẩm quyền.
              </Typography>
            </Box>

            {/* Mục 3 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                3. Trách nhiệm của Học viên
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Người dùng có nghĩa vụ tương tác và sử dụng nền tảng vì mục đích học tập cá nhân chính đáng. Nghiêm cấm mọi hành vi tải xuống trái phép, sao chép, phân phối hoặc sử dụng lại các tài liệu của MVA Study cho mục đích thương mại khi chưa được ban quản trị cấp phép bằng văn bản. Mọi hành vi sai phạm không chỉ gây tổn hại đến hệ thống mà còn phá vỡ tính công bằng của cộng đồng.
              </Typography>
            </Box>

            {/* Mục 4 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                4. Bản quyền và Sở hữu Trí tuệ
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Toàn bộ hệ thống học liệu, video bài giảng, hình ảnh và tài liệu văn bản trên website đều là tài sản độc quyền của MVA Study hoặc các đối tác đồng sáng tạo. Việc tôn trọng bản quyền chính là cách bạn thể hiện sự trân trọng đối với chất xám, thời gian và tâm huyết của đội ngũ chuyên gia, giảng viên đã xây dựng nên các chương trình này.
              </Typography>
            </Box>

            {/* Mục 5 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                5. Miễn trừ và Giới hạn Trách nhiệm
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Chúng tôi luôn nỗ lực nâng cấp hạ tầng kỹ thuật để mang đến cho bạn trải nghiệm học tập mượt mà nhất. Mặc dù vậy, MVA Study không thể cam kết hệ thống sẽ vận hành hoàn hảo 100% mà không bao giờ gặp phải tình trạng bảo trì đột xuất hay sự cố kết nối mạng. Trong những tình huống bất khả kháng, trách nhiệm giải quyết và bồi thường của chúng tôi sẽ được giới hạn trong khuôn khổ của thỏa thuận này.
              </Typography>
            </Box>

            {/* Mục 6 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                6. Sửa đổi Điều khoản
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Để đáp ứng kịp thời những thay đổi của luật pháp cũng như các bản cập nhật tính năng mới của hệ thống, MVA Study có toàn quyền sửa đổi, bổ sung nội dung của Điều khoản Dịch vụ vào bất kỳ lúc nào. Những thay đổi này nhằm mục đích bảo vệ tốt hơn quyền lợi của người dùng và sẽ có hiệu lực ngay khi được cập nhật chính thức trên hệ thống website.
              </Typography>
            </Box>

            {/* Mục 7 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                7. Hỗ trợ và Chăm sóc Khách hàng
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Bất cứ khi nào bạn gặp rắc rối trong quá trình thao tác hoặc có câu hỏi cần giải đáp, đội ngũ Hỗ trợ Học viên của MVA Study luôn sẵn sàng lắng nghe. Hãy liên hệ ngay với chúng tôi thông qua hotline, email hoặc hệ thống tin nhắn trực tuyến trên trang chủ để được hỗ trợ xử lý kịp thời và tận tâm nhất.
              </Typography>
            </Box>

            {/* Mục 8 */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                8. Cơ quan Tài phán và Pháp luật Áp dụng
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', mb: 1, lineHeight: 1.8 }}>
                Toàn bộ Thỏa thuận Sử dụng này được xây dựng và bảo hộ bởi hệ thống pháp luật của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nếu phát sinh bất kỳ tranh chấp nào trong quá trình sử dụng dịch vụ, MVA Study và người dùng sẽ ưu tiên giải quyết trên tinh thần thiện chí, hòa giải. Nếu không thể đi đến thống nhất, sự việc sẽ được đệ trình lên Tòa án có thẩm quyền tại Việt Nam để phân xử.
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

export default TermsOfUsePage;

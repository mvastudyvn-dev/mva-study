import React, { useRef } from 'react';
import { Box, Container, Typography, Avatar, IconButton } from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';

const feedbacks = [
  {
    id: 1,
    content: 'Bản thân mình là đứa siêu ghét mấy cái hàm Excel lại còn mù công nghệ nữa nên lúc đi thi chứng chỉ cũng sợ rớt này kia. Mà ai dè học ở trung tâm xong nhận được kết quả pass ngay từ lần đầu vượt mong đợi lun á. Anh dạy dễ hiểu mà siêu tận tâm, lộ trình học thực hành khá kĩ càng chi tiết, các ac trợ giảng thì vô cùng nhiệt tình, bài tập làm sai chỗ nào là sửa ngay chỗ đó. Học phí của trung tâm cũng siu siu rẻ so với những chỗ khác. Mình thi điểm so với mấy đứa đỉnh công nghệ thì không cao, nhưng mà cũng gọi là tạm nên là rcm cho mấy bạn nếu mà đang muốn học MOS nhen chứ đừng tự mò mẫm mệt lắm^^',
    name: 'Học viên Thùy Linh',
    tag: 'Khoá MOS 2019/365 App',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An'
  },
  {
    id: 2,
    content: 'Bình thường hè người ta đi du lịch đồ đó, còn tui thì bị mẹ dí đi học sớm môn tin THPT vì tui chọn tổ hợp X06. Lúc đầu đi học hè cũng oải lắm. Ai dè vô lớp này cuốn vcl mng ơi! Học hè mà bùng nổ visual, anh dạy siêu bánh cuốn, vừa học lý thuyết vừa làm bài không bị chán tí nào. Mới học mấy tuần hè thui mà tui cảm giác mình húp trọn hết đống kiến thức nền tảng của kỳ 1 rùi á, vào năm học chính thức chấp cả lớp lun haha. 2k9 đứa nào còn đang nằm ườn ở nhà thì đăng ký học hè chung với tui đi, học sớm cho nhàn cái thân chứ vô năm học mới cày là thở bằng oxy đóoo!',
    name: 'Học viên Thanh Trúc',
    tag: 'Khoá 2009 XPS',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Truc'
  },
  {
    id: 3,
    content: 'Hồi lớp 11 học môn Tin kiểu cưỡi ngựa xem hoa mất gốc hoàn toàn nên lúc chọn tổ hợp thi THPT cũng sợ này kia. Mà ai dè năm nay va phải lớp ôn thi THPT của a đúng kiểu chân ái luôn á. Anh dạy dễ hiểu mà siêu tận tâm, lộ trình học từ kiến thức cơ bản đến giải đề khá kĩ càng chi tiết, các ac trợ giảng thì vô cùng nhiệt tình. Học lực môn Tin của mình giờ cải thiện rõ rệt luôn, siêu rcm cho mấy bạn 2k9 khác nếu mà đang muốn tìm chỗ ôn thi tốt nghiệp môn Tin nha, học anh muộn ngày nào là thiệt ngày đó á!',
    name: 'Học viên Trần Dũng',
    tag: 'Khoá 2009 XPS',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung'
  }
];

export const FeedbackSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Icons */}
      <Box sx={{ position: 'absolute', top: '5%', left: '-2%', opacity: 0.15, transform: 'rotate(-15deg)', zIndex: 0 }}>
        <AutoAwesomeRoundedIcon sx={{ fontSize: 180, color: '#FF8C2F' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '-5%', right: '-3%', opacity: 0.15, transform: 'rotate(25deg)', zIndex: 0 }}>
        <MenuBookRoundedIcon sx={{ fontSize: 240, color: '#FF8C2F' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.12, transform: 'rotate(15deg)', zIndex: 0 }}>
        <EmojiObjectsRoundedIcon sx={{ fontSize: 100, color: '#FF8C2F' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ForumRoundedIcon sx={{ color: '#FF8C2F', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
              Feedback của học viên
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                border: '1px solid #E5E7EB',
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: '#F3F4F6' }
              }}
              size="small"
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                border: '1px solid #E5E7EB',
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: '#F3F4F6' }
              }}
              size="small"
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 16, color: '#111827' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Grid Container */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {feedbacks.map((feedback) => (
            <Box
              key={feedback.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: 3
              }}
            >
              {/* Quote box */}
              <Box sx={{
                bgcolor: '#F8FAFC',
                borderRadius: 4,
                p: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ mb: 2 }}>
                  <FormatQuoteRoundedIcon
                    sx={{
                      fontSize: 48,
                      color: '#FF8C2F',
                      transform: 'scaleX(-1)', // Flip horizontally to match the image
                      ml: -1
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#4B5563',
                    lineHeight: 1.7,
                  }}
                >
                  {feedback.content}
                </Typography>
              </Box>

              {/* User info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                <Avatar src={feedback.avatar} alt={feedback.name} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', mb: 0.5 }}>
                    {feedback.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: '#FFF8F2',
                      color: '#FF8C2F',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    <LocalOfferRoundedIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {feedback.tag}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

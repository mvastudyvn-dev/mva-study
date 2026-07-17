import React, { useRef } from 'react';
import { Box, Container, Typography, Avatar, IconButton, Rating } from '@mui/material';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

const feedbacks = [
  {
    id: 1,
    content: 'Bản thân mình là đứa siêu ghét mấy cái hàm Excel lại còn mù công nghệ nữa nên lúc đi thi chứng chỉ cũng sợ rớt này kia. Mà ai dè học ở trung tâm xong nhận được kết quả pass ngay từ lần đầu vượt mong đợi lun á. Anh dạy dễ hiểu mà siêu tận tâm, lộ trình học thực hành khá kĩ càng chi tiết.',
    name: 'Học viên Thùy Linh',
    tag: 'Khoá MOS 2019/365 App',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
    rating: 5,
  },
  {
    id: 2,
    content: 'Lúc đầu đi học hè cũng oải lắm. Ai dè vô lớp này cuốn vcl mng ơi! Học hè mà bùng nổ visual, anh dạy siêu bánh cuốn, vừa học lý thuyết vừa làm bài không bị chán tí nào. Mới học mấy tuần hè thui mà cảm giác mình húp trọn hết đống kiến thức nền tảng của kỳ 1 rùi á.',
    name: 'Học viên Thanh Trúc',
    tag: 'Khoá 2009 XPS',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Truc',
    rating: 5,
  },
  {
    id: 3,
    content: 'Năm nay va phải lớp ôn thi THPT của anh đúng kiểu chân ái luôn á. Anh dạy dễ hiểu mà siêu tận tâm, lộ trình học từ kiến thức cơ bản đến giải đề khá kĩ càng. Học lực môn Tin của mình giờ cải thiện rõ rệt luôn, siêu rcm cho mấy bạn 2k9 khác!',
    name: 'Học viên Trần Dũng',
    tag: 'Khoá 2009 XPS',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung',
    rating: 5,
  },
];

export const FeedbackSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#FFFBF8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Box sx={{
        position: 'absolute', top: '5%', left: '-3%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-5%', right: '-3%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.8,
                px: 2,
                py: 0.8,
                bgcolor: 'rgba(255,140,47,0.08)',
                borderRadius: '999px',
                border: '1px solid rgba(255,140,47,0.16)',
                mb: 2,
              }}
            >
              <ForumRoundedIcon sx={{ fontSize: 14, color: '#FF8C2F' }} />
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Học viên nói gì
              </Typography>
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#0F172A',
                fontSize: { xs: '1.6rem', md: '2.1rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
              }}
            >
              Cảm nhận thực tế
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                border: '1.5px solid rgba(0,0,0,0.08)',
                bgcolor: '#fff',
                width: 40, height: 40,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,140,47,0.06)',
                  borderColor: 'rgba(255,140,47,0.3)',
                  color: '#FF8C2F',
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                border: '1.5px solid rgba(0,0,0,0.08)',
                bgcolor: '#fff',
                width: 40, height: 40,
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,140,47,0.06)',
                  borderColor: 'rgba(255,140,47,0.3)',
                  color: '#FF8C2F',
                },
              }}
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Testimonial Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {feedbacks.map((feedback) => (
            <Box
              key={feedback.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: 0,
              }}
            >
              {/* Quote Card */}
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: '20px',
                  p: 3.5,
                  flexGrow: 1,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                    transform: 'translateY(-6px)',
                    borderColor: 'rgba(255,140,47,0.15)',
                  },
                }}
              >
                {/* Quote icon + rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <FormatQuoteRoundedIcon
                    sx={{ fontSize: 40, color: '#FF8C2F', opacity: 0.6, transform: 'scaleX(-1)', ml: -0.5 }}
                  />
                  <Rating
                    value={feedback.rating}
                    readOnly
                    size="small"
                    sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#475569',
                    lineHeight: 1.75,
                    fontSize: '0.875rem',
                  }}
                >
                  {feedback.content}
                </Typography>

                {/* User info — inside card bottom */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Avatar
                    src={feedback.avatar}
                    alt={feedback.name}
                    sx={{
                      width: 44, height: 44,
                      border: '2.5px solid rgba(255,140,47,0.25)',
                    }}
                  />
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', mb: 0.5 }}>
                      {feedback.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        bgcolor: 'rgba(255,140,47,0.08)',
                        color: '#FF8C2F',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '999px',
                        border: '1px solid rgba(255,140,47,0.14)',
                      }}
                    >
                      <LocalOfferRoundedIcon sx={{ fontSize: 11 }} />
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {feedback.tag}
                      </Typography>
                    </Box>
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

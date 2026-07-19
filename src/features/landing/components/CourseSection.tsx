import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Rating } from '@mui/material';
import { useData } from '../../../core/contexts/DataContext';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useNavigate } from 'react-router-dom';

const courseIcons: Record<string, React.ReactNode> = {
  c1: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>2K9</Typography>
      <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, mt: 0.5 }}>XPS</Typography>
    </Box>
  ),
  c2: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>MOS</Typography>
      <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: '"Georgia", serif' }}>W</Typography>
    </Box>
  ),
  c3: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>MOS</Typography>
      <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: '"Georgia", serif' }}>X</Typography>
    </Box>
  ),
  c4: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>MOS</Typography>
      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>PowerPoint</Typography>
    </Box>
  ),
  c5: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>IC3</Typography>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, mt: 0.5 }}>Level 1</Typography>
    </Box>
  ),
  c6: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>IC3</Typography>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, mt: 0.5 }}>Level 2</Typography>
    </Box>
  ),
  c7: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>IC3</Typography>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, mt: 0.5 }}>Level 3</Typography>
    </Box>
  ),
  c8: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Combo</Typography>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>MOS+IC3</Typography>
    </Box>
  ),
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + 'đ';

export const CourseSection: React.FC = () => {
  const { courses } = useData();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 55%, #FFF3E8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background decoration */}
      <Box sx={{
        position: 'absolute',
        top: '30%', right: '-4%',
        width: 280, height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.06) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%', left: '-3%',
        width: 220, height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ mb: 6 }}>
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
            <SchoolRoundedIcon sx={{ fontSize: 14, color: '#FF8C2F' }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Khóa học
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
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
                Khóa Học Nổi Bật
              </Typography>
              <Typography sx={{ color: '#64748B', mt: 1, fontSize: '0.95rem' }}>
                Chất lượng cao, được đánh giá bởi hàng nghìn học viên.
              </Typography>
            </Box>
            <Box
              onClick={() => navigate('/courses')}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                color: '#FF8C2F',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                ml: 2,
                '&:hover': {
                  color: '#E67923',
                  gap: 1,
                },
              }}
            >
              Xem tất cả
              <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Box>

        {/* Course Cards Grid */}
        <Grid container spacing={3}>
          {courses.slice(0, 8).map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
              <Card
                onClick={() => navigate(`/courses/${course.id}`)}
                sx={{
                  height: '100%',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.10)',
                    borderColor: 'rgba(255,140,47,0.20)',
                  },
                }}
              >
                {/* Icon Area */}
                <Box
                  sx={{
                    height: 150,
                    background: course.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle pattern overlay */}
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                  <Box sx={{ zIndex: 1, position: 'relative' }}>
                    {courseIcons[course.id] || (
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                        {course.icon}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ p: 2.5, pb: '20px !important', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: '#0F172A',
                      mb: 0.75,
                      fontSize: '0.95rem',
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4,
                      minHeight: '2.6rem',
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.78rem', fontWeight: 500 }}>
                      {course.lessonsCount} bài giảng • {course.durationMonths ? `${course.durationMonths} tháng` : 'Vĩnh viễn'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <Rating
                        value={course.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' }, fontSize: '0.9rem' }}
                      />
                      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>
                        {course.rating}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                        ({course.ratingCount.toLocaleString()})
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: '#FF8C2F',
                          fontSize: '1.05rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                        }}
                      >
                        {formatPrice(course.price)}
                      </Typography>
                      <Chip
                        label="Xem ngay"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,140,47,0.10)',
                          color: '#FF8C2F',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          border: 'none',
                          height: 26,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Mobile "View All" link */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 4 }}>
          <Box
            onClick={() => navigate('/courses')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#FF8C2F',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Xem tất cả khóa học
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

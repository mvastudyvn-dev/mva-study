import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Rating } from '@mui/material';
import { useData } from '../../../core/contexts/DataContext';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

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

import { useNavigate } from 'react-router-dom';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + 'đ';

export const CourseSection: React.FC = () => {
  const { courses } = useData();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Icons */}
      <Box sx={{ position: 'absolute', top: '40%', right: '2%', opacity: 0.12, transform: 'rotate(15deg)', zIndex: 0 }}>
        <ComputerRoundedIcon sx={{ fontSize: 120, color: '#FF8C2F' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', left: '3%', opacity: 0.12, transform: 'rotate(-25deg)', zIndex: 0 }}>
        <MenuBookRoundedIcon sx={{ fontSize: 140, color: '#FF8C2F' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#1F2937', fontSize: { xs: '1.2rem', md: '1.5rem' } }}
          >
            KHÓA HỌC NỔI BẬT
          </Typography>
          <Typography
            onClick={() => navigate('/courses')}
            sx={{
              color: '#FF8C2F',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Xem tất cả →
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={course.id}>
              <Card
                onClick={() => navigate('/courses')}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Icon Area */}
                <Box
                  sx={{
                    height: 140,
                    background: course.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
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
                      color: '#1F2937', 
                      mb: 0.5, 
                      fontSize: '0.95rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.4rem' // ~2 lines * 1.2
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6B7280', mb: 1.5, fontSize: '0.8rem' }}
                  >
                    {course.lessonsCount} bài giảng • {course.durationMonths ? `${course.durationMonths} tháng` : 'Vĩnh viễn'}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    {/* Rating */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', gap: 0.5, mb: 1.5 }}>
                      <Rating
                        value={course.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': { color: '#F59E0B' },
                          fontSize: '1rem',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap' }}>
                        {course.rating}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                        ({course.ratingCount.toLocaleString()})
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#FF8C2F',
                        fontSize: '1.1rem',
                      }}
                    >
                      {formatPrice(course.price)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

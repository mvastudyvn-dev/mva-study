import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, Button, Rating, Chip, Accordion, AccordionSummary, AccordionDetails, LinearProgress, Divider } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Header, Footer } from '../features/landing';
import { useData } from '../core/contexts/DataContext';
import { useAuth } from '../core/contexts/AuthContext';
import PaymentModal from '../features/payment/PaymentModal';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, lessons, activationCodes, refreshData, allUserProgress } = useData();
  const { user } = useAuth();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  useEffect(() => {
    refreshData();
    window.scrollTo(0, 0);
  }, [refreshData, id]);

  const course = useMemo(() => courses.find(c => c.id === id), [courses, id]);
  
  const courseLessons = useMemo(() => {
    return lessons
      .filter(l => l.courseId === id)
      .sort((a, b) => a.order - b.order);
  }, [lessons, id]);

  const isOwned = useMemo(() => {
    return activationCodes.some((c) => c.usedByEmail === user?.email && c.courseId === id);
  }, [activationCodes, user, id]);

  const userProgress = user ? allUserProgress[user.id] : null;

  const handleAccordionChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panelId : false);
  };

  if (!course) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
        <Header />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography variant="h5" color="text.secondary" mb={2}>Không tìm thấy khóa học</Typography>
          <Button variant="contained" onClick={() => navigate('/courses')}>Quay lại danh sách</Button>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, pb: 10 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            mb: 5,
            background: course.bgGradient || 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 55%, #FFF3E8 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle overlay for contrast */}
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 0 }} />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Button 
              onClick={() => navigate('/courses')}
              sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
              startIcon={<ArrowBackRoundedIcon />}
            >
              Quay lại
            </Button>

            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip label="Nổi bật" size="small" sx={{ bgcolor: '#EF4444', color: '#fff', fontWeight: 'bold' }} />
                  <Typography sx={{ color: '#E2E8F0', fontSize: '0.9rem' }}>
                    <SchoolRoundedIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    MVA Study
                  </Typography>
                </Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: '#FFFFFF',
                    mb: 2,
                    fontSize: { xs: '2rem', md: '2.8rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {course.title}
                </Typography>
                <Typography sx={{ color: '#E2E8F0', fontSize: '1.1rem', mb: 3, lineHeight: 1.6, maxWidth: '800px' }}>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={course.rating} precision={0.1} readOnly size="small" sx={{ color: '#F59E0B' }} />
                    <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>{course.rating}</Typography>
                    <Typography sx={{ color: '#94A3B8' }}>({course.ratingCount.toLocaleString()} đánh giá)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#E2E8F0' }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography>{courseLessons.length} bài học</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Price Card */}
              <Grid item xs={12} md={4} sx={{ position: { md: 'relative' } }}>
                <Box 
                  sx={{ 
                    position: { xs: 'static', md: 'absolute' },
                    top: { md: 0 },
                    right: { md: 0 },
                    width: '100%',
                    zIndex: 10
                  }}
                >
                  <Card sx={{ borderRadius: 4, p: 3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF8C2F', mb: 1 }}>
                    {formatPrice(course.price)}
                  </Typography>
                  <Typography sx={{ color: '#64748B', mb: 3, fontSize: '0.9rem' }}>
                    Truy cập {course.durationMonths ? `${course.durationMonths} tháng` : 'vĩnh viễn'}
                  </Typography>
                  
                  {isOwned ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/student')}
                      sx={{
                        py: 1.5,
                        bgcolor: '#10B981',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        '&:hover': { bgcolor: '#059669' }
                      }}
                    >
                      Đã sở hữu - Vào học ngay
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setIsPaymentModalOpen(true)}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        boxShadow: '0 4px 14px rgba(255,140,47,0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                        }
                      }}
                    >
                      Mua ngay
                    </Button>
                  )}
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Khóa học này bao gồm:</Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5, color: '#475569', fontSize: '0.85rem' } }}>
                      <li>Video bài giảng chất lượng cao</li>
                      <li>Tài liệu thực hành đính kèm</li>
                      <li>Bài kiểm tra đánh giá năng lực</li>
                      <li>Hỗ trợ giải đáp thắc mắc 24/7</li>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Course Content */}
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: '#fff', borderRadius: 4, p: { xs: 3, md: 4 }, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 3 }}>
                  Danh sách bài học
                </Typography>

                {courseLessons.length === 0 ? (
                  <Typography sx={{ color: '#64748B', py: 4, textAlign: 'center' }}>
                    Chưa có bài học nào được thêm vào khóa học này.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {courseLessons.map((lesson, index) => {
                      const isCompleted = userProgress?.completedLessons?.includes(lesson.id) || false;
                      const progress = isCompleted ? 100 : 0; 
                      
                      return (
                        <Accordion 
                          key={lesson.id}
                          expanded={expandedAccordion === lesson.id}
                          onChange={handleAccordionChange(lesson.id)}
                          sx={{ 
                            boxShadow: 'none', 
                            bgcolor: '#F8FAFC',
                            borderRadius: '12px !important',
                            '&:before': { display: 'none' },
                            border: '1px solid rgba(0,0,0,0.04)',
                            overflow: 'hidden'
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreRoundedIcon sx={{ color: '#64748B' }} />}
                            sx={{ 
                              p: 2, 
                              '& .MuiAccordionSummary-content': { 
                                m: 0, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                pr: 2
                              } 
                            }}
                          >
                            <Typography sx={{ fontWeight: 600, color: '#1E293B', fontSize: '1rem', flex: 1, textTransform: 'uppercase' }}>
                              {lesson.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 150, justifyContent: 'flex-end' }}>
                              <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, width: 32, textAlign: 'right' }}>
                                {progress}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                  width: 80, 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: '#E2E8F0',
                                  '& .MuiLinearProgress-bar': { bgcolor: progress === 100 ? '#10B981' : '#CBD5E1' }
                                }} 
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 0 }}>
                            <Divider />
                            <Box sx={{ p: 2, pl: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PlayCircleOutlineRoundedIcon sx={{ color: '#94A3B8' }} />
                                <Typography sx={{ color: '#475569', fontSize: '0.9rem' }}>
                                  Video bài giảng
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                                  {lesson.duration || '00:00'}
                                </Typography>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ 
                                    borderRadius: 2, 
                                    textTransform: 'none', 
                                    fontWeight: 600,
                                    borderColor: '#E2E8F0',
                                    color: '#0F172A',
                                    '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' }
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isOwned) {
                                      navigate('/student');
                                    } else {
                                      setIsPaymentModalOpen(true);
                                    }
                                  }}
                                >
                                  {isOwned ? 'Học ngay' : 'Học thử'}
                                </Button>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <PaymentModal
        open={isPaymentModalOpen}
        course={course}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <Footer />
    </Box>
  );
};

export default CourseDetailsPage;

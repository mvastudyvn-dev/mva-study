import React, { useState, useMemo, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Rating, Tabs, Tab, TextField, InputAdornment, Button, Chip } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Header, Footer } from '../features/landing';
import { useData } from '../core/contexts/DataContext';
import { useAuth } from '../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../features/payment/PaymentModal';
import type { Course } from '../core/types/global';

const courseIcons: Record<string, React.ReactNode> = {
  c1: (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>IC3</Typography>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>GS6</Typography>
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
};

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
const CATEGORIES = ['Tất cả', 'IC3', 'MOS'];

const CoursesPage: React.FC = () => {
  const { courses, activationCodes, refreshData } = useData();
  const { user } = useAuth();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const userCodes = useMemo(() => {
    return activationCodes.filter((c) => c.usedByEmail === user?.email);
  }, [activationCodes, user]);

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (activeTab !== 0) {
      const categoryName = CATEGORIES[activeTab];
      result = result.filter(c => c.title.includes(categoryName));
    }
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
      );
    }
    return result;
  }, [courses, activeTab, searchQuery]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA' }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, pb: 10 }}>
        {/* Page Hero Header */}
        <Box
          sx={{
            py: { xs: 7, md: 9 },
            mb: 5,
            background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 55%, #FFF3E8 100%)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blobs */}
          <Box sx={{
            position: 'absolute', top: '-20%', right: '-5%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none',
          }} />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.8,
              px: 2, py: 0.8,
              bgcolor: 'rgba(255,140,47,0.08)', borderRadius: '999px',
              border: '1px solid rgba(255,140,47,0.16)', mb: 2,
            }}>
              <SchoolRoundedIcon sx={{ fontSize: 14, color: '#FF8C2F' }} />
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Danh mục khóa học
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                color: '#0F172A',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.8rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Danh Sách Khóa Học
            </Typography>
            <Typography
              sx={{
                color: '#64748B',
                maxWidth: '540px',
                fontSize: '1rem',
                lineHeight: 1.75,
              }}
            >
              Khám phá các khóa học chất lượng cao giúp bạn làm chủ kiến thức và đạt điểm cao trong các kỳ thi.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Controls: Tabs & Search */}
          <Box
            sx={{
              mb: 5,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              p: 2,
              bgcolor: '#fff',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  minWidth: 80,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  color: '#64748B',
                  borderRadius: '10px',
                  px: 2, py: 1,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    color: '#FF8C2F',
                    bgcolor: 'rgba(255,140,47,0.10)',
                  },
                },
              }}
            >
              {CATEGORIES.map((cat, idx) => (
                <Tab key={idx} label={cat} />
              ))}
            </Tabs>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  bgcolor: '#FAFAFA',
                  minWidth: { xs: '100%', md: 280 },
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,140,47,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#FF8C2F', boxShadow: '0 0 0 3px rgba(255,140,47,0.10)' },
                }
              }}
            />
          </Box>

          {/* Results count */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
              <Box component="span" sx={{ fontWeight: 800, color: '#0F172A' }}>{filteredCourses.length}</Box>
              {' '}khóa học
            </Typography>
            {searchQuery && (
              <Typography sx={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                cho "<Box component="span" sx={{ color: '#FF8C2F', fontWeight: 700 }}>{searchQuery}</Box>"
              </Typography>
            )}
          </Box>

          {/* Course Grid */}
          <Grid container spacing={3}>
            {filteredCourses.map((course) => {
              const isOwned = userCodes.some((c) => c.courseId === course.id);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
                  <Card
                    onClick={() => navigate(`/courses/${course.id}`)}
                    sx={{
                      height: '100%',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.10)',
                        borderColor: 'rgba(255,140,47,0.20)',
                      },
                    }}
                  >
                    {/* Course Banner */}
                    <Box
                      sx={{
                        height: 160,
                        background: course.bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Pattern overlay */}
                      <Box sx={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }} />
                      {courseIcons[course.id] || (
                        <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', position: 'relative', zIndex: 1 }}>
                          {course.icon}
                        </Typography>
                      )}
                      <Box sx={{
                        position: 'absolute', top: 10, left: 10, zIndex: 1,
                        bgcolor: '#EF4444', color: '#fff',
                        px: 1.2, py: 0.35,
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        letterSpacing: '0.06em',
                      }}>
                        HOT
                      </Box>
                      {isOwned && (
                        <Box sx={{
                          position: 'absolute', top: 10, right: 10, zIndex: 1,
                          bgcolor: '#10B981', color: '#fff',
                          px: 1.2, py: 0.35,
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                        }}>
                          ✓ Đã sở hữu
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#0F172A',
                          mb: 0.8,
                          fontSize: '0.95rem',
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.6rem',
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.8 }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                        <Typography sx={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                          {course.lessonsCount} bài • {course.durationMonths ? `${course.durationMonths} tháng` : 'Vĩnh viễn'}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                          <Rating
                            value={course.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' }, fontSize: '0.85rem' }}
                          />
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{course.rating}</Typography>
                          <Typography sx={{ fontSize: '0.72rem', color: '#9CA3AF' }}>({course.ratingCount.toLocaleString()})</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {isOwned ? (
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{
                                borderColor: '#10B981',
                                color: '#10B981',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                pointerEvents: 'none',
                                borderWidth: '1.5px',
                              }}
                            >
                              Đã sở hữu ✓
                            </Button>
                          ) : (
                            <>
                              <Typography sx={{ fontWeight: 800, color: '#FF8C2F', fontSize: '1.05rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {formatPrice(course.price)}
                              </Typography>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                                  color: '#fff',
                                  fontWeight: 700,
                                  borderRadius: '10px',
                                  fontSize: '0.78rem',
                                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                                  px: 2,
                                  boxShadow: '0 4px 12px rgba(255,140,47,0.25)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                                    boxShadow: '0 6px 18px rgba(255,140,47,0.35)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                Mua ngay
                              </Button>
                            </>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {filteredCourses.length === 0 && (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
              <Typography variant="h6" sx={{ color: '#64748B', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif', mb: 1 }}>
                Không tìm thấy khóa học
              </Typography>
              <Typography sx={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <PaymentModal
        open={isPaymentModalOpen}
        course={selectedCourse}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <Footer />
    </Box>
  );
};

export default CoursesPage;

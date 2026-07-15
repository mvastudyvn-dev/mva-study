import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Rating, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  const { courses, activationCodes } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const userCodes = useMemo(() => {
    return activationCodes.filter((c) => c.isUsed && c.usedByEmail === user?.email);
  }, [activationCodes, user]);

  const filteredCourses = useMemo(() => {
    let result = courses;
    
    // Filter by Tab
    if (activeTab !== 0) {
      const categoryName = CATEGORIES[activeTab];
      result = result.filter(c => c.title.includes(categoryName));
    }
    
    // Filter by Search
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
        {/* Page Header */}
        <Box sx={{ bgcolor: '#fff', py: 6, mb: 4, borderBottom: '1px solid #E5E7EB' }}>
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1F2937', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Danh Sách Khóa Học
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '600px', fontSize: '1.1rem' }}>
              Khám phá các khóa học chất lượng cao giúp bạn làm chủ kiến thức và đạt điểm cao trong các kỳ thi.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Controls: Tabs & Search */}
          <Box 
            sx={{ 
              mb: 4, 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'stretch', md: 'center' }, 
              justifyContent: 'space-between',
              gap: 2,
              borderBottom: 1, 
              borderColor: 'divider' 
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem', textTransform: 'none', minWidth: 100 },
                '& .Mui-selected': { color: '#FF8C2F !important' },
                '& .MuiTabs-indicator': { backgroundColor: '#FF8C2F' }
              }}
            >
              {CATEGORIES.map((cat, idx) => (
                <Tab key={idx} label={cat} />
              ))}
            </Tabs>
            
            <Box sx={{ pb: { xs: 2, md: 0 }, pr: { xs: 0, md: 2 } }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Nhập từ khóa tìm kiếm ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 1,
                    bgcolor: '#fff',
                    minWidth: { xs: '100%', md: 280 },
                    '& fieldset': { borderColor: '#E5E7EB' },
                    '&:hover fieldset': { borderColor: '#D1D5DB' },
                    '&.Mui-focused fieldset': { borderColor: '#FF8C2F' },
                  }
                }}
              />
            </Box>
          </Box>

          {/* Courses Grid */}
          <Grid container spacing={3}>
            {filteredCourses.map((course) => {
              const isOwned = userCodes.some((c) => c.courseId === course.id);
              return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
                <Card
                  onClick={() => {
                    if (isOwned) {
                      navigate('/dashboard');
                    } else {
                      setSelectedCourse(course);
                      setIsPaymentModalOpen(true);
                    }
                  }}
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      background: course.bgGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {courseIcons[course.id] || (
                      <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
                        {course.icon}
                      </Typography>
                    )}
                    <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#EF4444', color: '#fff', px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 700 }}>
                      HOT
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1F2937', 
                        mb: 1, 
                        fontSize: '1.05rem', 
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6rem'
                      }}
                    >
                      {course.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 2, fontSize: '0.85rem' }}>
                      {course.lessonsCount} bài giảng • {course.durationMonths ? `${course.durationMonths} tháng` : 'Vĩnh viễn'}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
                        <Rating
                          value={course.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' }, fontSize: '1rem' }}
                        />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937' }}>
                          {course.rating}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          ({course.ratingCount.toLocaleString()})
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        {isOwned ? (
                          <Button variant="outlined" size="small" sx={{ borderColor: '#10B981', color: '#10B981', pointerEvents: 'none', fontWeight: 'bold' }}>
                            Đã sở hữu
                          </Button>
                        ) : (
                          <Typography sx={{ fontWeight: 800, color: '#FF8C2F', fontSize: '1.2rem' }}>
                            {formatPrice(course.price)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )})}
          </Grid>
          
          {filteredCourses.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Chưa có khóa học nào trong danh mục này.</Typography>
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

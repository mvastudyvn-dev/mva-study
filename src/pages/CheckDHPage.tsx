import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Button, IconButton, Container, Autocomplete, Chip, Paper, Snackbar, Alert } from '@mui/material';
import logo from '../assets/logo1.png';
import { CheckDHHeader } from '../features/landing/components/CheckDHHeader';
import { CheckDHFooter } from '../features/landing/components/CheckDHFooter';
import { CheckDHFeatures } from '../features/landing/components/CheckDHFeatures';
import { PredictionResults } from '../features/landing/components/PredictionResults';
import { aiPredictionService } from '../services/aiPredictionService';
import type { PredictionResult } from '../services/aiPredictionService';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';

import universitiesData from '../data/universities.json';
import blocksData from '../data/blocks.json';
import majorsData from '../data/majors.json';

const CustomPaper = (props: any) => {
  return (
    <Paper 
      {...props} 
      sx={{ 
        ...props.sx, 
        animation: 'dropdownFadeIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        transformOrigin: 'top center',
        '@keyframes dropdownFadeIn': { 
          '0%': { opacity: 0, transform: 'scaleY(0.9) translateY(-15px)' }, 
          '100%': { opacity: 1, transform: 'scaleY(1) translateY(0)' } 
        }, 
        borderRadius: 3, 
        mt: 0.5, 
        boxShadow: '0 12px 36px rgba(0,0,0,0.1)' 
      }} 
    />
  );
};

const CheckDHPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState('');
  const [selectedUniversities, setSelectedUniversities] = useState<any[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<any[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<any[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<PredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async () => {
    if (!score.trim()) {
      setErrorMsg('Vui lòng nhập điểm thi hoặc dự kiến của bạn!');
      return;
    }
    
    setIsAnalyzing(true);
    setAiResult(null);
    setErrorMsg('');
    
    try {
      const result = await aiPredictionService({
        score,
        blocks: selectedBlocks,
        universities: selectedUniversities,
        majors: selectedMajors
      });
      setAiResult(result);
      
      setTimeout(() => {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi phân tích.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onAnalyzeClick = () => {
    if (!score.trim()) {
      setErrorMsg('Vui lòng nhập điểm thi hoặc dự kiến của bạn!');
      return;
    }
    handleAnalyze();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
        <Box 
          component="img" 
          src={logo} 
          alt="MVA Uni Logo" 
          sx={{ 
            height: 60, 
            mb: 4, 
            objectFit: 'contain',
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            }
          }} 
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 12,
                height: 12,
                bgcolor: '#FF8C2F',
                borderRadius: '50%',
                animation: 'bounceDots 1.4s infinite ease-in-out both',
                animationDelay: `${i * 0.16 - 0.32}s`,
                '@keyframes bounceDots': {
                  '0%, 80%, 100%': { transform: 'scale(0)' },
                  '40%': { transform: 'scale(1)' },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: '#fff',
        animation: 'fadeInUpContent 0.6s ease-out',
        '@keyframes fadeInUpContent': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }}
    >
      <CheckDHHeader />
      
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Soft blue blob background */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 140, 47, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 12, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#111827',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Biết chính xác
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#111827',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 4,
            }}
          >
            <Box component="span" sx={{ 
              background: 'linear-gradient(90deg, #FF8C2F, #FF6B00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              khả năng đỗ Đại học
            </Box>{' '}
            trong 10s
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Box sx={{ 
              display: 'flex', alignItems: 'center', gap: 1, 
              bgcolor: '#fff', border: '1px solid #E5E7EB', 
              borderRadius: '50px', px: 2, py: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <SearchIcon sx={{ color: '#FF8C2F', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.9rem' }}>
                21.747 <Box component="span" sx={{ fontWeight: 500, color: '#6B7280' }}>lượt tra cứu</Box>
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', alignItems: 'center', gap: 1, 
              bgcolor: '#fff', border: '1px solid #E5E7EB', 
              borderRadius: '50px', px: 2, py: 1,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <SchoolIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.9rem' }}>
                200+ <Box component="span" sx={{ fontWeight: 500, color: '#6B7280' }}>trường Đại học</Box>
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              color: '#6B7280',
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto',
              mb: 6,
              lineHeight: 1.6,
            }}
          >
            Hệ thống thông minh phân tích điểm chuẩn từ 200+ trường Đại học để đưa ra chiến lược chọn nguyện vọng tối ưu nhất cho bạn.
          </Typography>

          <Box
            sx={{
              bgcolor: '#FF9940',
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              boxShadow: '0 10px 30px rgba(255, 140, 47, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Box sx={{ flex: '1 1 200px', textAlign: 'left' }}>
                <Typography sx={{ color: '#374151', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Điểm thi / Dự kiến</Typography>
                <TextField
                  fullWidth
                  placeholder="Ví dụ: 24.5"
                  variant="outlined"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: 'transparent' },
                      '&.Mui-focused fieldset': { borderColor: 'transparent' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', textAlign: 'left' }}>
                <Typography sx={{ color: '#374151', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Trường đại học</Typography>
                <Autocomplete
                  multiple
                  limitTags={2}
                  options={universitiesData}
                  PaperComponent={CustomPaper}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  value={selectedUniversities}
                  onChange={(event, newValue) => setSelectedUniversities(newValue)}
                  noOptionsText="Không tìm thấy trường"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={selectedUniversities.length === 0 ? "Tất cả trường" : ""}
                      variant="outlined"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: 'transparent' },
                          '&:hover fieldset': { borderColor: 'transparent' },
                          '&.Mui-focused fieldset': { borderColor: 'transparent' },
                        },
                      }}
                    />
                  )}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...otherProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          variant="outlined"
                          label={option.code}
                          {...otherProps}
                          sx={{ bgcolor: '#F3F4F6', border: 'none', fontWeight: 500, height: 24 }}
                        />
                      );
                    })
                  }
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', textAlign: 'left' }}>
                <Typography sx={{ color: '#374151', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Khối thi</Typography>
                <Autocomplete
                  multiple
                  limitTags={2}
                  options={blocksData}
                  PaperComponent={CustomPaper}
                  getOptionLabel={(option) => `${option.code} (${option.subjects})`}
                  value={selectedBlocks}
                  onChange={(event, newValue) => setSelectedBlocks(newValue)}
                  noOptionsText="Không tìm thấy khối thi"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={selectedBlocks.length === 0 ? "Tất cả khối" : ""}
                      variant="outlined"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: 'transparent' },
                          '&:hover fieldset': { borderColor: 'transparent' },
                          '&.Mui-focused fieldset': { borderColor: 'transparent' },
                        },
                      }}
                    />
                  )}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...otherProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          variant="outlined"
                          label={option.code}
                          {...otherProps}
                          sx={{ bgcolor: '#F3F4F6', border: 'none', fontWeight: 500, height: 24 }}
                        />
                      );
                    })
                  }
                />
              </Box>

              <Box sx={{ flex: '1 1 200px', textAlign: 'left' }}>
                <Typography sx={{ color: '#374151', fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Ngành học</Typography>
                <Autocomplete
                  multiple
                  limitTags={2}
                  options={majorsData}
                  PaperComponent={CustomPaper}
                  getOptionLabel={(option) => option.name}
                  value={selectedMajors}
                  onChange={(event, newValue) => setSelectedMajors(newValue)}
                  noOptionsText="Không tìm thấy ngành"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={selectedMajors.length === 0 ? "Tất cả ngành" : ""}
                      variant="outlined"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: 'transparent' },
                          '&:hover fieldset': { borderColor: 'transparent' },
                          '&.Mui-focused fieldset': { borderColor: 'transparent' },
                        },
                      }}
                    />
                  )}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...otherProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          variant="outlined"
                          label={option.name}
                          {...otherProps}
                          sx={{ bgcolor: '#F3F4F6', border: 'none', fontWeight: 500, height: 24 }}
                        />
                      );
                    })
                  }
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 5 }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={onAnalyzeClick}
                disabled={isAnalyzing}
                sx={{
                  bgcolor: '#D96100',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#B85200' },
                }}
              >
                Tra Cứu Khả Năng Đỗ
              </Button>
              <Button
                variant="contained"
                startIcon={<ExploreOutlinedIcon />}
                sx={{
                  bgcolor: '#fff',
                  color: '#FF6B00',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  '&:hover': { bgcolor: '#FFF3E8' },
                }}
              >
                Chưa biết chọn ngành?
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <Typography sx={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>Chia sẻ:</Typography>
              <IconButton sx={{ bgcolor: '#1877F2', color: '#fff', p: 1, width: 32, height: 32, '&:hover': { bgcolor: '#166FE5' } }}>
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton sx={{ bgcolor: '#1DA1F2', color: '#fff', p: 1, width: 32, height: 32, '&:hover': { bgcolor: '#1A91DA' } }}>
                <TwitterIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Box 
                sx={{ 
                  bgcolor: '#0068FF', color: '#fff', width: 32, height: 32, borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  fontSize: '0.65rem', fontWeight: 800, '&:hover': { bgcolor: '#005CE6' } 
                }}
              >
                Zalo
              </Box>
              <IconButton sx={{ bgcolor: '#0A66C2', color: '#fff', p: 1, width: 32, height: 32, '&:hover': { bgcolor: '#0958A6' } }}>
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton sx={{ bgcolor: '#F3F4F6', color: '#4B5563', p: 1, width: 32, height: 32, '&:hover': { bgcolor: '#E5E7EB' } }}>
                <LinkIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          <PredictionResults isLoading={isAnalyzing} result={aiResult} />

        </Container>
      </Box>

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')}>
        <Alert onClose={() => setErrorMsg('')} severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>

      <CheckDHFeatures />
      <CheckDHFooter />
    </Box>
  );
};

export default CheckDHPage;

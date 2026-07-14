import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, ToggleButton, ToggleButtonGroup, Grid, Pagination } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useData } from '../../../core/contexts/DataContext';

export const StudentLeaderboard: React.FC = () => {
  const { leaderboard = [] } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newRange: 'week' | 'month' | null) => {
    if (newRange !== null) {
      setTimeRange(newRange);
      setPage(1);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);
  
  const totalPages = Math.ceil(restList.length / itemsPerPage) || 1;
  const currentRestList = restList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getPodiumOrder = () => {
    const order = [];
    if (top3[1]) order.push({ ...top3[1], position: 2 });
    if (top3[0]) order.push({ ...top3[0], position: 1 });
    if (top3[2]) order.push({ ...top3[2], position: 3 });
    return order;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column: Podium */}
        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
                <Box display="flex" gap={2}>
                  <Box sx={{ 
                    bgcolor: '#FFFBEB', width: 48, height: 48, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A8A' }}>
                      Bảng xếp hạng
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
                      Vinh danh những học viên xuất sắc nhất hệ thống.
                    </Typography>
                  </Box>
                </Box>
                <ToggleButtonGroup
                  value={timeRange}
                  exclusive
                  onChange={handleTimeRangeChange}
                  sx={{
                    bgcolor: '#F9FAFB',
                    p: 0.5,
                    borderRadius: 1,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#6B7280',
                      px: 3,
                      py: 0.75,
                      '&.Mui-selected': {
                        bgcolor: '#1E3A8A !important',
                        color: '#FFFFFF !important',
                        boxShadow: '0 2px 8px rgba(30,58,138,0.2)',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                      }
                    },
                  }}
                >
                  <ToggleButton value="week">Tuần này</ToggleButton>
                  <ToggleButton value="month">Tháng này</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Podium */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-end', 
                gap: { xs: 1, sm: 2, md: 3 }, 
                mt: { xs: 4, md: 8 }, 
                height: 350 
              }}>
                {getPodiumOrder().map((student) => {
                  const isFirst = student.position === 1;
                  const isSecond = student.position === 2;
                  const isThird = student.position === 3;
                  
                  const podiumHeight = isFirst ? 220 : isSecond ? 160 : 130;
                  const podiumColor = isFirst 
                    ? 'linear-gradient(to top, #FEF08A, #FDE047)' 
                    : isSecond 
                      ? 'linear-gradient(to top, #E5E7EB, #D1D5DB)' 
                      : 'linear-gradient(to top, #FED7AA, #FDBA74)';
                  const numberColor = isFirst ? '#FBBF24' : isSecond ? '#9CA3AF' : '#FB923C';

                  return (
                    <Box key={student.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: 100, sm: 120, md: 140 } }}>
                      {/* Trophy for Rank 1 */}
                      {isFirst && (
                        <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 56, mb: 1, filter: 'drop-shadow(0 4px 6px rgba(245,158,11,0.4))' }} />
                      )}
                      
                      {/* Avatar & Name */}
                      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: -2.5, zIndex: 2, width: '100%' }}>
                        <Avatar 
                          src={student.avatar} 
                          sx={{ 
                            width: isFirst ? 80 : 64, 
                            height: isFirst ? 80 : 64, 
                            border: `4px solid ${isFirst ? '#3B82F6' : isSecond ? '#E5E7EB' : '#FDBA74'}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            mb: 1
                          }} 
                        />
                        <Box sx={{ 
                          bgcolor: '#FFFFFF',
                          px: 1,
                          py: 0.75,
                          borderRadius: 1,
                          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                          textAlign: 'center',
                          width: '110%',
                          minWidth: 100,
                        }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1F2937', lineHeight: 1.2, mb: 0.2 }} noWrap title={student.name}>
                            {student.name}
                          </Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: isFirst ? '#F59E0B' : '#EA580C' }}>
                            {student.points}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Podium Pillar */}
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%', 
                        height: podiumHeight, 
                        background: podiumColor,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        pt: 5,
                        boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.4), 0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 1
                      }}>
                        <Typography sx={{ 
                          fontSize: '4.5rem', 
                          fontWeight: 900, 
                          color: '#FFFFFF',
                          lineHeight: 1,
                          opacity: 0.9,
                          textShadow: `0 4px 12px ${numberColor}80`
                        }}>
                          {student.position}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: List */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <WorkspacePremiumIcon sx={{ color: '#1E3A8A', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A8A' }}>
                  Bảng vàng {timeRange === 'week' ? 'Tuần' : 'Tháng'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                {currentRestList.map((entry) => (
                  <Box
                    key={entry.rank}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: '#F9FAFB',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: '#9CA3AF', fontSize: '1rem', width: 24, textAlign: 'center' }}>
                        {entry.rank}
                      </Typography>
                      <Avatar 
                        src={entry.avatar} 
                        sx={{ 
                          width: 44, 
                          height: 44, 
                          bgcolor: entry.avatarColor
                        }} 
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.95rem' }}>
                          {entry.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {entry.school}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      bgcolor: '#FFF7ED', 
                      px: 2, 
                      py: 0.5, 
                      borderRadius: 1 
                    }}>
                      <Typography sx={{ fontWeight: 800, color: '#EA580C', fontSize: '0.9rem' }}>
                        {entry.points}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pt: 2, borderTop: '1px solid #F3F4F6' }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(e, v) => setPage(v)}
                    size="small"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 600,
                        color: '#6B7280',
                        '&.Mui-selected': {
                          bgcolor: '#1E3A8A',
                          color: '#FFFFFF',
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

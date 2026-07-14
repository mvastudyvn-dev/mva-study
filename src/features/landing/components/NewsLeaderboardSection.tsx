import React from 'react';
import { Box, Container, Typography, Card, Avatar } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useData } from '../../../core/contexts/DataContext';

const rankMedals: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const rankColors: Record<number, string> = {
  1: '#FFF4E5',
  2: '#F3F4F6',
  3: '#FCEFE4',
};

export const NewsLeaderboardSection: React.FC = () => {
  const { leaderboard } = useData();

  return (
    <Box sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 8, md: 10 }, bgcolor: '#F9FAFB' }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#FFF4E5',
              mb: 2,
            }}
          >
            <EmojiEventsIcon sx={{ color: '#FF8C2F', fontSize: 32 }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#111827',
              textAlign: 'center',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Bảng Xếp Hạng Thi Đua
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#6B7280',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Vinh danh những học viên xuất sắc nhất. Hãy nỗ lực để ghi tên mình lên bảng vàng!
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 2,
            border: 'none',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {leaderboard.map((entry) => {
                const isTop3 = entry.rank <= 3;
                return (
                  <Box
                    key={entry.rank}
                    sx={{
                      p: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 2, md: 3 },
                      borderRadius: 1.5,
                      bgcolor: isTop3 ? rankColors[entry.rank] : '#fff',
                      border: '1px solid',
                      borderColor: isTop3 ? 'transparent' : '#F3F4F6',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        borderColor: isTop3 ? 'transparent' : '#FF8C2F',
                      },
                    }}
                  >
                    {entry.rank === 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'linear-gradient(180deg, #FF8C2F 0%, #FFA858 100%)',
                        }}
                      />
                    )}
                    
                    <Typography
                      sx={{
                        fontSize: isTop3 ? '1.5rem' : '1.1rem',
                        fontWeight: 800,
                        color: isTop3 ? '#FF8C2F' : '#9CA3AF',
                        width: { xs: 30, md: 40 },
                        textAlign: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {rankMedals[entry.rank] || entry.rank}
                    </Typography>

                    <Avatar
                      src={entry.avatar}
                      sx={{
                        width: isTop3 ? 48 : 40,
                        height: isTop3 ? 48 : 40,
                        bgcolor: entry.avatarColor,
                        fontSize: isTop3 ? '1.1rem' : '0.9rem',
                        fontWeight: 600,
                        boxShadow: isTop3 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {entry.name.split(' ').pop()?.charAt(0)}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: isTop3 ? '1.1rem' : '1rem',
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        {entry.name}
                      </Typography>
                      {isTop3 && (
                        <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, mt: 0.5 }}>
                          Top {entry.rank} xuất sắc
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        sx={{
                          fontSize: isTop3 ? '1.25rem' : '1.1rem',
                          fontWeight: 800,
                          color: '#FF8C2F',
                        }}
                      >
                        {entry.points.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                        Điểm
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

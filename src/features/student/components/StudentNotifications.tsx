import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';

const typeIcons: Record<string, React.ReactNode> = {
  info: <InfoIcon sx={{ fontSize: 18, color: '#3B82F6' }} />,
  course: <SchoolIcon sx={{ fontSize: 18, color: '#10B981' }} />,
  system: <SettingsIcon sx={{ fontSize: 18, color: '#F59E0B' }} />,
};

const typeColors: Record<string, string> = {
  info: '#EFF6FF',
  course: '#ECFDF5',
  system: '#FFFBEB',
};

export const StudentNotifications: React.FC = () => {
  const { notifications } = useData();
  const { user } = useAuth();
  const [pendingTuitionCount, setPendingTuitionCount] = React.useState(0);

  React.useEffect(() => {
    if (user?.id) {
      fetch(`/api/payment/tuition/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const pending = data.filter(inv => inv.status === 'pending');
            setPendingTuitionCount(pending.length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsActiveIcon sx={{ color: '#FF8C2F', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem' }}>
              Thông báo
            </Typography>
          </Box>
          <Button
            size="small"
            sx={{ fontSize: '0.7rem', color: '#FF8C2F', fontWeight: 600, minWidth: 0 }}
          >
            Xem tất cả
          </Button>
        </Box>

        {pendingTuitionCount > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              mb: 1,
              bgcolor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FEE2E2',
              },
            }}
          >
            <Box display="flex" gap={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  bgcolor: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                <MonetizationOnIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#DC2626', mb: 0.3 }}>
                  Nhắc nhở học phí!
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#B91C1C',
                    lineHeight: 1.4,
                  }}
                >
                  Bạn đang có {pendingTuitionCount} hóa đơn chưa thanh toán.
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#EF4444', mt: 0.5, fontWeight: 600 }}>
                  Vui lòng thanh toán sớm
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {notifications.slice(0, 4).map((noti, index) => (
          <Box
            key={noti.id}
            sx={{
              p: 1.5,
              borderRadius: 1,
              mb: index < notifications.length - 1 ? 1 : 0,
              bgcolor: '#FAFAFA',
              border: '1px solid #F3F4F6',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FFF8F2',
                borderColor: '#FFE8D4',
              },
            }}
          >
            <Box display="flex" gap={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  bgcolor: typeColors[noti.type],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.2,
                }}
              >
                {typeIcons[noti.type]}
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1F2937', mb: 0.3 }}>
                  {noti.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: '#6B7280',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {noti.description}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF', mt: 0.5 }}>
                  {noti.date}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

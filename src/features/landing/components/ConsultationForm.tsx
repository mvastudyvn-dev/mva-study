import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Snackbar, Alert, MenuItem } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { StorageService } from '../../../core/services/storage';
import { useData } from '../../../core/contexts/DataContext';

const highlights = ['Tư vấn miễn phí', 'Phản hồi trong 24h', 'Cam kết chất lượng'];

export const ConsultationForm: React.FC = () => {
  const { systemSettings } = useData();
  const [form, setForm] = useState({ name: '', phone: '', email: '', courseInterest: '', content: '' });
  const [snackOpen, setSnackOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    StorageService.saveConsultation({
      id: `cons_${Date.now()}`,
      ...form,
      date: new Date().toLocaleDateString('vi-VN'),
    });

    const localSettingsStr = localStorage.getItem('mva_system_settings');
    const localSettings = localSettingsStr ? JSON.parse(localSettingsStr) : {};

    const token = (systemSettings?.telegramBotToken || localSettings?.telegramBotToken || '').trim();
    const chatId = (systemSettings?.telegramChatId || localSettings?.telegramChatId || '').trim();

    if (token && chatId) {
      const message = `🔔 <b>CÓ NGƯỜI ĐĂNG KÝ TƯ VẤN MỚI</b>\n\n` +
                      `👤 <b>Họ tên:</b> ${form.name}\n` +
                      `📞 <b>Số điện thoại:</b> ${form.phone}\n` +
                      `📧 <b>Email:</b> ${form.email}\n` +
                      `📚 <b>Quan tâm:</b> ${form.courseInterest || 'Không chọn'}\n` +
                      `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        });
        const tgData = await res.json();
        if (!tgData.ok) {
          alert('Lỗi gửi thông báo Telegram: ' + tgData.description);
        }
      } catch (error) {
        alert('Lỗi mạng khi gọi API Telegram: ' + error);
      }
    } else {
      alert('Chưa cấu hình Telegram Bot trong phần cài đặt.');
    }

    setForm({ name: '', phone: '', email: '', courseInterest: '', content: '' });
    setLoading(false);
    setSnackOpen(true);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#FAFAFA',
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: 'rgba(0,0,0,0.08)', transition: 'all 0.2s ease' },
      '&:hover fieldset': { borderColor: 'rgba(255,140,47,0.4)' },
      '&.Mui-focused': {
        bgcolor: '#FFFFFF',
        '& fieldset': {
          borderColor: '#FF8C2F',
          borderWidth: '1.5px',
          boxShadow: '0 0 0 3px rgba(255,140,47,0.10)',
        },
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.9rem',
      '&::placeholder': { color: '#9CA3AF' },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(160deg, #FFF8F2 0%, #FAFAFA 60%, #FFF3E8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <Box sx={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,140,47,0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            <HeadsetMicRoundedIcon sx={{ fontSize: 14, color: '#FF8C2F' }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tư vấn học tập
            </Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            Đăng Ký Tư Vấn Miễn Phí
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', maxWidth: 480, mx: 'auto', lineHeight: 1.75 }}>
            Để lại thông tin để được tư vấn khóa học phù hợp nhất với bạn!
          </Typography>

          {/* Highlight Pills */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            {highlights.map((h) => (
              <Box key={h} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 16, color: '#10B981' }} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {h}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Form Card */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '24px',
            p: { xs: 3, md: 5 },
            boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.8, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  Họ và tên <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập họ và tên"
                  size="small"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.8, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  Số điện thoại <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Số điện thoại"
                  size="small"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.8, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  Email <Box component="span" sx={{ color: '#EF4444' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Địa chỉ email"
                  size="small"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.8, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  Khóa học quan tâm
                </Typography>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={form.courseInterest}
                  onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}
                  displayEmpty
                  sx={inputSx}
                >
                  <MenuItem value="" disabled sx={{ color: '#9CA3AF' }}>Chọn khóa học</MenuItem>
                  <MenuItem value="IC3 GS6">IC3 GS6</MenuItem>
                  <MenuItem value="MOS Word">MOS Word</MenuItem>
                  <MenuItem value="MOS Excel">MOS Excel</MenuItem>
                  <MenuItem value="MOS PowerPoint">MOS PowerPoint</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={<SendRoundedIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    py: 1.25,
                    boxShadow: '0 4px 14px rgba(255,140,47,0.30)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                      boxShadow: '0 8px 24px rgba(255,140,47,0.40)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': { opacity: 0.65 },
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Đăng ký'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackOpen(false)}
          sx={{
            borderRadius: '12px',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(16,185,129,0.20)',
          }}
        >
          Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm. 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
};

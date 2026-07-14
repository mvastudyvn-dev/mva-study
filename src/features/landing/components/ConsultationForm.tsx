import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Snackbar, Alert, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { StorageService } from '../../../core/services/storage';
import { useData } from '../../../core/contexts/DataContext';

export const ConsultationForm: React.FC = () => {
  const { systemSettings } = useData();
  const [form, setForm] = useState({ name: '', phone: '', email: '', courseInterest: '', content: '' });
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveConsultation({
      id: `cons_${Date.now()}`,
      ...form,
      date: new Date().toLocaleDateString('vi-VN'),
    });

    // Gửi thông báo qua Telegram nếu có cấu hình
    if (systemSettings?.telegramBotToken && systemSettings?.telegramChatId) {
      const message = `🔔 <b>CÓ NGƯỜI ĐĂNG KÝ TƯ VẤN MỚI</b>\n\n` +
                      `👤 <b>Họ tên:</b> ${form.name}\n` +
                      `📞 <b>Số điện thoại:</b> ${form.phone}\n` +
                      `📧 <b>Email:</b> ${form.email}\n` +
                      `📚 <b>Quan tâm:</b> ${form.courseInterest || 'Không chọn'}\n` +
                      `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${systemSettings.telegramBotToken.trim()}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: systemSettings.telegramChatId.trim(),
            text: message,
            parse_mode: 'HTML'
          })
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
    setSnackOpen(true);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      bgcolor: '#fff',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF8C2F' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF8C2F' },
    },
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#FFF8F2' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: 1,
            p: { xs: 3, md: 5 },
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #F3F4F6',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: '#1F2937',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
            }}
          >
            ĐĂNG KÝ TƯ VẤN
          </Typography>
          <Typography
            sx={{ textAlign: 'center', color: '#6B7280', mb: 4, fontSize: '0.9rem' }}
          >
            Để lại thông tin để được tư vấn khóa học phù hợp nhất!
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Họ và tên"
                  size="small"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
                <TextField
                  fullWidth
                  placeholder="Email"
                  size="small"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  value={form.courseInterest}
                  onChange={(e) => setForm({ ...form, courseInterest: e.target.value })}
                  displayEmpty
                  sx={inputSx}
                >
                  <MenuItem value="" disabled>Nội dung quan tâm</MenuItem>
                  <MenuItem value="IC3 GS6">IC3 GS6</MenuItem>
                  <MenuItem value="MOS Word">MOS Word</MenuItem>
                  <MenuItem value="MOS Excel">MOS Excel</MenuItem>
                  <MenuItem value="MOS PowerPoint">MOS PowerPoint</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: '#EF4444',
                    borderRadius: 1,
                    fontWeight: 600,
                    py: 1,
                    '&:hover': { bgcolor: '#DC2626' },
                  }}
                >
                  Đăng ký
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ borderRadius: 1 }}>
          Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm.
        </Alert>
      </Snackbar>
    </Box>
  );
};

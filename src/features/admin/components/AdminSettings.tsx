import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Button, Switch, FormControlLabel,
  Divider, Alert, IconButton, Avatar, Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useData } from '../../../core/contexts/DataContext';
import { StorageService } from '../../../core/services/storage';
import { useAuth } from '../../../core/contexts/AuthContext';
import type { SystemSettings } from '../../../core/types/global';

export const AdminSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { systemSettings, refreshData, resetLeaderboard } = useData();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [adminAvatar, setAdminAvatar] = useState(user?.avatar || '');
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Hiển thị preview ngay lập tức
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminAvatar(reader.result as string);
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);

      // Tải lên Supabase Storage
      const url = await StorageService.uploadFile(file, 'avatars');
      if (url) {
        setAdminAvatar(url);
        updateProfile({ avatar: url });
      }
    }
  };

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  if (!settings) return null;

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    await StorageService.updateSystemSettings(settings);
    refreshData();
    setSuccessMsg('Đã lưu cấu hình hệ thống thành công!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleExportData = () => {
    const allData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mva_')) {
        allData[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mva_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!window.confirm('CẢNH BÁO: Việc phục hồi dữ liệu sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn?')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        for (const key in data) {
          if (key.startsWith('mva_')) {
            localStorage.setItem(key, data[key]);
          }
        }
        alert('Phục hồi dữ liệu thành công! Trình duyệt sẽ tự động tải lại.');
        window.location.reload();
      } catch (_err) {
        alert('File không hợp lệ hoặc bị lỗi!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetLeaderboard = () => {
    if (window.confirm('CẢNH BÁO TỐI MẬT: Bạn có chắc chắn muốn reset toàn bộ điểm trên bảng xếp hạng về 0? (Dữ liệu điểm bài thi của học sinh vẫn được giữ nguyên)')) {
      resetLeaderboard();
      setSuccessMsg('Đã reset bảng xếp hạng thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 800, color: '#1F2937', m: 0, whiteSpace: 'nowrap' }}>
          Cài đặt Hệ thống
        </Typography>
        <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ whiteSpace: 'nowrap' }}>
          Lưu thay đổi
        </Button>
      </Stack>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      <Grid container spacing={3}>
        {/* Nhóm Profile Admin */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#374151' }}>
                👤 Hồ sơ Quản trị viên
              </Typography>
              <Box display="flex" alignItems="center" gap={3}>
                <Box position="relative">
                  <Avatar 
                    src={adminAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=1A202C&color=fff`} 
                    sx={{ width: 80, height: 80 }} 
                  />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="admin-avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="admin-avatar-upload">
                    <IconButton component="span" sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: 'white', border: '1px solid #E5E7EB', '&:hover': { bgcolor: '#F3F4F6' } }}>
                      <PhotoCameraIcon fontSize="small" color="action" />
                    </IconButton>
                  </label>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Ảnh đại diện Admin</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#6B7280', mb: 1 }}>Nhấn vào biểu tượng máy ảnh để thay đổi.</Typography>
                  <TextField 
                    label="Tên hiển thị" size="small" sx={{ mt: 1, minWidth: 250 }}
                    value={user?.name || ''} 
                    onChange={(e) => updateProfile({ name: e.target.value })}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Nhóm 1: Thông tin Chung & Giao diện */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#374151' }}>
                🏢 Thông tin Liên hệ
              </Typography>
              <TextField 
                fullWidth label="Tên Trung tâm / Hệ thống" size="small" sx={{ mb: 2 }}
                value={settings.contactName} onChange={(e) => handleChange('contactName', e.target.value)}
              />
              <TextField 
                fullWidth label="Số điện thoại Hotline" size="small" sx={{ mb: 2 }}
                value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)}
              />
              <TextField 
                fullWidth label="Email hỗ trợ" size="small"
                value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                📢 Cấu hình Pop-up Thông báo
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Pop-up sẽ hiển thị cho mọi người dùng khi mới truy cập vào trang chủ.
              </Typography>
              <FormControlLabel
                control={<Switch checked={settings.popupEnabled} onChange={(e) => handleChange('popupEnabled', e.target.checked)} color="primary" />}
                label={settings.popupEnabled ? "Đang BẬT pop-up" : "Đang TẮT pop-up"}
                sx={{ mb: 2 }}
              />
              {settings.popupEnabled && (
                <>
                  <TextField 
                    fullWidth label="Tiêu đề Pop-up" size="small" sx={{ mb: 2 }}
                    value={settings.popupTitle} onChange={(e) => handleChange('popupTitle', e.target.value)}
                  />
                  <TextField 
                    fullWidth label="Nội dung thông báo" size="small" multiline rows={3}
                    value={settings.popupContent} onChange={(e) => handleChange('popupContent', e.target.value)}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                ⏳ Cấu hình Đếm Ngược Trang Chủ
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Hiển thị bộ đếm ngược thời gian tới kỳ thi trên trang Landing Page.
              </Typography>
              <FormControlLabel
                control={<Switch checked={settings.countdownEnabled} onChange={(e) => handleChange('countdownEnabled', e.target.checked)} color="primary" />}
                label={settings.countdownEnabled ? "Đang BẬT đếm ngược" : "Đang TẮT đếm ngược"}
                sx={{ mb: 2 }}
              />
              {settings.countdownEnabled && (
                <>
                  <TextField 
                    fullWidth label="Tiêu đề chính" size="small" sx={{ mb: 2 }}
                    value={settings.countdownTitle} onChange={(e) => handleChange('countdownTitle', e.target.value)}
                  />
                  <TextField 
                    fullWidth label="Chú thích phụ" size="small" sx={{ mb: 2 }}
                    value={settings.countdownSubtitle} onChange={(e) => handleChange('countdownSubtitle', e.target.value)}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Ngày giờ đích
                  </Typography>
                  <TextField 
                    fullWidth size="small" type="datetime-local" 
                    value={settings.countdownTargetDate || ''} 
                    onChange={(e) => handleChange('countdownTargetDate', e.target.value)}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Nhóm 2: Cấu hình Thi cử & Backup */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#374151' }}>
                🎓 Cấu hình Thi cử & Đào tạo
              </Typography>
              <TextField 
                fullWidth label="Điểm Đạt tối thiểu (0 - 10)" size="small" type="number" sx={{ mb: 3 }}
                value={settings.passMark} onChange={(e) => handleChange('passMark', parseFloat(e.target.value))}
                inputProps={{ step: "0.1", min: "0", max: "10" }}
              />
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={<Switch checked={settings.aiAnalysisEnabled} onChange={(e) => handleChange('aiAnalysisEnabled', e.target.checked)} color="secondary" />}
                label={
                  <Box>
                    <Typography variant="body1">Bật tính năng AI Phân tích kết quả</Typography>
                    <Typography variant="caption" color="text.secondary">Tự động sinh nhận xét điểm mạnh/yếu sau khi thi xong.</Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                🚀 Cấu hình Thông báo Telegram
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Nhận tin nhắn báo về điện thoại ngay khi có người đăng ký tư vấn. (Để trống nếu không dùng)
              </Typography>
              <TextField 
                fullWidth label="Telegram Bot Token" size="small" sx={{ mb: 2 }}
                value={settings.telegramBotToken || ''} onChange={(e) => handleChange('telegramBotToken', e.target.value)}
              />
              <TextField 
                fullWidth label="Telegram Chat ID" size="small"
                value={settings.telegramChatId || ''} onChange={(e) => handleChange('telegramChatId', e.target.value)}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 1, mb: 2, color: '#6B7280' }}>
                * Tạo bot qua @BotFather để lấy Token. Nhắn tin cho bot và dùng API getUpdates để lấy Chat ID. Hoặc dùng bot @userinfobot để lấy trực tiếp Chat ID.
              </Typography>
              <Button 
                variant="outlined" 
                color="info" 
                size="small"
                onClick={async () => {
                  if (!settings.telegramBotToken || !settings.telegramChatId) {
                    alert('Vui lòng nhập Token và Chat ID trước khi test!');
                    return;
                  }
                  try {
                    const res = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        chat_id: settings.telegramChatId.trim(),
                        text: '✅ <b>Test thành công!</b> Hệ thống đã kết nối được với Telegram của bạn.',
                        parse_mode: 'HTML'
                      })
                    });
                    const data = await res.json();
                    if (data.ok) {
                      alert('Thành công! Hãy kiểm tra tin nhắn Telegram của bạn.');
                    } else {
                      alert('Lỗi từ Telegram: ' + data.description);
                    }
                  } catch (e) {
                    alert('Lỗi kết nối tới Telegram. Vui lòng kiểm tra mạng.');
                  }
                }}
              >
                Gửi tin nhắn thử nghiệm
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1, mb: 3, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', bgcolor: '#111827', color: '#F9FAFB' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#F87171' }}>
                ☢️ Quản Lí Tối Mật
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#9CA3AF' }}>
                Cảnh báo: Các thao tác trong khu vực này sẽ ảnh hưởng trực tiếp đến toàn hệ thống.
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#FCA5A5' }}>Trạng thái truy cập</Typography>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.maintenanceMode || false} 
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)} 
                        color="error" 
                      />
                    }
                    label={settings.maintenanceMode ? "Đang bảo trì (Học sinh bị chặn)" : "Hoạt động bình thường"}
                  />
                </Box>
                
                <Divider sx={{ borderColor: '#374151' }} />
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#FCA5A5' }}>Bảng xếp hạng</Typography>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleResetLeaderboard}
                    fullWidth
                    sx={{ fontWeight: 600, py: 1 }}
                  >
                    Reset Bảng Xếp Hạng Về 0
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', bgcolor: '#FFF1F2' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#BE123C' }}>
                🔒 Sao lưu & Phục hồi Dữ liệu (Backup)
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#9F1239' }}>
                Tải xuống toàn bộ dữ liệu hệ thống dưới dạng file JSON hoặc Phục hồi lại trạng thái cũ từ file đã lưu.
              </Typography>
              
              <Box display="flex" gap={2}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#E11D48', '&:hover': { bgcolor: '#BE123C' } }} 
                  startIcon={<DownloadIcon />}
                  onClick={handleExportData}
                  fullWidth
                >
                  Xuất Dữ liệu
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<UploadIcon />}
                  component="label"
                  fullWidth
                >
                  Nhập Dữ liệu
                  <input type="file" hidden accept=".json" onChange={handleImportData} />
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

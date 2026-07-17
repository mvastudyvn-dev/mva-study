import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Button, Avatar, Divider, Switch, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Paper, IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DevicesIcon from '@mui/icons-material/Devices';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../../core/contexts/AuthContext';
import { StorageService } from '../../../core/services/storage';

export const StudentSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [school, setSchool] = useState(user?.school || '');
  const [province, setProvince] = useState(user?.province || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Hiển thị preview ngay lập tức
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Tải lên Supabase Storage
      const url = await StorageService.uploadFile(file, 'avatars');
      if (url) {
        setAvatarPreview(url);
      }
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ name, phone, dob, school, province, avatar: avatarPreview });
    alert('Đã lưu thông tin cá nhân!');
  };

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Mimi',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Max',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella'
];

  const renderProfileTab = () => (
    <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Hồ sơ cá nhân</Typography>
        
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Box position="relative">
            <Avatar src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=3B82F6&color=fff`} sx={{ width: 100, height: 100, bgcolor: '#f3f4f6' }} />
            <IconButton 
              onClick={() => setIsAvatarModalOpen(true)}
              component="span" 
              sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', border: '1px solid #E5E7EB', '&:hover': { bgcolor: '#F3F4F6' } }}
            >
              <PhotoCameraIcon fontSize="small" color="action" />
            </IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Ảnh đại diện</Typography>
            <Button onClick={() => setIsAvatarModalOpen(true)} variant="outlined" size="small" sx={{ borderRadius: 1 }}>Chọn avatar</Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Họ và tên" fullWidth value={name} onChange={e => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Số điện thoại" fullWidth value={phone} onChange={e => setPhone(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} disabled />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Ngày sinh" type="date" fullWidth value={dob} onChange={e => setDob(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4B5563', mb: 2, mt: 1 }}>Thông tin trường học</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField label="Trường THPT" fullWidth value={school} onChange={e => setSchool(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Tỉnh / Thành phố" fullWidth value={province} onChange={e => setProvince(e.target.value)} />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" onClick={handleSaveProfile} sx={{ bgcolor: '#FF8C2F', borderRadius: 1, px: 4, '&:hover': { bgcolor: '#FF6B00' } }}>
            Lưu thay đổi
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <Box display="flex" flexDirection="column" gap={3}>
      <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Đổi mật khẩu</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Mật khẩu hiện tại" type="password" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Mật khẩu mới" type="password" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Xác nhận mật khẩu mới" type="password" fullWidth />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" sx={{ bgcolor: '#3B82F6', borderRadius: 1, px: 4 }}>Cập nhật mật khẩu</Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DevicesIcon /> Quản lý thiết bị
          </Typography>
          <Typography sx={{ color: '#6B7280', mb: 3 }}>Danh sách các thiết bị đang đăng nhập tài khoản của bạn.</Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Trình duyệt Chrome - Windows 11</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#10B981' }}>Thiết bị hiện tại (Đang hoạt động)</Typography>
            </Box>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Safari - iPhone 14 Pro Max</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#6B7280' }}>Đăng nhập 2 giờ trước, tại Hà Nội</Typography>
            </Box>
            <Button size="small" color="error" sx={{ textTransform: 'none' }}>Đăng xuất</Button>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );

  const renderNotificationsTab = () => (
    <Box display="flex" flexDirection="column" gap={3}>
      <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Cài đặt thông báo</Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Khóa học & Bài giảng mới</Typography>} secondary="Nhận thông báo khi có khóa học hoặc video mới được cập nhật." />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="" />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Kết quả học tập</Typography>} secondary="Gửi kết quả bài thi thử hoặc báo cáo học tập tuần qua email." />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="" />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={<Typography sx={{ fontWeight: 600 }}>Tin tức & Khuyến mãi</Typography>} secondary="Thông báo về các chương trình ưu đãi học phí từ MVA." />
              <FormControlLabel control={<Switch color="primary" />} label="" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Liên kết mạng xã hội</Typography>
          <Typography sx={{ color: '#6B7280', mb: 3 }}>Liên kết tài khoản để đăng nhập nhanh hơn vào lần sau.</Typography>
          
          <Box display="flex" alignItems="center" justifyContent="space-between" p={2} border="1px solid #E5E7EB" borderRadius={2} mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <GoogleIcon sx={{ color: '#EA4335' }} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>Google</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#6B7280' }}>Chưa liên kết</Typography>
              </Box>
            </Box>
            <Button variant="outlined" size="small" sx={{ borderRadius: 1 }}>Liên kết</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', mb: 4 }}>
        Cài đặt tài khoản
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#6B7280',
              minHeight: 48,
            },
            '& .Mui-selected': {
              color: '#3B82F6 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3B82F6',
            }
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Hồ sơ cá nhân" value="profile" />
          <Tab icon={<SecurityIcon />} iconPosition="start" label="Bảo mật" value="security" />
          <Tab icon={<NotificationsIcon />} iconPosition="start" label="Thông báo" value="notifications" />
        </Tabs>
      </Box>

      <Box>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </Box>

      <Dialog 
        open={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 8 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Chọn Avatar</Typography>
          <IconButton onClick={() => setIsAvatarModalOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} justifyContent="center" py={2}>
            {PRESET_AVATARS.map((url, idx) => (
              <Grid item xs={4} sm={3} display="flex" justifyContent="center" key={idx}>
                <Avatar 
                  src={url} 
                  onClick={() => {
                    setAvatarPreview(url);
                    setIsAvatarModalOpen(false);
                  }}
                  sx={{ 
                    width: 80, height: 80, cursor: 'pointer', 
                    bgcolor: '#F3F4F6',
                    border: avatarPreview === url ? '3px solid #FF8C2F' : '2px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

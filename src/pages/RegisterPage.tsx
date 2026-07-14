import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Grid, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/contexts/AuthContext';
import { StorageService } from '../core/services/storage';
import { AuthLayout } from '../features/auth/components/AuthLayout';

const customInputStyles = {
  bgcolor: '#FFF8F2', 
  borderRadius: 1,
  transition: 'all 0.25s',
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    height: '52px',
    '& fieldset': { 
      border: '1px solid #F4D8B8',
      transition: 'all 0.25s'
    },
    '&:hover fieldset': {
      borderColor: '#F59E42',
    },
    '&.Mui-focused': { 
      bgcolor: '#FFFFFF',
      boxShadow: '0 0 0 3px rgba(245, 158, 66, 0.15)',
      '& fieldset': { border: '1px solid #F59E42' }
    }
  },
  '& .MuiInputBase-input': {
    py: 0,
    px: '18px',
    fontSize: '1rem',
    height: '100%',
    color: '#2D2D2D',
    '&::placeholder': {
      color: '#B8B8B8',
      opacity: 1
    }
  }
};

const RegisterPage: React.FC = () => {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    gender: '',
    birthYear: '',
    facebook: '',
    province: '',
    school: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (regData.password !== regData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (regData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    
    const res = await StorageService.registerUser(regData);
    if (res.success && res.user) {
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } else {
      setError(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegData({ ...regData, [field]: e.target.value });
  };

  return (
    <AuthLayout 
      title="Tạo tài khoản" 
      subtitle="Học tập và giao lưu với hàng triệu học viên trên mọi miền đất nước."
    >
      <Box sx={{ px: { xs: 0, sm: 1 } }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" fontWeight="800" color="#F59E42" gutterBottom>
            ĐĂNG KÝ
          </Typography>
          <Typography variant="body2" color="#6B7280" fontStyle="italic" sx={{ fontSize: '0.85rem' }}>
            Vui lòng điền thông tin để tham gia hệ thống
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleRegister} sx={{ maxWidth: 460, mx: 'auto' }}>
          <Grid container spacing={2.5}>
            {[
              { label: 'Họ và tên *', field: 'name', type: 'text' },
              { label: 'Tên tài khoản *', field: 'username', type: 'text' },
              { label: 'Mật khẩu *', field: 'password', type: 'password' },
              { label: 'Xác nhận lại mật khẩu *', field: 'confirmPassword', type: 'password' },
              { label: 'Email *', field: 'email', type: 'email' },
              { label: 'Số điện thoại *', field: 'phone', type: 'text' },
              { label: 'Giới tính', field: 'gender', type: 'select', options: ['Nam', 'Nữ', 'Khác'] },
              { label: 'Năm sinh *', field: 'birthYear', type: 'text' },
              { label: 'Link Facebook *', field: 'facebook', type: 'text' },
              { label: 'Tỉnh thành *', field: 'province', type: 'select', options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Khác'] },
              { label: 'Trường học *', field: 'school', type: 'select', options: ['THPT A', 'THPT B', 'Khác'] },
            ].map((item) => (
              <Grid item xs={12} key={item.field}>
                <Typography variant="body2" color="#F59E42" sx={{ mb: 0.5, ml: 0.5, fontWeight: 500 }}>
                  {item.label.replace(' *', '')} <span style={{ color: '#EF4444' }}>{item.label.includes('*') ? '*' : ''}</span>
                </Typography>
                <TextField 
                  fullWidth 
                  placeholder={`Nhập ${item.label.replace(' *', '').toLowerCase()}`}
                  type={item.type === 'select' ? 'text' : item.type}
                  select={item.type === 'select'}
                  variant="outlined" 
                  size="small"
                  required={item.label.includes('*')}
                  value={(regData as any)[item.field]}
                  onChange={handleChange(item.field)}
                  sx={{
                    ...customInputStyles,
                    '& .MuiInputBase-input': { py: 1.2 }
                  }}
                >
                  {item.type === 'select' && item.options?.map((option) => (
                    <MenuItem key={option} value={option} sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" color="#6B7280" textAlign="center" sx={{ mb: 4, mt: 3, fontSize: '0.8rem' }}>
            Trang web này được bảo vệ bởi reCAPTCHA và <span style={{ color: '#F59E42' }}>Chính sách quyền riêng tư</span> và <span style={{ color: '#F59E42' }}>Điều khoản dịch vụ</span> của Google được áp dụng.
          </Typography>

          <Box textAlign="center" mt={2} mb={2}>
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                bgcolor: '#F59E42', 
                color: 'white',
                px: 5,
                py: 1.2, 
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#EA8A1A', boxShadow: 'none' }
              }}
            >
              Tạo tài khoản
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="#6B7280" fontSize="0.85rem">
              Đã có tài khoản?{' '}
              <Typography 
                component="span" 
                variant="body2" 
                color="#F59E42" 
                sx={{ cursor: 'pointer' }} 
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;

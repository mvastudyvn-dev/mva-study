import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Grid, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/contexts/AuthContext';
import { StorageService } from '../core/services/storage';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { Turnstile } from '@marsidev/react-turnstile';

const customInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#FAFAFA',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.08)',
      transition: 'all 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,140,47,0.40)',
    },
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
    py: '11px',
    '&::placeholder': { color: '#9CA3AF', opacity: 1 },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.85rem',
  },
};

const RegisterPage: React.FC = () => {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [regTurnstileToken, setRegTurnstileToken] = useState<string>('');
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    gender: '',
    birthYear: '',
    province: '',
    school: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regTurnstileToken) {
      setError('Vui lòng xác nhận bạn không phải là robot!');
      return;
    }

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

  const fieldGroups = [
    { label: 'Họ và tên', field: 'name', type: 'text', required: true },
    { label: 'Tên tài khoản', field: 'username', type: 'text', required: true },
    { label: 'Mật khẩu', field: 'password', type: 'password', required: true },
    { label: 'Xác nhận lại mật khẩu', field: 'confirmPassword', type: 'password', required: true },
    { label: 'Email', field: 'email', type: 'email', required: true },
    { label: 'Số điện thoại', field: 'phone', type: 'text', required: true },
    { label: 'Giới tính', field: 'gender', type: 'select', options: ['Nam', 'Nữ', 'Khác'], required: false },
    { label: 'Năm sinh', field: 'birthYear', type: 'text', required: true },
    { label: 'Tỉnh thành', field: 'province', type: 'select', options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Khác'], required: true },
    { label: 'Trường học', field: 'school', type: 'select', options: ['THPT A', 'THPT B', 'Khác'], required: true },
  ];

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Học tập và giao lưu với hàng triệu học viên trên mọi miền đất nước."
    >
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              color: '#0F172A',
              mb: 0.5,
              fontSize: '1.7rem',
              letterSpacing: '-0.025em',
            }}
          >
            Đăng ký
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Vui lòng điền thông tin để tham gia hệ thống
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister}>
          <Grid container spacing={2}>
            {fieldGroups.map((item) => (
              <Grid item xs={12} key={item.field}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#374151',
                      mb: 0.8,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {item.label}
                    {item.required && <Box component="span" sx={{ color: '#EF4444', ml: 0.4 }}>*</Box>}
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={`Nhập ${item.label.toLowerCase()}`}
                    type={item.type === 'select' ? 'text' : item.type}
                    select={item.type === 'select'}
                    variant="outlined"
                    size="small"
                    required={item.required}
                    value={(regData as any)[item.field]}
                    onChange={handleChange(item.field)}
                    sx={customInputStyles}
                  >
                    {item.type === 'select' && item.options?.map((option) => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.875rem' }}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              textAlign: 'center',
              mt: 3,
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            Trang web này được bảo vệ bởi Cloudflare Turnstile và{' '}
            <Box component="span" sx={{ color: '#FF8C2F', fontWeight: 600 }}>Chính sách quyền riêng tư</Box>
            {' '}và{' '}
            <Box component="span" sx={{ color: '#FF8C2F', fontWeight: 600 }}>Điều khoản dịch vụ</Box>.
          </Typography>

          <Box textAlign="center" mb={3} display="flex" justifyContent="center">
            <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={(token) => setRegTurnstileToken(token)} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
              color: 'white',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              py: 1.5,
              boxShadow: '0 4px 16px rgba(255,140,47,0.30)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                boxShadow: '0 8px 24px rgba(255,140,47,0.40)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Tạo tài khoản
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Đã có tài khoản?{' '}
              <Box
                component="span"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#FF8C2F',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  '&:hover': { color: '#E67923', textDecoration: 'underline' },
                }}
              >
                Đăng nhập ngay
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;

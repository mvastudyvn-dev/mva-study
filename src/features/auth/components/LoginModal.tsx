import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, TextField, Button, Typography, 
  Box, IconButton, Divider, Alert, Grid, InputAdornment 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../../../core/contexts/AuthContext';
import { StorageService } from '../../../core/services/storage';

const customInputStyles = {
  bgcolor: '#F3F6F9', 
  borderRadius: 1,
  transition: 'all 0.2s',
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    '& fieldset': { border: 'none' }, // Remove harsh solid borders
    '&.Mui-focused': { 
      bgcolor: '#FFFFFF',
      boxShadow: '0 0 0 4px rgba(255, 140, 47, 0.3)', // Soft orange outer glow
    }
  },
  '& .MuiInputBase-input': {
    py: 1.2,
    fontSize: '0.95rem'
  }
};

export const LoginModal: React.FC<{open: boolean; onClose: () => void}> = ({ open, onClose }) => {
  const { loginDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginTurnstileToken, setLoginTurnstileToken] = useState<string>('');

  // Register State
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    school: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regTurnstileToken, setRegTurnstileToken] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Bỏ qua check bot cho tài khoản admin/demo mặc định nếu cần
    if (!loginTurnstileToken && email !== 'admin@mvastudy.vn' && email !== 'ngminhanh@gmail.com') {
      setError('Vui lòng xác nhận bạn không phải là robot!');
      return;
    }
    if (email === 'admin@mvastudy.vn' && password === 'admin') {
      loginDemo('admin', null);
      onClose();
      return;
    } 
    
    const users = await StorageService.getUsers();
    // Allow login by email or username
    const user = users.find(u => (u.email === email || u.username === email) && u.role === 'student');
    
    // Fallback password cho các user cũ chưa có cột password
    const userPassword = user?.password || '123456';

    if (user && userPassword === password) {
      if (user.status === 'locked') {
        setError('Tài khoản của bạn đã bị khóa bởi Quản trị viên!');
      } else {
        loginDemo('student', user);
        onClose();
      }
    } else if (email === 'ngminhanh@gmail.com' && password === '123456') {
       loginDemo('student', null);
       onClose();
    } else {
      setError('Tên đăng nhập/Email hoặc mật khẩu không đúng!');
    }
  };

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
      loginDemo('student', res.user);
      onClose();
    } else {
      setError(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
    setShowRegPassword(false);
    setShowRegConfirmPassword(false);
    setLoginTurnstileToken('');
    setRegTurnstileToken('');
    setRegData({ name: '', phone: '', school: '', username: '', email: '', password: '', confirmPassword: '' });
    setMode('login');
    onClose();
  };

  const handleQuickStudentLogin = async () => {
    const users = await StorageService.getUsers();
    const user = users.find(u => u.email === 'ngminhanh@gmail.com' && u.role === 'student');
    if (user && user.status === 'locked') {
      setError('Tài khoản của bạn đã bị khóa bởi Quản trị viên!');
    } else {
      loginDemo('student', user || null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      PaperProps={{ 
        sx: { 
          borderRadius: 1, 
          p: 3, 
          minWidth: mode === 'register' ? {xs: 320, sm: 600} : {xs: 320, sm: 440},
          transition: 'min-width 0.3s ease',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        } 
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ bgcolor: '#F59E42', color: 'white', p: 1, borderRadius: 1, display: 'flex' }}>
            <SchoolOutlinedIcon />
          </Box>
          <Typography variant="h5" fontWeight="800" color="#F59E42" sx={{ letterSpacing: '0.5px' }}>
            {mode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ TÀI KHOẢN'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" fontStyle={mode === 'login' ? 'italic' : 'normal'} sx={{ mt: 1, fontSize: '0.85rem' }}>
          {mode === 'login' ? '(Hệ thống Mapuni và Mapstudy có thể sử dụng chung một tài khoản để đăng nhập)' : 'Nhập thông tin để tham gia khóa học'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 16, top: 16 }}><CloseIcon /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, overflowX: 'hidden' }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>{error}</Alert>}
        
        {mode === 'login' ? (
          /* ================== FORM ĐĂNG NHẬP ================== */
          <Box component="form" onSubmit={handleLogin} sx={{ px: { xs: 0, sm: 2 } }}>
            <Box mb={2.5}>
              <Typography variant="body2" color="#4B5563" sx={{ mb: 0.8, ml: 0.5, fontWeight: 600 }}>Tên tài khoản hoặc Email</Typography>
              <TextField 
                fullWidth variant="outlined" size="small"
                value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="Nhập tên tài khoản hoặc email"
                sx={customInputStyles}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                }}
              />
            </Box>
            <Box mb={3}>
              <Typography variant="body2" color="#4B5563" sx={{ mb: 0.8, ml: 0.5, fontWeight: 600 }}>Mật khẩu</Typography>
              <TextField 
                fullWidth type={showPassword ? 'text' : 'password'} variant="outlined" size="small"
                value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Nhập mật khẩu"
                sx={customInputStyles}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box textAlign="center" mt={2} display="flex" justifyContent="center">
              <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={(token) => setLoginTurnstileToken(token)} />
            </Box>

            <Box textAlign="center" mt={2}>
              <Button type="submit" fullWidth variant="contained" sx={{ 
                bgcolor: '#F59E42', 
                color: 'white',
                borderRadius: 1,
                py: 1.2, 
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 140, 47, 0.25)',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#EA8A1A', opacity: 0.9, boxShadow: '0 6px 16px rgba(255, 140, 47, 0.35)', transform: 'translateY(-1px)' }
              }}>
                Đăng nhập
              </Button>
            </Box>
            
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="#6B7280" fontSize="0.9rem">
                Chưa có tài khoản?{' '}
                <Typography component="span" variant="body2" color="#F59E42" sx={{ cursor: 'pointer', fontWeight: 600, transition: '0.2s', '&:hover': { opacity: 0.8 } }} onClick={() => setMode('register')}>
                  Đăng ký ngay
                </Typography>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}><Typography variant="body2" color="#9CA3AF">Hoặc dùng tài khoản Demo</Typography></Divider>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Button variant="outlined" sx={{ color: '#F59E42', borderColor: '#F59E42', borderRadius: 1, textTransform: 'none', fontWeight: 600 }} fullWidth onClick={handleQuickStudentLogin}>Đăng nhập Học viên Demo</Button>
              <Button variant="outlined" color="secondary" sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }} fullWidth onClick={() => { loginDemo('admin'); onClose(); }}>Đăng nhập Admin Demo</Button>
            </Box>
          </Box>
        ) : (
          /* ================== FORM ĐĂNG KÝ ================== */
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>HỌ TÊN</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required
                  placeholder="Nguyễn Văn A"
                  value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>ĐIỆN THOẠI</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required
                  placeholder="09..."
                  value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>TRƯỜNG HỌC</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small"
                  placeholder="THPT ..."
                  value={regData.school} onChange={(e) => setRegData({...regData, school: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SchoolIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>TÊN ĐĂNG NHẬP</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required
                  placeholder="nguyenvana"
                  value={regData.username} onChange={(e) => setRegData({...regData, username: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><AlternateEmailIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>EMAIL</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required type="email"
                  placeholder="mail@vidu.com"
                  value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>MẬT KHẨU</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required type={showRegPassword ? 'text' : 'password'}
                  placeholder="******"
                  value={regData.password} onChange={(e) => setRegData({...regData, password: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowRegPassword(!showRegPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                          {showRegPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight="700" color="#4B5563" sx={{ ml: 1 }}>XÁC NHẬN</Typography>
                <TextField 
                  fullWidth variant="outlined" size="small" required type={showRegConfirmPassword ? 'text' : 'password'}
                  placeholder="******"
                  value={regData.confirmPassword} onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                  sx={{...customInputStyles, mt: 0.5}}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                          {showRegConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Box textAlign="center" mt={3} display="flex" justifyContent="center">
              <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={(token) => setRegTurnstileToken(token)} />
            </Box>
            
            <Box textAlign="center" mt={2}>
              <Button type="submit" fullWidth variant="contained" sx={{ 
                bgcolor: '#F59E42', 
                color: 'white',
                mt: 4, 
                mb: 2, 
                py: 1.2, 
                borderRadius: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 140, 47, 0.25)',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#EA8A1A', opacity: 0.9, boxShadow: '0 6px 16px rgba(255, 140, 47, 0.35)', transform: 'translateY(-1px)' }
              }}>
                Hoàn tất đăng ký
              </Button>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="body2" color="#6B7280" fontSize="0.9rem">
                Đã có tài khoản?{' '}
                <Typography component="span" variant="body2" color="#F59E42" sx={{ cursor: 'pointer', fontWeight: 600, transition: '0.2s', '&:hover': { opacity: 0.8 } }} onClick={() => setMode('login')}>
                  Đăng nhập
                </Typography>
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

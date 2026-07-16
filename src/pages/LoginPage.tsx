import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../core/contexts/AuthContext';
import { StorageService } from '../core/services/storage';
import { Turnstile } from '@marsidev/react-turnstile';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const LoginPage: React.FC = () => {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = location.state?.from;
  const successMessage = location.state?.message;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginTurnstileToken, setLoginTurnstileToken] = useState<string>('');
  
  // Trạng thái cho hiệu ứng Tilt 3D thuần React
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Add stylesheets dynamically to scope them to this page
    const links = [
      '/login-v1/vendor/bootstrap/css/bootstrap.min.css',
      '/login-v1/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
      '/login-v1/vendor/animate/animate.css',
      '/login-v1/vendor/css-hamburgers/hamburgers.min.css',
      '/login-v1/vendor/select2/select2.min.css',
      '/login-v1/css/util.css',
      '/login-v1/css/main.css'
    ];

    links.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.className = 'login-v1-style';
      document.head.appendChild(link);
    });

    return () => {
      document.querySelectorAll('.login-v1-style').forEach(el => el.remove());
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const tiltX = (y - 0.5) * 30; // 30 degrees max tilt
    const tiltY = (x - 0.5) * -30;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.1, 1.1, 1.1)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Xử lý các trường rỗng
    if (!trimmedEmail || !trimmedPassword) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    if (!loginTurnstileToken && trimmedEmail !== 'admin@mvastudy.vn' && trimmedEmail !== 'ngminhanh@gmail.com') {
      setError('Vui lòng xác nhận bạn không phải là robot!');
      return;
    }

    if (trimmedEmail === 'admin@mvastudy.vn' && trimmedPassword === 'admin') {
      loginDemo('admin', null);
      navigate(returnUrl || '/admin');
      return;
    } 
    
    const users = await StorageService.getUsers();
    const user = users.find(u => (u.email === trimmedEmail || u.username === trimmedEmail) && u.role === 'student');
    const userPassword = user?.password || '123456';

    if (user && userPassword === trimmedPassword) {
      if (user.status === 'locked') {
        setError('Tài khoản của bạn đã bị khóa bởi Quản trị viên!');
      } else {
        loginDemo('student', user);
        navigate(returnUrl || '/');
      }
    } else if (trimmedEmail === 'ngminhanh@gmail.com' && trimmedPassword === '123456') {
       loginDemo('student', null);
       navigate(returnUrl || '/');
    } else {
      setError('Tên đăng nhập/Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        {/* Floating Icons Background */}
        <div className="floating-icons-container">
          <SchoolIcon className="floating-icon" style={{ top: '15%', left: '10%', fontSize: '80px', animationDelay: '0s' }} />
          <MenuBookIcon className="floating-icon" style={{ top: '70%', left: '15%', fontSize: '60px', animationDelay: '2s' }} />
          <CreateIcon className="floating-icon" style={{ top: '20%', right: '15%', fontSize: '70px', animationDelay: '1s', transform: 'rotate(45deg)' }} />
          <AutoStoriesIcon className="floating-icon" style={{ top: '75%', right: '10%', fontSize: '90px', animationDelay: '3s' }} />
          <SchoolIcon className="floating-icon" style={{ top: '45%', left: '45%', fontSize: '150px', animationDelay: '1.5s', opacity: 0.3 }} />
          <CreateIcon className="floating-icon" style={{ top: '85%', left: '40%', fontSize: '50px', animationDelay: '4s' }} />
          <MenuBookIcon className="floating-icon" style={{ top: '10%', left: '60%', fontSize: '50px', animationDelay: '2.5s' }} />
        </div>

        <div className="wrap-login100">
          <div 
            className="login100-pic" 
            style={tiltStyle}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img src="/login-v1/images/img-01.png" alt="IMG" style={{ width: '100%', height: 'auto' }} />
          </div>

          <form className="login100-form validate-form" onSubmit={handleLogin}>
            <span className="login100-form-title">
              ĐĂNG NHẬP
            </span>

            {error && (
              <div style={{ color: '#c80000', textAlign: 'center', marginBottom: '20px', fontFamily: 'Poppins-Medium', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {successMessage && !error && (
              <div style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '20px', fontFamily: 'Poppins-Medium', fontSize: '14px' }}>
                {successMessage}
              </div>
            )}

            <div className="wrap-input100 validate-input" data-validate="Vui lòng nhập email hợp lệ">
              <input 
                className="input100" 
                type="text" 
                name="email" 
                placeholder="Email hoặc Tên tài khoản" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Vui lòng nhập mật khẩu">
              <input 
                className="input100" 
                type="password" 
                name="pass" 
                placeholder="Mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={(token) => setLoginTurnstileToken(token)} />
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit">
                Đăng nhập
              </button>
            </div>

            <div className="text-center p-t-12">
              <span className="txt1" style={{ marginRight: '5px' }}>
                Quên
              </span>
              <a className="txt2" href="#">
                Tên đăng nhập / Mật khẩu?
              </a>
            </div>

            <div className="text-center p-t-136">
              <a className="txt2" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
                Tạo tài khoản của bạn
                <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

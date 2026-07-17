import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemText, Divider, Tooltip, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Home, GraduationCap, Users, Trophy, Headset, LayoutGrid, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const navItems = [
  { icon: <Home size={18} strokeWidth={1.8} />, id: 'section-hero', path: '/', tooltip: 'Trang chủ', label: 'Trang chủ' },
  { icon: <GraduationCap size={18} strokeWidth={1.8} />, id: 'section-courses', path: '/', tooltip: 'Khóa học', label: 'Khóa học' },
  { icon: <Trophy size={18} strokeWidth={1.8} />, id: 'section-news', path: '/', tooltip: 'Bảng xếp hạng', label: 'Xếp hạng' },
  { icon: <Users size={18} strokeWidth={1.8} />, id: 'section-teachers', path: '/', tooltip: 'Giảng viên', label: 'Giảng viên' },
  { icon: <Headset size={18} strokeWidth={1.8} />, id: 'section-consultation', path: '/', tooltip: 'Liên hệ tư vấn', label: 'Liên hệ' },
];

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('section-hero');
  const [anchorElUtilities, setAnchorElUtilities] = useState<null | HTMLElement>(null);

  const handleUtilitiesClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUtilities(event.currentTarget);
  };

  const handleUtilitiesClose = () => {
    setAnchorElUtilities(null);
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 20);
      const scrollPosition = window.scrollY + 200;
      let currentActive = 'section-hero';
      navItems.forEach(item => {
        const section = document.getElementById(item.id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            currentActive = item.id;
          }
        }
      });
      setActiveSection(currentActive);
    };
    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    handleScrollEvent();
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const handleNavigation = (id: string, path: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px !important', gap: 2 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Box
                component="img"
                src={logo}
                alt="MVA Study Logo"
                onClick={() => window.location.href = '/'}
                sx={{
                  height: 38,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.04)', opacity: 0.9 },
                }}
              />
            </Box>

            {/* Desktop Nav — center */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Tooltip title={item.tooltip} key={item.id} arrow placement="bottom">
                    <Box
                      onClick={() => handleNavigation(item.id, item.path)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.6,
                        px: 1.6,
                        py: 0.9,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        color: isActive ? '#FF8C2F' : '#4B5563',
                        bgcolor: isActive ? 'rgba(255, 140, 47, 0.08)' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#FF8C2F',
                          bgcolor: 'rgba(255, 140, 47, 0.08)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 700 : 500,
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          whiteSpace: 'nowrap',
                          lineHeight: 1,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
              {/* Desktop Only */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
                {/* Utilities Dropdown */}
                <Box
                  onClick={handleUtilitiesClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    color: Boolean(anchorElUtilities) ? '#FF8C2F' : '#4B5563',
                    px: 1.4,
                    py: 0.8,
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': { color: '#FF8C2F', bgcolor: 'rgba(255,140,47,0.06)' },
                  }}
                >
                  <LayoutGrid size={16} strokeWidth={2} />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1 }}>
                    Tiện ích
                  </Typography>
                  <ChevronDown
                    size={14}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: Boolean(anchorElUtilities) ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </Box>

                <Box sx={{ width: '1px', height: '16px', bgcolor: 'rgba(0,0,0,0.1)' }} />

                {!user ? (
                  <>
                    <Typography
                      onClick={() => navigate('/register')}
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#4B5563',
                        cursor: 'pointer',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        px: 1.4,
                        py: 0.8,
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        '&:hover': { color: '#FF8C2F', bgcolor: 'rgba(255,140,47,0.06)' },
                      }}
                    >
                      Đăng ký
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{
                        background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        borderRadius: '10px',
                        px: '18px',
                        py: '8px',
                        textTransform: 'none',
                        boxShadow: '0 4px 14px rgba(255,140,47,0.30)',
                        transition: 'all 0.25s ease',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                          boxShadow: '0 8px 24px rgba(255,140,47,0.40)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(user.role === 'admin' ? '/admin' : '/student')}
                      sx={{
                        borderColor: 'rgba(255, 140, 47, 0.4)',
                        color: '#FF8C2F',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        borderRadius: '10px',
                        borderWidth: '1.5px',
                        px: '16px',
                        py: '7px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          borderColor: '#FF8C2F',
                          borderWidth: '1.5px',
                          bgcolor: 'rgba(255, 140, 47, 0.06)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={logout}
                      sx={{
                        color: '#EF4444',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        borderRadius: '10px',
                        px: '14px',
                        py: '7px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        '&:hover': { bgcolor: '#FEF2F2' },
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                )}
              </Box>

              {/* Mobile Hamburger */}
              <IconButton
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: '#374151',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '10px',
                  p: 1,
                  '&:hover': { bgcolor: 'rgba(255,140,47,0.06)', borderColor: 'rgba(255,140,47,0.3)' },
                }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>

              {/* Utilities Dropdown Menu */}
              <Menu
                anchorEl={anchorElUtilities}
                open={Boolean(anchorElUtilities)}
                onClose={handleUtilitiesClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 24px rgba(0,0,0,0.10))',
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: '14px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    p: 0.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 140, 47, 0.08)',
                        color: '#FF8C2F',
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { handleUtilitiesClose(); navigate('/uni'); }}>
                  🎓 Dự đoán đỗ Đại học
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '20px 0 0 20px',
            border: 'none',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box component="img" src={logo} alt="Logo" sx={{ height: 32 }} />
            <IconButton
              onClick={() => setMobileOpen(false)}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '8px', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

          {/* Navigation Links */}
          <List disablePadding>
            {navItems.map((item) => (
              <ListItem
                key={item.id}
                onClick={() => { setMobileOpen(false); handleNavigation(item.id, item.path); }}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '10px',
                  mb: 0.5,
                  px: 1.5,
                  py: 1.2,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(255,140,47,0.08)' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: '#9CA3AF' }}>{item.icon}</Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

          {/* Utilities */}
          <Typography variant="overline" sx={{ px: 1.5, color: '#9CA3AF', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            Tiện ích
          </Typography>
          <ListItem
            onClick={() => { setMobileOpen(false); navigate('/uni'); }}
            sx={{ cursor: 'pointer', borderRadius: '10px', px: 1.5, py: 1.2, mt: 0.5, '&:hover': { bgcolor: 'rgba(255,140,47,0.08)' } }}
          >
            <ListItemText
              primary="🎓 Dự đoán đỗ đại học"
              primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            />
          </ListItem>

          <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

          {/* Auth Actions */}
          {!user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { setMobileOpen(false); navigate('/register'); }}
                sx={{
                  borderRadius: '12px',
                  borderWidth: '1.5px',
                  borderColor: 'rgba(255,140,47,0.4)',
                  color: '#FF8C2F',
                  fontWeight: 700,
                  py: 1.2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  '&:hover': { borderWidth: '1.5px', borderColor: '#FF8C2F', bgcolor: 'rgba(255,140,47,0.06)' },
                }}
              >
                Đăng ký
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                  fontWeight: 700,
                  py: 1.2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  boxShadow: '0 4px 14px rgba(255,140,47,0.30)',
                }}
              >
                Đăng nhập
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { setMobileOpen(false); navigate(user.role === 'admin' ? '/admin' : '/student'); }}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                  fontWeight: 700,
                  py: 1.2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                Dashboard
              </Button>
              <Button
                fullWidth
                onClick={() => { setMobileOpen(false); logout(); }}
                sx={{ borderRadius: '12px', color: '#EF4444', fontWeight: 600, py: 1.2, '&:hover': { bgcolor: '#FEF2F2' } }}
              >
                Đăng xuất
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

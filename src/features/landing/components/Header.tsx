import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemText, Divider, Tooltip, Menu, MenuItem } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import MenuIcon from '@mui/icons-material/Menu';
import { Home, GraduationCap, Users, Trophy, Headset, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const navIcons = [
  { icon: <Home size={22} strokeWidth={1.5} />, id: 'section-hero', path: '/', tooltip: 'Trang chủ' },
  { icon: <GraduationCap size={22} strokeWidth={1.5} />, id: 'section-courses', path: '/', tooltip: 'Khóa học' },
  { icon: <Trophy size={22} strokeWidth={1.5} />, id: 'section-news', path: '/', tooltip: 'Bảng xếp hạng' },
  { icon: <Users size={22} strokeWidth={1.5} />, id: 'section-teachers', path: '/', tooltip: 'Giảng viên' },
  { icon: <Headset size={22} strokeWidth={1.5} />, id: 'section-consultation', path: '/', tooltip: 'Liên hệ tư vấn' },
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
      navIcons.forEach(item => {
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
    window.addEventListener('scroll', handleScrollEvent);
    handleScrollEvent(); // initial check
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
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          borderBottom: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '60px !important' }}>
            {/* Left Side: Logo & Search */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Brand Logo */}
              <Box
                component="img"
                src={logo}
                alt="Logo"
                onClick={() => window.location.href = '/'}
                sx={{
                  height: 40,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              />


            </Box>

            {/* Center Side: Desktop Center Icons */}
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3.5,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              {navIcons.map((item, index) => (
                <Tooltip title={item.tooltip} key={index} arrow placement="bottom">
                  <IconButton
                    onClick={() => handleNavigation(item.id, item.path)}
                    sx={{
                      color: activeSection === item.id ? '#F59E42' : '#6B7280',
                      bgcolor: activeSection === item.id ? 'rgba(255, 140, 47, 0.08)' : 'transparent',
                      p: 1.2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#F59E42',
                        bgcolor: 'rgba(255, 140, 47, 0.08)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}


            </Box>

            {/* Right Side: Action Nodes */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3 }}>
                <Box 
                  onClick={handleUtilitiesClick}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: Boolean(anchorElUtilities) ? '#F59E42' : '#4B5563', transition: '0.2s', '&:hover': { color: '#F59E42' } }}
                >
                  <LayoutGrid size={18} strokeWidth={2} />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1 }}
                  >
                    Tiện ích
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ height: 16, borderColor: '#D1D5DB', alignSelf: 'center' }} />

                {!user ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: '#4B5563', fontWeight: 600, transition: '0.2s', '&:hover': { color: '#F59E42' }, whiteSpace: 'nowrap', lineHeight: 1 }}
                        onClick={() => navigate('/register')}
                      >
                        Đăng ký
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{
                        bgcolor: '#F59E42',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        borderRadius: 1,
                        px: '24px',
                        py: '10px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        transition: 'all 0.25s',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                        '&:hover': {
                          bgcolor: '#EA8A1A',
                          boxShadow: 'none',
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
                        borderColor: '#F59E42',
                        color: '#F59E42',
                        fontWeight: 700,
                        borderRadius: 1,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        '&:hover': { borderColor: '#EA8A1A', bgcolor: 'rgba(255, 140, 47, 0.05)' },
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={logout}
                      sx={{ color: '#EF4444', fontWeight: 700, borderRadius: 1, textTransform: 'none', whiteSpace: 'nowrap' }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                )}
              </Box>
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              
              {/* Tiện ích Menu */}
              <Menu
                anchorEl={anchorElUtilities}
                open={Boolean(anchorElUtilities)}
                onClose={handleUtilitiesClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 140, 47, 0.08)',
                        color: '#F59E42',
                      }
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: '50%',
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { handleUtilitiesClose(); navigate('/uni'); }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Dự đoán đỗ Đại học</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <List>
            {navIcons.map((item) => (
              <ListItem key={item.id} onClick={() => { setMobileOpen(false); handleNavigation(item.id, item.path); }} sx={{ cursor: 'pointer' }}>
                <ListItemText primary={item.tooltip} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Tiện ích</Typography>
            <ListItem onClick={() => { setMobileOpen(false); navigate('/uni'); }} sx={{ cursor: 'pointer' }}>
              <ListItemText primary="Dự đoán đỗ đại học" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            {!user && (
              <>
                <ListItem onClick={() => { setMobileOpen(false); navigate('/register'); }} sx={{ cursor: 'pointer' }}>
                  <ListItemText primary="Đăng ký" sx={{ color: '#4B5563', fontWeight: 600 }} />
                </ListItem>
                <ListItem onClick={() => { setMobileOpen(false); navigate('/login'); }} sx={{ cursor: 'pointer' }}>
                  <ListItemText primary="Đăng nhập" sx={{ color: '#F59E42', fontWeight: 700 }} />
                </ListItem>
              </>
            )}
            {user && (
              <ListItem onClick={() => { setMobileOpen(false); logout(); }} sx={{ cursor: 'pointer' }}>
                <ListItemText primary="Đăng xuất" sx={{ color: '#EF4444', fontWeight: 700 }} />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

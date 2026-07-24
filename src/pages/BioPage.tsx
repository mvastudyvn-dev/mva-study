import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Avatar, Stack,
  IconButton, Card, CardActionArea, Chip, Divider, Tooltip, Collapse,
} from '@mui/material';
import {
  Facebook, YouTube, Language, Phone,
  ArrowForward, Star, School, LocalFireDepartment, ExpandMore, ExpandLess,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useData } from '../core/contexts/DataContext';
import logo1 from '../assets/logo1.png';

// ── Brand colors (sync với theme.ts #FF8C2F) ───────────────────────
const C = {
  primary: '#FF8C2F',
  primaryDark: '#E67923',
  primaryLight: '#FFB86C',
  primaryBg: '#FFF7F0',
  primaryBorder: 'rgba(255,140,47,0.22)',
  text: '#111827',
  textSub: '#64748B',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
  pageBg: '#F5F6FA',
  cardBg: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.06)',
};

// ── THPT keyword filter ────────────────────────────────────────────
const THPT_KW = ['thpt', 'thptqg', 'quốc gia', 'đại học', 'xét tuyển', 'lớp 12'];
const EXCLUDE_KW = ['mos', 'ic3', 'văn phòng'];
const isThpt = (title: string, desc: string) => {
  const t = `${title} ${desc}`.toLowerCase();
  return THPT_KW.some(k => t.includes(k)) && !EXCLUDE_KW.some(k => t.includes(k));
};

// ── Custom SVG Icons ───────────────────────────────────────────────
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.674c-.015 1.574-1.284 2.842-2.859 2.857-1.575-.015-2.844-1.283-2.859-2.857-.015-1.574 1.284-2.843 2.859-2.858.337 0 .666.059.974.172V9.45c-.315-.054-.637-.08-.962-.078-3.435.019-6.21 2.825-6.229 6.26-.019 3.436 2.766 6.234 6.2 6.253 3.435.02 6.227-2.756 6.246-6.192V8.904a8.213 8.213 0 0 0 5.845 2.502V7.935a4.838 4.838 0 0 1-2-.663v-.586z" />
  </svg>
);
const ZaloIcon = () => (
  <svg width="18" height="18" viewBox="0 0 50 50" fill="currentColor">
    <path d="M25,3C12.85,3,3,12.85,3,25c0,4.86,1.58,9.35,4.25,13.01L3.87,46.63c-0.27,0.97,0.64,1.87,1.61,1.6L14.4,45.6C17.93,47.77,22.12,49,26.6,49C38.17,49,47,39.17,47,27.6C47,14.3,37.2,3,25,3z M35.93,32.5c-0.3,0.84-1.76,1.56-2.44,1.65c-0.61,0.09-1.38,0.12-2.23-0.14c-0.51-0.16-1.17-0.38-2-0.72c-3.52-1.52-5.82-5.06-5.99-5.3c-0.17-0.24-1.41-1.87-1.41-3.57c0-1.7,0.89-2.54,1.21-2.88c0.31-0.35,0.68-0.43,0.91-0.43c0.23,0,0.45,0,0.65,0.01c0.21,0.01,0.49-0.08,0.76,0.58c0.28,0.68,0.96,2.35,1.05,2.52c0.09,0.17,0.14,0.37,0.03,0.59c-0.11,0.23-0.17,0.37-0.33,0.56c-0.17,0.2-0.35,0.44-0.5,0.59c-0.17,0.17-0.34,0.35-0.15,0.69c0.2,0.34,0.87,1.43,1.87,2.32c1.28,1.14,2.37,1.5,2.7,1.66c0.34,0.17,0.53,0.14,0.73-0.08c0.2-0.23,0.84-0.98,1.07-1.32c0.22-0.33,0.45-0.28,0.76-0.17c0.31,0.11,1.96,0.93,2.3,1.09c0.34,0.17,0.56,0.25,0.64,0.38C36.23,30.96,36.23,31.66,35.93,32.5z" />
  </svg>
);
const MessengerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.934 1.488 5.503 3.75 7.147.167.121.286.305.322.505l.397 2.186c.09.497.643.766 1.055.513l2.457-1.498c.182-.112.395-.152.604-.122A10.701 10.701 0 0012 20.52c5.523 0 10-4.145 10-9.26S17.523 2 12 2zm1.093 11.265l-2.613-2.775c-.34-.362-.916-.38-1.281-.04l-3.376 3.149c-.452.422.186 1.12.723.771l2.842-1.84a.89.89 0 011.002.052l2.608 2.378c.365.333.921.303 1.25-.067l3.366-3.784c.435-.488-.236-1.185-.756-.788l-2.765 2.944z" />
  </svg>
);

// ── Social Button ──────────────────────────────────────────────────
const SocialBtn: React.FC<{
  label: string; icon: React.ReactNode; color: string;
  href?: string; onClick?: () => void;
}> = ({ label, icon, color, href, onClick }) => (
  <Tooltip title={label} placement="top">
    <IconButton
      component={href ? 'a' : 'button'} href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      sx={{
        width: 44, height: 44, color: C.textSub,
        bgcolor: C.white, border: `1.5px solid rgba(0,0,0,0.07)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.22s',
        '&:hover': {
          color: '#fff', bgcolor: color, borderColor: color,
          transform: 'translateY(-3px)', boxShadow: `0 6px 18px ${color}55`,
        },
      }}
    >{icon}</IconButton>
  </Tooltip>
);

// ── Stat Card ──────────────────────────────────────────────────────
const StatCard: React.FC<{ emoji: string; value: string; label: string }> = ({ emoji, value, label }) => (
  <Box sx={{
    flex: 1, textAlign: 'center', py: 1.5, px: 0.5,
    borderRadius: 3, bgcolor: C.primaryBg, border: `1px solid ${C.primaryBorder}`,
  }}>
    <Typography sx={{ fontSize: '1.25rem', lineHeight: 1.1 }}>{emoji}</Typography>
    <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.1rem' }, color: C.primary, mt: 0.2 }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: '0.67rem', color: C.textMuted }}>{label}</Typography>
  </Box>
);

// ── Course Card ────────────────────────────────────────────────────
const CourseCard: React.FC<{
  course: {
    id: string; title: string; description: string; icon: string;
    price: number; rating: number; ratingCount: number;
    lessonsCount: number; bgGradient: string; durationMonths?: number; thumbnail?: string;
  };
  index: number;
}> = ({ course, index }) => {
  const isHot = index === 0;
  const [expanded, setExpanded] = useState(false);
  const isNew = index === 1;

  return (
    <Card sx={{
      bgcolor: C.cardBg,
      borderRadius: '20px',
      border: `1.5px solid rgba(0,0,0,0.07)`,
      boxShadow: `0 4px 16px ${C.shadow}`,
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 16px 40px rgba(255,140,47,0.15), 0 0 0 2px ${C.primaryBorder}`,
        borderColor: C.primaryBorder,
      },
    }}>
      <CardActionArea onClick={() => setExpanded(!expanded)} sx={{ borderRadius: '20px' }}>

        {/* ── Image area ── */}
        <Box sx={{
          width: '100%', position: 'relative',
          paddingTop: '56.25%', // 16:9
          overflow: 'hidden',
          background: course.bgGradient || `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
        }}>
          {/* Thumbnail image */}
          {course.thumbnail && (
            <Box
              component="img"
              src={course.thumbnail}
              alt={course.title}
              sx={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.45s ease',
                '.MuiCardActionArea-root:hover &': { transform: 'scale(1.06)' },
              }}
              onError={(e: any) => { e.target.style.display = 'none'; }}
            />
          )}
          {/* Emoji fallback centered */}
          {!course.thumbnail && (
            <Typography sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              fontSize: '3.5rem', lineHeight: 1,
            }}>
              {course.icon || '💻'}
            </Typography>
          )}

          {/* Gradient overlay — bottom dark for text */}
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.15) 55%, transparent 100%)',
          }} />

          {/* Overlay title + stars on the image */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 1.5, sm: 2 } }}>
            <Typography sx={{
              fontWeight: 800, color: '#fff',
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1.3, textShadow: '0 1px 6px rgba(0,0,0,0.5)', mb: 0.6,
            }}>
              {course.title}
            </Typography>
            {course.rating > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} sx={{ fontSize: 13, color: s <= Math.round(course.rating) ? '#FBBF24' : 'rgba(255,255,255,0.3)' }} />
                ))}
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  {course.rating.toFixed(1)}
                  {course.ratingCount > 0 && <Box component="span" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}> ({course.ratingCount})</Box>}
                </Typography>
              </Stack>
            )}
          </Box>

          {/* Badge */}
          {(isHot || isNew) && (
            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
              <Chip
                icon={isHot ? <LocalFireDepartment sx={{ fontSize: 12, color: '#fff !important' }} /> : undefined}
                label={isHot ? 'Hot' : '✨ Mới'}
                size="small"
                sx={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                  color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 22,
                  boxShadow: `0 4px 12px rgba(255,140,47,0.5)`,
                }}
              />
            </Box>
          )}
        </Box>

        {/* ── Bottom bar ── */}
        <Stack direction="row" alignItems="center" justifyContent="space-between"
          sx={{ px: { xs: 1.5, sm: 2 }, py: 1.4, bgcolor: C.white, borderTop: `1px solid rgba(0,0,0,0.05)` }}
        >
          {/* Left: meta only */}
          <Box>
            {course.lessonsCount > 0 && (
              <Typography sx={{ fontSize: '0.72rem', color: C.textMuted, lineHeight: 1.4 }}>
                📹 {course.lessonsCount} bài học
              </Typography>
            )}
            <Typography sx={{ fontSize: '0.72rem', color: C.textSub, lineHeight: 1.4 }}>
              {course.durationMonths ? `⏱ ${course.durationMonths} tháng` : '⏱ Trọn đời'}
            </Typography>
          </Box>

          {/* Right: price + expand icon */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography sx={{
              fontWeight: 800, color: C.primary,
              fontSize: { xs: '0.95rem', sm: '1rem' }, whiteSpace: 'nowrap',
            }}>
              {course.price > 0 ? `${new Intl.NumberFormat('vi-VN').format(course.price)}đ` : 'Miễn phí'}
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: '50%',
              bgcolor: expanded ? C.primary : C.primaryBg,
              color: expanded ? '#fff' : C.primary,
              transition: 'all 0.2s',
            }}>
              {expanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
            </Box>
          </Stack>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 2, pt: 0.5, bgcolor: C.white }}>
            <Typography sx={{ fontSize: '0.85rem', color: C.textSub, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {course.description}
            </Typography>
          </Box>
        </Collapse>
      </CardActionArea>
    </Card>
  );
};

// ── Main Page ──────────────────────────────────────────────────────
const BioPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, systemSettings } = useData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const pageTitle = systemSettings?.contactName || 'MVA Study';
  const contactPhone = systemSettings?.contactPhone || '';
  const contactEmail = systemSettings?.contactEmail || '';

  // Lọc khóa THPT QG, ưu tiên chữ XPS lên đầu, sau đó sắp xếp theo giá tăng dần
  const displayCourses = courses
    .filter(c => isThpt(c.title, c.description))
    .sort((a, b) => {
      const aXps = a.title.toLowerCase().includes('xps');
      const bXps = b.title.toLowerCase().includes('xps');
      if (aXps && !bXps) return -1;
      if (!aXps && bXps) return 1;
      return a.price - b.price;
    });

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
    @keyframes fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse-glow {
      0%,100%{ box-shadow:0 0 0 0 rgba(255,140,47,0.35); }
      50%    { box-shadow:0 0 0 10px rgba(255,140,47,0); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <Box sx={{ minHeight: '100vh', bgcolor: C.pageBg, fontFamily: "'Inter',sans-serif", pb: 10, position: 'relative', overflow: 'hidden' }}>

        {/* Ambient blobs */}
        <Box sx={{ position: 'fixed', top: -100, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,140,47,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'fixed', bottom: -60, left: -50, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,184,108,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Orange header banner ── */}
        <Box sx={{
          width: '100%', height: { xs: 150, sm: 170 },
          background: `linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
          <Box sx={{ position: 'absolute', top: 20, left: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
          {/* Wave */}
          <Box component="svg" viewBox="0 0 1440 55" xmlns="http://www.w3.org/2000/svg"
            sx={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%', height: 55 }}
            preserveAspectRatio="none"
          >
            <path d="M0,28 C400,56 1040,0 1440,28 L1440,56 L0,56 Z" fill={C.pageBg} />
          </Box>
        </Box>

        <Container maxWidth="sm" sx={{
          px: { xs: 2, sm: 3 },
          mt: { xs: -7.5, sm: -8.5 },
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>

          {/* ── PROFILE ── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3.5, animation: 'fade-up 0.5s ease both' }}>

            {/* Avatar */}
            <Box sx={{ position: 'relative', mb: 1.5 }}>
              <Avatar src={logo1} alt={pageTitle} sx={{
                width: { xs: 88, sm: 104 }, height: { xs: 88, sm: 104 },
                bgcolor: C.white,
                border: `4px solid ${C.white}`,
                boxShadow: `0 6px 28px rgba(255,140,47,0.22), 0 2px 8px rgba(0,0,0,0.08)`,
                animation: 'pulse-glow 3.5s ease infinite',
                '& img': { objectFit: 'contain' },
              }} />
              <Box sx={{
                position: 'absolute', bottom: 4, right: 4, width: 22, height: 22,
                borderRadius: '50%', bgcolor: '#22C55E', border: `3px solid ${C.white}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 900, color: '#fff',
              }}>✓</Box>
            </Box>

            {/* Name */}
            <Typography variant="h5" sx={{
              fontWeight: 900, color: C.text, textAlign: 'center', mb: 0.5,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: { xs: '1.4rem', sm: '1.6rem' },
            }}>
              {pageTitle}
            </Typography>

            {/* Subject badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.6,
              px: 2, py: 0.55, borderRadius: 20, mb: 1.8,
              bgcolor: C.primaryBg, border: `1px solid ${C.primaryBorder}`,
            }}>
              <School sx={{ fontSize: 13, color: C.primary }} />
              <Typography variant="caption" sx={{ color: C.primary, fontWeight: 700, letterSpacing: '0.03em' }}>
                Luyện Thi THPT Quốc Gia · Môn Tin Học
              </Typography>
            </Box>

            {/* Bio */}
            <Typography variant="body2" sx={{
              textAlign: 'center', color: C.textSub, maxWidth: 310, lineHeight: 1.75, mb: 2.5,
            }}>
              Đồng hành cùng hàng nghìn học sinh chinh phục môn Tin học THPT.{' '}
              <Box component="span" sx={{ color: C.primary, fontWeight: 700 }}>
                Cam kết điểm cao · Vững bước vào Đại học!
              </Box>
            </Typography>

            {/* Stats */}
            <Stack direction="row" spacing={1.5} sx={{ width: '100%', mb: 2.5 }}>
              <StatCard emoji="🎓" value="5000+" label="Học sinh" />
              <StatCard emoji="⭐" value="4.9" label="Đánh giá" />
              <StatCard emoji="📚" value={`${displayCourses.length}+`} label="Khóa học" />
            </Stack>

            {/* Social icons */}
            <Stack direction="row" spacing={1.2} flexWrap="wrap" justifyContent="center">
              <SocialBtn label="Facebook" icon={<Facebook sx={{ fontSize: 18 }} />} href="https://www.facebook.com/tminh.mva/" color="#1877F2" />
              <SocialBtn label="YouTube" icon={<YouTube sx={{ fontSize: 18 }} />} href="https://youtube.com" color="#FF0000" />
              <SocialBtn label="TikTok" icon={<TikTokIcon />} href="https://www.tiktok.com/@__hhaa_" color="#010101" />
              <SocialBtn label="Zalo" icon={<ZaloIcon />} href={`https://zalo.me/${contactPhone || '0'}`} color="#0068FF" />
              <SocialBtn label="Website đầy đủ" icon={<Language sx={{ fontSize: 18 }} />} onClick={() => navigate('/')} color={C.primary} />
            </Stack>
          </Box>

          {/* ── Section divider ── */}
          <Box sx={{ mb: 2.5, animation: 'fade-up 0.5s 0.12s ease both' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Divider sx={{ flex: 1 }} />
              <Box sx={{ px: 2, py: 0.5, borderRadius: 10, bgcolor: C.primaryBg, border: `1px solid ${C.primaryBorder}` }}>
                <Typography variant="caption" sx={{ color: C.primary, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  📖 Khóa học nổi bật
                </Typography>
              </Box>
              <Divider sx={{ flex: 1 }} />
            </Stack>
          </Box>

          {/* ── Courses grid ── */}
          {displayCourses.length > 0 ? (
            <Stack spacing={2.5}>
              {displayCourses.map((course, i) => (
                <Box key={course.id} sx={{ animation: `fade-up 0.5s ${0.18 + i * 0.07}s ease both` }}>
                  <CourseCard course={course} index={i} />
                </Box>
              ))}
            </Stack>
          ) : (
            <Box sx={{ p: 5, textAlign: 'center', borderRadius: 4, bgcolor: C.primaryBg, border: `1.5px dashed ${C.primaryBorder}` }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>📚</Typography>
              <Typography variant="body2" sx={{ color: C.textMuted }}>Khóa học sẽ sớm cập nhật.</Typography>
            </Box>
          )}

          {/* ── CTA ── */}
          <Box sx={{
            mt: 4, p: { xs: 2.5, sm: 3 }, borderRadius: '20px', textAlign: 'center',
            bgcolor: C.white, border: `1.5px solid ${C.primaryBorder}`,
            boxShadow: `0 4px 20px rgba(255,140,47,0.07)`,
            animation: 'fade-up 0.5s 0.38s ease both',
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: C.text, mb: 0.5, fontSize: '1.1rem' }}>
              🚀 Liên hệ đăng ký ngay
            </Typography>
            <Typography variant="body2" sx={{ color: C.textSub, mb: 2.5 }}>
              Nhắn tin trực tiếp để được tư vấn lộ trình và nhận ưu đãi!
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
              <Box component="a" href={`https://zalo.me/${contactPhone || '0'}`} target="_blank" sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                px: 3, py: 1.2, borderRadius: '12px',
                background: '#0068FF', color: '#fff', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                boxShadow: `0 4px 14px rgba(0,104,255,0.35)`,
                transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px rgba(0,104,255,0.45)` },
              }}>
                <ZaloIcon /> Zalo
              </Box>

              <Box component="a" href="https://m.me/tminh.mva" target="_blank" sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                px: 3, py: 1.2, borderRadius: '12px',
                background: '#0084FF', color: '#fff', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                boxShadow: `0 4px 14px rgba(0,132,255,0.35)`,
                transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px rgba(0,132,255,0.45)` },
              }}>
                <MessengerIcon /> Messenger
              </Box>

              <Box component="a" href="https://tiktok.com" target="_blank" sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                px: 3, py: 1.2, borderRadius: '12px',
                background: '#010101', color: '#fff', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                boxShadow: `0 4px 14px rgba(1,1,1,0.35)`,
                transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px rgba(1,1,1,0.45)` },
              }}>
                <TikTokIcon /> TikTok
              </Box>
            </Stack>
          </Box>

          {/* ── Footer ── */}
          <Box sx={{ mt: 6, textAlign: 'center', animation: 'fade-up 0.5s 0.45s ease both' }}>
            <Typography variant="caption" sx={{ color: C.textMuted, display: 'block', mb: 0.5 }}>
              © {new Date().getFullYear()} {pageTitle} · Powered with ❤️
            </Typography>
            <Box component="span" onClick={() => navigate('/')} sx={{
              color: C.primary, fontSize: '0.72rem', cursor: 'pointer',
              opacity: 0.7, transition: 'opacity 0.2s', '&:hover': { opacity: 1 },
            }}>
              Truy cập nền tảng học tập đầy đủ →
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BioPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Divider,
} from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Header, Footer } from '../features/landing';
import { useData } from '../core/contexts/DataContext';
import { useAuth } from '../core/contexts/AuthContext';
import { getExamHistory, type ExamAttempt } from '../core/services/examHistory';

// ── Helpers ──────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 8) return '#10B981';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
}

function getScoreBadge(score: number) {
  if (score >= 8) return { label: 'Xuất sắc', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
  if (score >= 6.5) return { label: 'Giỏi', color: '#FF8C2F', bg: 'rgba(255,140,47,0.1)' };
  if (score >= 5) return { label: 'Đạt', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
  return { label: 'Chưa đạt', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
}

function formatDateTime(isoString: string) {
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Page ─────────────────────────────────────────────────────────
const ExamInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exams, courses, refreshData } = useData();
  const { user } = useAuth();

  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    refreshData();
    window.scrollTo(0, 0);
  }, [refreshData, id]);

  const exam = useMemo(() => exams.find(e => e.id === id), [exams, id]);
  const course = useMemo(() => exam ? courses.find(c => c.id === exam.courseId) : null, [courses, exam]);

  useEffect(() => {
    if (!user || !id) { setLoadingHistory(false); return; }
    setLoadingHistory(true);
    getExamHistory(user.id, id).then(data => {
      setHistory(data);
      setLoadingHistory(false);
    });
  }, [user, id]);

  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : null;

  const MAX_ATTEMPTS = 10;
  const isMaxReached = !loadingHistory && history.length >= MAX_ATTEMPTS;

  // Số câu theo answerKey thực tế
  const part1Count = exam?.answerKey?.part1?.length || 0;
  const part2Count = exam?.answerKey?.part2?.length || 0;
  const hasTwoParts = part2Count > 0;
  // Hiển thị số câu: nếu 2 phần → ghi rõ, nếu 1 phần → chỉ tổng
  const questionCountLabel = hasTwoParts
    ? `Phần 1: ${part1Count} — Phần 2: ${part2Count}`
    : `${part1Count} câu`;

  if (!exam) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFF8F2' }}>
        <Header />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Không tìm thấy đề thi.</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFF8F2' }}>
      <Header />

      {/* Hero banner — cam chủ đạo */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #7C2D00 0%, #C2410C 40%, #FF8C2F 100%)',
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 380, height: 380, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />
        <Box sx={{ position: 'absolute', top: '30%', right: '15%', width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back */}
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(course ? `/courses/${course.id}` : '/courses')}
            sx={{
              color: 'rgba(255,255,255,0.85)', mb: 4, fontWeight: 500,
              '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', boxShadow: 'none' },
            }}
          >
            {course ? course.title : 'Quay lại'}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Box
              sx={{
                width: 64, height: 64, borderRadius: 3, flexShrink: 0,
                bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <AssignmentRoundedIcon sx={{ color: '#fff', fontSize: 30 }} />
            </Box>

            <Box>
              <Chip
                label={exam.format === 'thpt_2025' ? 'THPT 2025' : 'Tiêu chuẩn'}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.18)', color: '#fff',
                  fontWeight: 700, mb: 1.5, fontSize: '0.75rem',
                  backdropFilter: 'blur(4px)',
                }}
              />
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, color: '#fff', mb: 1, fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.2 }}
              >
                {exam.title}
              </Typography>
              {bestScore !== null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <EmojiEventsRoundedIcon sx={{ color: '#FDE68A', fontSize: 18 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                    Điểm cao nhất của bạn:{' '}
                    <span style={{ color: '#FDE68A', fontWeight: 800, fontSize: '1.1rem' }}>
                      {bestScore.toFixed(2)}/10
                    </span>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stat cards — overlap the hero */}
      <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #FFE0C8',
            boxShadow: '0 8px 32px rgba(255,140,47,0.12)',
          }}
        >
          <Box sx={{ display: 'flex', bgcolor: '#fff' }}>
            {[
              {
                icon: <AccessTimeRoundedIcon sx={{ color: '#FF8C2F', fontSize: 26 }} />,
                label: 'Thời gian làm bài',
                value: `${exam.timeLimit} phút`,
                subValue: null as string | null,
                valueColor: '#FF8C2F',
                smallValue: false,
              },
              {
                icon: <QuizRoundedIcon sx={{ color: '#E67923', fontSize: 26 }} />,
                label: hasTwoParts ? 'Số câu hỏi' : 'Số câu hỏi',
                value: loadingHistory ? '...' : questionCountLabel,
                subValue: null as string | null,
                valueColor: '#E67923',
                smallValue: hasTwoParts,
              },
              {
                icon: <HistoryRoundedIcon sx={{ color: isMaxReached ? '#EF4444' : '#10B981', fontSize: 26 }} />,
                label: 'Số lần đã thi',
                value: loadingHistory ? '...' : `${history.length}/10`,
                subValue: isMaxReached ? 'Đã đạt giới hạn' : null,
                valueColor: isMaxReached ? '#EF4444' : '#10B981',
                smallValue: false,
              },
            ].map((stat, i, arr) => (
              <Box
                key={i}
                sx={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  py: 3, px: 1.5, gap: 0.5,
                  borderRight: i < arr.length - 1 ? '1px solid #FFF0E8' : 'none',
                }}
              >
                {stat.icon}
                <Typography sx={{
                  fontSize: stat.smallValue ? '0.95rem' : '1.35rem',
                  fontWeight: 900, color: stat.valueColor,
                  lineHeight: 1.2, textAlign: 'center',
                  letterSpacing: stat.smallValue ? '-0.01em' : 0,
                }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500, textAlign: 'center' }}>
                  {stat.label}
                </Typography>
                {stat.subValue && (
                  <Typography sx={{ fontSize: '0.68rem', color: stat.valueColor === '#EF4444' ? '#EF4444' : '#CBD5E1', fontWeight: 600, textAlign: 'center', mt: 0.25 }}>
                    {stat.subValue}
                  </Typography>
                )}
              </Box>
            ))}

          </Box>
        </Paper>
      </Container>

      {/* Main content */}
      <Container maxWidth="md" sx={{ py: 5, flexGrow: 1 }}>

        {/* History table */}
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #FFE0C8', overflow: 'hidden', mb: 4 }}>
          <Box
            sx={{
              px: 3, py: 2.5,
              display: 'flex', alignItems: 'center', gap: 1.5,
              borderBottom: '1px solid #FFF0E8',
              bgcolor: '#FFFAF7',
            }}
          >
            <EmojiEventsRoundedIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>
              Lịch sử làm bài
            </Typography>
            {!loadingHistory && history.length > 0 && (
              <Chip
                label={`${history.length} lần`}
                size="small"
                sx={{ ml: 'auto', bgcolor: '#FFF3E8', color: '#FF8C2F', fontWeight: 700, fontSize: '0.75rem' }}
              />
            )}
          </Box>

          {loadingHistory ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, bgcolor: '#fff' }}>
              <CircularProgress size={22} sx={{ color: '#FF8C2F' }} />
              <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>Đang tải lịch sử...</Typography>
            </Box>
          ) : history.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, bgcolor: '#fff' }}>
              <HistoryRoundedIcon sx={{ fontSize: 52, color: '#FFE0C8' }} />
              <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '1rem' }}>
                Bạn chưa làm bài thi này lần nào.
              </Typography>
              <Typography sx={{ color: '#CBD5E1', fontSize: '0.875rem' }}>
                Hãy bắt đầu thi để ghi lại kết quả!
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ bgcolor: '#fff' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FFFAF7' }}>
                    {['Lần thi', 'Thời gian nộp', 'Điểm số', 'Xếp loại'].map(col => (
                      <TableCell
                        key={col}
                        sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748B', borderBottom: '1px solid #FFF0E8', py: 1.75 }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...history].reverse().map((attempt) => {
                    const badge = getScoreBadge(attempt.score);
                    const isBest = bestScore !== null && attempt.score === bestScore;
                    return (
                      <TableRow
                        key={attempt.attemptNumber}
                        sx={{
                          '&:last-child td': { borderBottom: 'none' },
                          bgcolor: isBest ? 'rgba(255,140,47,0.03)' : 'transparent',
                          '&:hover': { bgcolor: '#FFFAF7' },
                          transition: 'background 0.15s',
                        }}
                      >
                        <TableCell sx={{ py: 2, borderColor: '#FFF0E8' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 30, height: 30, borderRadius: '50%',
                                bgcolor: '#FFF3E8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 800, color: '#FF8C2F', flexShrink: 0,
                              }}
                            >
                              {attempt.attemptNumber}
                            </Box>
                            {isBest && (
                              <Chip
                                label="Tốt nhất"
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255,140,47,0.12)', color: '#FF8C2F',
                                  fontWeight: 700, fontSize: '0.65rem', height: 20,
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2, borderColor: '#FFF0E8', color: '#475569', fontSize: '0.875rem' }}>
                          {formatDateTime(attempt.submittedAt)}
                        </TableCell>
                        <TableCell sx={{ py: 2, borderColor: '#FFF0E8' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: getScoreColor(attempt.score) }}>
                            {attempt.score.toFixed(2)}
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>/10</span>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2, borderColor: '#FFF0E8' }}>
                          <Chip
                            label={badge.label}
                            size="small"
                            sx={{ bgcolor: badge.bg, color: badge.color, fontWeight: 700, fontSize: '0.78rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* CTA */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {isMaxReached ? (
            <Box
              sx={{
                bgcolor: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.18)',
                borderRadius: 3, px: 4, py: 3, textAlign: 'center', maxWidth: 480, width: '100%',
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#EF4444', fontSize: '1rem', mb: 0.5 }}>
                Đã đạt giới hạn 10 lần làm bài
              </Typography>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>
                Mỗi tài khoản chỉ được làm tối đa 10 lần. Vui lòng liên hệ hỗ trợ nếu cần thêm lượt.
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: 22 }} />}
              onClick={() => navigate(`/student?examId=${id}`)}
              sx={{
                px: 8, py: 2, borderRadius: 3,
                fontWeight: 800, fontSize: '1.1rem', letterSpacing: 0.3,
                background: 'linear-gradient(135deg, #FF8C2F 0%, #FF6B00 100%)',
                boxShadow: '0 8px 28px rgba(255,140,47,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF9940 0%, #FF7D1A 100%)',
                  boxShadow: '0 12px 36px rgba(255,140,47,0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {history.length === 0 ? 'Bắt đầu thi ngay' : `Thi lại (còn ${MAX_ATTEMPTS - history.length} lần)`}
            </Button>
          )}

          <Divider sx={{ width: '100%', maxWidth: 480, borderColor: '#FFE8D6' }} />
          <Typography sx={{ fontSize: '0.8rem', color: '#CBD5E1', textAlign: 'center' }}>
            Kết quả được ghi lại sau mỗi lần nộp bài. Điểm cao nhất sẽ được tính vào bảng xếp hạng.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default ExamInfoPage;

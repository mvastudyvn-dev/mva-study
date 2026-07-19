import React, { useMemo } from 'react';
import {
  Box, Typography, Button, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Divider,
} from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';

interface StudentExamInfoProps {
  examId: string;
  onStart: () => void;
  onBack: () => void;
}

export interface ExamAttempt {
  attemptNumber: number;
  score: number;
  submittedAt: string;
}

const EXAM_HISTORY_KEY = 'mva_exam_history';

export function getExamHistory(userId: string, examId: string): ExamAttempt[] {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, Record<string, ExamAttempt[]>>;
    return all[userId]?.[examId] || [];
  } catch {
    return [];
  }
}

export function saveExamAttempt(userId: string, examId: string, score: number) {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    const all: Record<string, Record<string, ExamAttempt[]>> = raw ? JSON.parse(raw) : {};
    if (!all[userId]) all[userId] = {};
    if (!all[userId][examId]) all[userId][examId] = [];
    const attempts = all[userId][examId];
    const newAttempt: ExamAttempt = {
      attemptNumber: attempts.length + 1,
      score,
      submittedAt: new Date().toISOString(),
    };
    all[userId][examId] = [...attempts, newAttempt];
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

function getScoreColor(score: number) {
  if (score >= 8) return '#10B981';
  if (score >= 5) return '#F59E0B';
  return '#EF4444';
}

function getScoreBadge(score: number) {
  if (score >= 8) return { label: 'Xuất sắc', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
  if (score >= 6.5) return { label: 'Giỏi', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
  if (score >= 5) return { label: 'Đạt', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
  return { label: 'Chưa đạt', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
}

function formatDateTime(isoString: string) {
  const d = new Date(isoString);
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const StudentExamInfo: React.FC<StudentExamInfoProps> = ({ examId, onStart, onBack }) => {
  const { exams } = useData();
  const { user } = useAuth();

  const exam = useMemo(() => exams.find(e => e.id === examId), [exams, examId]);
  const history = useMemo(() => {
    if (!user) return [];
    return getExamHistory(user.id, examId);
  }, [user, examId]);

  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : null;

  const questionCount =
    exam?.format === 'standard'
      ? exam?.answerKey?.part1?.length || 24
      : (exam?.answerKey?.part1?.length || 24) + 6;

  if (!exam) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Typography color="text.secondary">Không tìm thấy đề thi.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', mt: { xs: 2, md: 4 }, mb: 6, px: { xs: 2, md: 0 } }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={onBack}
        sx={{ mb: 3, color: '#64748B', fontWeight: 500, '&:hover': { bgcolor: 'rgba(100,116,139,0.08)' } }}
      >
        Quay lại
      </Button>

      {/* Header Card */}
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', mb: 3 }}>
        {/* Gradient header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)',
            px: 4, py: 4,
            display: 'flex', alignItems: 'flex-start', gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <AssignmentRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Chip
              label={exam.format === 'thpt_2025' ? 'THPT 2025' : 'Tiêu chuẩn'}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, fontSize: '0.72rem', mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.3, mb: 0.5 }}>
              {exam.title}
            </Typography>
            {bestScore !== null && (
              <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                Điểm cao nhất của bạn:{' '}
                <span style={{ color: '#FCD34D', fontWeight: 700 }}>{bestScore.toFixed(2)}/10</span>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'flex', borderTop: '1px solid #E2E8F0', bgcolor: '#FAFBFF' }}>
          {[
            {
              icon: <AccessTimeRoundedIcon sx={{ color: '#3B82F6', fontSize: 22 }} />,
              label: 'Thời gian làm bài',
              value: `${exam.timeLimit} phút`,
            },
            {
              icon: <QuizRoundedIcon sx={{ color: '#8B5CF6', fontSize: 22 }} />,
              label: 'Số câu hỏi',
              value: `${questionCount} câu`,
            },
            {
              icon: <HistoryRoundedIcon sx={{ color: '#10B981', fontSize: 22 }} />,
              label: 'Số lần đã thi',
              value: `${history.length} lần`,
            },
          ].map((stat, i, arr) => (
            <Box
              key={i}
              sx={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                py: 2.5, px: 1, gap: 0.75,
                borderRight: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none',
              }}
            >
              {stat.icon}
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Exam History */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #E2E8F0', overflow: 'hidden', mb: 3 }}>
        <Box
          sx={{
            px: 3, py: 2.5,
            display: 'flex', alignItems: 'center', gap: 1.5,
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <EmojiEventsRoundedIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
            Lịch sử làm bài
          </Typography>
          {history.length > 0 && (
            <Chip
              label={`${history.length} lần`}
              size="small"
              sx={{ ml: 'auto', bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: '0.75rem' }}
            />
          )}
        </Box>

        {history.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <HistoryRoundedIcon sx={{ fontSize: 42, color: '#E2E8F0' }} />
            <Typography sx={{ color: '#94A3B8', fontWeight: 500 }}>Bạn chưa làm bài thi này lần nào.</Typography>
            <Typography sx={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Hãy bắt đầu thi để ghi lại kết quả!</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  {['Lần thi', 'Thời gian nộp', 'Điểm số', 'Xếp loại'].map(col => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748B', borderBottom: '1px solid #E2E8F0', py: 1.5 }}
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
                        bgcolor: isBest ? 'rgba(16,185,129,0.03)' : 'transparent',
                        '&:hover': { bgcolor: '#F8FAFC' },
                        transition: 'background 0.15s',
                      }}
                    >
                      <TableCell sx={{ py: 1.75, borderColor: '#F1F5F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 28, height: 28, borderRadius: '50%',
                              bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.8rem', fontWeight: 700, color: '#2563EB',
                            }}
                          >
                            {attempt.attemptNumber}
                          </Box>
                          {isBest && (
                            <Chip
                              label="Tốt nhất"
                              size="small"
                              sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.75, borderColor: '#F1F5F9', color: '#475569', fontSize: '0.875rem' }}>
                        {formatDateTime(attempt.submittedAt)}
                      </TableCell>
                      <TableCell sx={{ py: 1.75, borderColor: '#F1F5F9' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: getScoreColor(attempt.score) }}>
                          {attempt.score.toFixed(2)}
                          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94A3B8' }}>/10</span>
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.75, borderColor: '#F1F5F9' }}>
                        <Chip
                          label={badge.label}
                          size="small"
                          sx={{ bgcolor: badge.bg, color: badge.color, fontWeight: 700, fontSize: '0.75rem' }}
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
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowRoundedIcon />}
          onClick={onStart}
          sx={{
            px: 6, py: 1.75, borderRadius: 3,
            fontWeight: 700, fontSize: '1.05rem',
            background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              boxShadow: '0 12px 32px rgba(37,99,235,0.45)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {history.length === 0 ? 'Bắt đầu thi' : 'Thi lại'}
        </Button>
      </Box>

      <Divider sx={{ mt: 4, borderColor: '#F1F5F9' }} />
      <Typography sx={{ mt: 2, textAlign: 'center', fontSize: '0.8rem', color: '#CBD5E1' }}>
        Kết quả được ghi lại sau mỗi lần nộp bài. Điểm cao nhất sẽ được tính vào bảng xếp hạng.
      </Typography>
    </Box>
  );
};

export default StudentExamInfo;

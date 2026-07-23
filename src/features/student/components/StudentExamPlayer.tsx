import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Paper, RadioGroup, FormControlLabel,
  Radio, Tabs, Tab, CircularProgress, Divider, LinearProgress, Tooltip, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, TextField, Snackbar, Alert
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';
import { saveExamAttempt, getExamHistory } from '../../../core/services/examHistory';

interface StudentExamPlayerProps {
  examId: string;
  onExit: () => void;
}

interface ExamAnswers {
  part1: Record<number, string>;
  part2: Record<number, Record<number, boolean>>;
  chosenSubject?: 'CS' | 'IT';
}

export const StudentExamPlayer: React.FC<StudentExamPlayerProps> = ({ examId, onExit }) => {
  const { exams = [], courses = [], markExamCompleted, systemSettings } = useData();
  const { user } = useAuth();
  const exam = exams.find(e => e.id === examId);

  const [timeLeft, setTimeLeft] = useState((exam?.timeLimit || 50) * 60);
  const [timerInitialized, setTimerInitialized] = useState(!!exam);
  const [answers, setAnswers] = useState<ExamAnswers>({ part1: {}, part2: {} });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [attemptCount, setAttemptCount] = useState<number | null>(null);
  const MAX_ATTEMPTS = 10;

  // States cho tính năng Báo lỗi
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState({ reason: '', question: '', details: '' });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  // States cho xác nhận nộp bài
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  useEffect(() => {
    if (exam && !timerInitialized) {
      setTimeLeft((exam.timeLimit || 50) * 60);
      setTimerInitialized(true);
    }
  }, [exam, timerInitialized]);

  useEffect(() => {
    if (!user?.id || !examId) return;
    getExamHistory(user.id, examId).then(h => setAttemptCount(h.length));
  }, [user?.id, examId]);

  const isStandard = exam?.format === 'standard';
  const numPart1Qs = isStandard && Array.isArray(exam?.answerKey?.part1) ? exam.answerKey.part1.length : 24;
  const totalTime = (exam?.timeLimit || 50) * 60;
  const timeProgress = ((totalTime - timeLeft) / totalTime) * 100;
  const answeredCount = Object.keys(answers.part1).length;

  useEffect(() => {
    if (!exam || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, isSubmitted]);

  if (!exam) return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748B' }}>
      <Typography>Đề thi không tồn tại!</Typography>
    </Box>
  );

  // Guard: chặn nếu đã đủ 10 lần
  if (attemptCount !== null && attemptCount >= MAX_ATTEMPTS) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2, px: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, color: '#EF4444' }}>Đã đạt giới hạn 10 lần làm bài</Typography>
      <Typography color="text.secondary" textAlign="center">Mỗi tài khoản chỉ được làm tối đa 10 lần mỗi đề thi.</Typography>
      <Button variant="outlined" onClick={onExit}>Quay lại</Button>
    </Box>
  );

  const handleReportSubmit = async () => {
    if (!reportData.reason || !reportData.question) {
      alert('Vui lòng chọn lý do và câu hỏi báo lỗi.');
      return;
    }
    setReportSubmitting(true);
    try {
      const localSettingsStr = localStorage.getItem('mva_system_settings');
      const localSettings = localSettingsStr ? JSON.parse(localSettingsStr) : {};

      const token = (systemSettings?.telegramBotToken || localSettings?.telegramBotToken || '').trim();
      const chatId = (systemSettings?.telegramChatId || localSettings?.telegramChatId || '').trim();

      if (token && chatId) {
        const course = courses.find((c: any) => c.id === exam?.courseId);
        const courseTitle = course ? course.title : 'Không xác định';

        const message = `🚨 <b>BÁO LỖI ĐỀ THI</b>\n\n` +
                        `👤 <b>Tài khoản:</b> ${user?.name || user?.username || 'Không xác định'}\n` +
                        `📖 <b>Khóa học:</b> ${courseTitle}\n` +
                        `📝 <b>Đề thi:</b> ${exam.title}\n` +
                        `❓ <b>Câu:</b> ${reportData.question}\n` +
                        `⚠️ <b>Lý do:</b> ${reportData.reason}\n` +
                        (reportData.details ? `💬 <b>Chi tiết:</b> ${reportData.details}\n` : '') +
                        `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        });
        const tgData = await res.json();
        if (!tgData.ok) {
          console.error('Lỗi Telegram:', tgData.description);
          alert('Lỗi gửi thông báo Telegram: ' + tgData.description);
        }
      } else {
        alert('Chưa cấu hình Telegram Bot trong phần cài đặt.');
      }
      setSnackOpen(true);
      setReportOpen(false);
      setReportData({ reason: '', question: '', details: '' });
    } catch (error) {
      console.error('Lỗi khi gửi báo lỗi:', error);
      alert('Lỗi mạng khi gọi API Telegram: ' + error);
    } finally {
      setReportSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 300;

  const handlePart1Change = (qIndex: number, value: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, part1: { ...prev.part1, [qIndex]: value } }));
  };

  const handlePart2Change = (qIndex: number, subIndex: number, value: boolean) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      part2: { ...prev.part2, [qIndex]: { ...(prev.part2[qIndex] || {}), [subIndex]: value } }
    }));
  };

  const handleSubmit = (force = false) => {
    if (!force) {
      setConfirmSubmitOpen(true);
      return;
    }
    setConfirmSubmitOpen(false);
    setIsSubmitted(true);
    let p1Score = 0, p2Score = 0, p1Wrong = 0, p2WrongItems = 0;
    const answerKey = exam?.answerKey || { part1: [], part2: [] };
    const wrongAnswers: string[] = [];

    for (let i = 0; i < numPart1Qs; i++) {
      if (answers.part1[i] === answerKey.part1[i]) {
        p1Score += isStandard ? 10 / (numPart1Qs || 1) : 0.25;
      } else {
        p1Wrong++;
        wrongAnswers.push(`P1_Q${i + 1}`);
      }
    }

    if (!isStandard) {
      const gradePart2Question = (qIndex: number) => {
        const studentAns = answers.part2[qIndex] || {};
        const keyAns = answerKey.part2[qIndex] || [];
        let correct = 0;
        for (let j = 0; j < 4; j++) {
          const k = keyAns[j] === 'T';
          if (studentAns[j] === k) correct++;
          else {
            p2WrongItems++;
            wrongAnswers.push(`P2_Q${qIndex + 1}_${['a', 'b', 'c', 'd'][j]}`);
          }
        }
        if (correct === 1) return 0.1;
        if (correct === 2) return 0.25;
        if (correct === 3) return 0.5;
        if (correct === 4) return 1.0;
        return 0;
      };
      p2Score += gradePart2Question(0) + gradePart2Question(1);
      if (answers.chosenSubject === 'CS') {
        p2Score += gradePart2Question(2) + gradePart2Question(3);
      } else if (answers.chosenSubject === 'IT') {
        p2Score += gradePart2Question(4) + gradePart2Question(5);
      }
    }

    const total = isStandard ? p1Score : p1Score + p2Score;
    if (user?.id) {
      markExamCompleted(user.id, exam.id, total);
      saveExamAttempt(user.id, exam.id, total, wrongAnswers);
    }
    setResult({ p1Score, p2Score, total, p1Wrong, p2WrongItems });

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      let feedback = `Chào bạn, bạn đã đạt ${total.toFixed(2)}/10.0 điểm. `;
      if (total >= 8) {
        feedback += 'Thành tích rất xuất sắc! Nền tảng kiến thức của bạn vững vàng ở cả hai phần.';
      } else if (total >= 5) {
        feedback += 'Bạn đã nắm được kiến thức cơ bản. ';
        if (p1Wrong > 10) feedback += 'Tuy nhiên, bạn làm sai khá nhiều ở Phần 1, cần chú ý ôn tập lý thuyết căn bản. ';
        if (p2WrongItems > 4) feedback += 'Ở Phần 2, việc sai nhiều ý lẻ khiến bạn mất điểm oan, hãy đọc kỹ đề hơn nhé.';
      } else {
        feedback += 'Bạn đang hổng khá nhiều kiến thức. Hãy xem lại toàn bộ bài giảng từ đầu, đặc biệt là các phần lý thuyết trọng tâm.';
      }
      setAiFeedback(feedback);
    }, 2500);
  };

  const scoreColor = result
    ? result.total >= 8 ? '#10B981' : result.total >= 5 ? '#F59E0B' : '#EF4444'
    : '#3B82F6';

  // Part 2 Question renderer
  const renderPart2Question = (qIndex: number, label: string) => (
    <Paper
      key={qIndex}
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
      }}
    >
      <Box sx={{ px: 2, py: 1.25, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#334155' }}>
          {label}
        </Typography>
      </Box>
      {['a', 'b', 'c', 'd'].map((item, subIndex) => {
        const isTrue = answers.part2[qIndex]?.[subIndex] === true;
        const isFalse = answers.part2[qIndex]?.[subIndex] === false;
        return (
          <Box
            key={item}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              borderBottom: subIndex < 3 ? '1px solid #F1F5F9' : 'none',
              bgcolor: (() => {
                if (!isSubmitted) return isTrue ? 'rgba(16,185,129,0.04)' : isFalse ? 'rgba(239,68,68,0.04)' : 'transparent';
                
                const keyAns = (exam?.answerKey || { part2: [] }).part2?.[qIndex] || [];
                const correctVal = keyAns[subIndex] === 'T';
                const answeredCorrectly = (isTrue && correctVal) || (isFalse && !correctVal);
                const answeredWrongly = (isTrue && !correctVal) || (isFalse && correctVal);
                
                if (answeredCorrectly) return 'rgba(16,185,129,0.1)';
                if (answeredWrongly) return 'rgba(239,68,68,0.1)';
                return 'transparent';
              })(),
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
              Ý {item}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                size="small"
                variant={isTrue ? 'contained' : 'outlined'}
                onClick={() => handlePart2Change(qIndex, subIndex, true)}
                disabled={isSubmitted}
                sx={{
                  minWidth: 44,
                  height: 30,
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  ...(isTrue
                    ? { bgcolor: '#10B981', borderColor: '#10B981', '&:hover': { bgcolor: '#059669' } }
                    : { borderColor: '#D1FAE5', color: '#10B981', '&:hover': { bgcolor: 'rgba(16,185,129,0.08)', borderColor: '#10B981' } }),
                  boxShadow: 'none',
                }}
              >
                Đ
              </Button>
              <Button
                size="small"
                variant={isFalse ? 'contained' : 'outlined'}
                onClick={() => handlePart2Change(qIndex, subIndex, false)}
                disabled={isSubmitted}
                sx={{
                  minWidth: 44,
                  height: 30,
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  ...(isFalse
                    ? { bgcolor: '#EF4444', borderColor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }
                    : { borderColor: '#FEE2E2', color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', borderColor: '#EF4444' } }),
                  boxShadow: 'none',
                }}
              >
                S
              </Button>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F1F5F9' }}>

      {/* ── Header ── */}
      <Box
        sx={{
          height: 64,
          bgcolor: '#fff',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1.5, sm: 2, md: 3 },
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for header
        }}
      >
        {/* Exam title - hide on mobile to save space for buttons */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.05rem',
            color: '#0F172A',
            letterSpacing: '-0.3px',
            maxWidth: { sm: 200, md: 400 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: { xs: 'none', sm: 'block' },
            mr: 2
          }}
        >
          {exam.title}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5 }, 
            flexShrink: 0, 
            flexWrap: 'nowrap',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
          }}
        >
          {/* Exit button */}
          <Tooltip title="Thoát khỏi bài thi">
            <Button
              variant="outlined"
              onClick={onExit}
              sx={{
                minWidth: { xs: 40, sm: 'auto' },
                px: { xs: 0, sm: 2 },
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderColor: '#E2E8F0',
                color: '#64748B',
                py: 0.75,
                whiteSpace: 'nowrap',
                '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: { xs: 20, sm: 16 }, mr: { xs: 0, sm: 0.5 } }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Thoát</Box>
            </Button>
          </Tooltip>

          {!isSubmitted && (
            /* Timer */
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: { xs: 1.5, sm: 2 },
                py: 0.75,
                borderRadius: '10px',
                bgcolor: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.2)'}`,
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                color: isUrgent ? '#EF4444' : '#2563EB',
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                animation: isUrgent ? 'pulse 1s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }}
            >
              <AccessTimeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              {formatTime(timeLeft)}
            </Box>
          )}

          {!isSubmitted && (
            /* Progress pill */
            <Chip
              label={`${answeredCount}/${numPart1Qs}`}
              size="small"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                bgcolor: 'rgba(16,185,129,0.1)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '8px',
                height: { xs: 24, sm: 28 },
                flexShrink: 0,
              }}
            />
          )}

          {/* Report button - Hỗ trợ báo lỗi cả khi đang làm bài và sau khi nộp bài */}
          <Button
            variant="outlined"
            onClick={() => setReportOpen(true)}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.6, sm: 0.85 },
              whiteSpace: 'nowrap',
              flexShrink: 0,
              borderColor: '#EF4444',
              color: '#EF4444',
              '&:hover': {
                bgcolor: 'rgba(239,68,68,0.08)',
                borderColor: '#DC2626',
              },
            }}
          >
            <ReportProblemRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Báo lỗi</Box>
          </Button>

          {!isSubmitted && (
            /* Submit button */
            <Button
              variant="contained"
              onClick={() => handleSubmit(false)}
              sx={{
                background: 'linear-gradient(135deg, #F97316, #FB923C)',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.6, sm: 0.85 },
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #EA580C, #F97316)',
                  boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
                },
              }}
              onClick={() => setConfirmSubmitOpen(true)}
            >
              <SendRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
              Nộp bài
            </Button>
          )}

        </Box>
      </Box>


      {/* Time progress bar */}
      {!isSubmitted && (
        <LinearProgress
          variant="determinate"
          value={timeProgress}
          sx={{
            height: 3,
            bgcolor: 'rgba(59,130,246,0.1)',
            '& .MuiLinearProgress-bar': {
              background: isUrgent
                ? 'linear-gradient(90deg, #EF4444, #F87171)'
                : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
              transition: 'none',
            },
          }}
        />
      )}

      {/* ── Main Content ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: PDF Viewer */}
        <Box
          sx={{
            width: '60%',
            height: '100%',
            borderRight: '1px solid #E2E8F0',
            bgcolor: '#F8FAFC', // Match the requested light background
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {exam.fileUrl ? (
            <>
              {/* Floating Download Button */}
              <Button
                variant="outlined"
                onClick={() => window.open(exam.fileUrl, '_blank')}
                startIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: '#ffffff',
                  color: '#334155',
                  borderColor: '#E2E8F0',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  zIndex: 10,
                  px: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  '&:hover': {
                    bgcolor: '#F1F5F9',
                    borderColor: '#CBD5E1'
                  }
                }}
              >
                Tải xuống
              </Button>

              <iframe
                src={(() => {
                  const url = exam.fileUrl;
                  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                  if (driveMatch) {
                    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
                  }
                  return url.includes('#') ? url : `${url}#toolbar=0&view=FitH`;
                })()}
                style={
                  exam.fileUrl.includes('drive.google.com')
                    ? {
                        border: 'none',
                        position: 'absolute',
                        top: '-56px', // Crop out Google Drive top toolbar
                        left: '-5%', // Shift left to center the 110% width
                        width: '110%', // Zoom 110%
                        height: 'calc(100% + 60px)', // Compensate for the top crop
                      }
                    : {
                        border: 'none',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent'
                      }
                }
                title="Exam PDF"
                allow="autoplay"
              />
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                color: '#94A3B8',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#CBD5E1' }}>Chưa có link đề thi</Typography>
            </Box>
          )}
        </Box>

        {/* Right: Answer Sheet / Results */}
        <Box sx={{ width: '40%', height: '100%', bgcolor: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* ── RESULT SCREEN ── */}
          {isSubmitted && result && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* Score Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${scoreColor}10 0%, ${scoreColor}05 100%)`,
                  border: `1px solid ${scoreColor}25`,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${scoreColor}25, ${scoreColor}15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {result.total >= 5
                    ? <EmojiEventsRoundedIcon sx={{ fontSize: 36, color: scoreColor }} />
                    : <CheckCircleRoundedIcon sx={{ fontSize: 36, color: scoreColor }} />}
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', color: scoreColor, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {result.total.toFixed(2)}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600, mt: 0.25, mb: 1.5 }}>
                  / 10.00 điểm
                </Typography>

                {!isStandard && (
                  <Box display="flex" gap={1.5} justifyContent="center" flexWrap="wrap">
                    <Chip label={`Phần 1: ${result.p1Score.toFixed(2)}đ`} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(59,130,246,0.1)', color: '#2563EB', borderRadius: '8px' }} />
                    <Chip label={`Phần 2: ${result.p2Score.toFixed(2)}đ`} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(59,130,246,0.1)', color: '#2563EB', borderRadius: '8px' }} />
                  </Box>
                )}
              </Paper>

              {/* AI Feedback */}
              {systemSettings?.aiAnalysisEnabled && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    bgcolor: 'rgba(59,130,246,0.04)',
                    border: '1px solid rgba(59,130,246,0.15)',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <Box
                      sx={{
                        p: 0.75,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                        display: 'flex',
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#1D4ED8', fontSize: '0.9rem' }}>
                      AI Phân tích kết quả
                    </Typography>
                  </Box>

                  {isAnalyzing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1.5 }}>
                      <CircularProgress size={28} sx={{ color: '#2563EB' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                        AI đang phân tích bài làm của bạn...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ color: '#374151', lineHeight: 1.7, fontSize: '0.9rem' }}>
                      {aiFeedback}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Report Error Prompt on Result Screen */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: '14px',
                  bgcolor: 'rgba(239,68,68,0.04)',
                  border: '1px dashed rgba(239,68,68,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexWrap: 'wrap'
                }}
              >
                <Box display="flex" alignItems="center" gap={1.2}>
                  <ReportProblemRoundedIcon sx={{ color: '#EF4444', fontSize: 22 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#991B1B', fontSize: '0.85rem' }}>
                      Phát hiện sai sót trong đề bài hoặc đáp án?
                    </Typography>
                    <Typography sx={{ color: '#7F1D1D', fontSize: '0.75rem' }}>
                      Gửi báo lỗi để ban chuyên môn hỗ trợ và đính chính kịp thời.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setReportOpen(true)}
                  startIcon={<ReportProblemRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: '#EF4444',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(239,68,68,0.25)',
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.6,
                    '&:hover': { bgcolor: '#DC2626' }
                  }}
                >
                  Báo lỗi ngay
                </Button>
              </Paper>

            </Box>
          )}

          {/* ── ANSWER SHEET ── */}
          {(!isSubmitted || exam?.showResultAfterSubmission !== false) && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Tabs for THPT 2025 */}
              {!isStandard && (
                <Box sx={{ borderBottom: '1px solid #F1F5F9', px: 2 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#94A3B8',
                        minHeight: 48,
                        '&.Mui-selected': { color: '#2563EB' },
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                      },
                    }}
                  >
                    <Tab label={`PHẦN I (${numPart1Qs} Câu)`} />
                    <Tab label="PHẦN II (Đúng/Sai)" />
                  </Tabs>
                </Box>
              )}

              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>

                {/* Part 1 */}
                {(activeTab === 0 || isStandard) && (
                  <Box>
                    {!isStandard && (
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
                        Trắc nghiệm nhiều lựa chọn
                      </Typography>
                    )}
                    <Grid container spacing={1.5}>
                      {Array.from({ length: numPart1Qs }).map((_, i) => {
                        const selected = answers.part1[i];
                        const correctOpt = (exam?.answerKey || { part1: [] }).part1?.[i];
                        
                        let borderColor = selected ? '1.5px solid rgba(37,99,235,0.4)' : '1px solid #E2E8F0';
                        let bgColor = selected ? 'rgba(37,99,235,0.03)' : '#FAFAFA';

                        if (isSubmitted) {
                          if (selected === correctOpt) {
                            borderColor = '1.5px solid #10B981';
                            bgColor = 'rgba(16,185,129,0.08)';
                          } else if (selected) {
                            borderColor = '1.5px solid #EF4444';
                            bgColor = 'rgba(239,68,68,0.08)';
                          } else {
                            borderColor = '1px solid #E2E8F0';
                          }
                        }

                        return (
                          <Grid item xs={6} sm={4} key={i}>
                            <Paper
                              elevation={0}
                              sx={{
                                borderRadius: '10px',
                                border: borderColor,
                                bgcolor: bgColor,
                                p: 1.25,
                                transition: 'all 0.15s',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  color: selected ? '#2563EB' : '#64748B',
                                  mb: 0.75,
                                  textAlign: 'center',
                                }}
                              >
                                Câu {i + 1}
                              </Typography>
                              <RadioGroup
                                row
                                value={selected || ''}
                                onChange={(e) => handlePart1Change(i, e.target.value)}
                                sx={{ justifyContent: 'space-around', gap: 0 }}
                              >
                                {['A', 'B', 'C', 'D'].map(opt => {
                                  const isCorrectOpt = isSubmitted && opt === correctOpt;
                                  const isSelectedWrong = isSubmitted && selected === opt && opt !== correctOpt;

                                  return (
                                    <FormControlLabel
                                      key={opt}
                                      value={opt}
                                      control={
                                        <Radio
                                          size="small"
                                          disabled={isSubmitted}
                                          sx={{
                                            p: 0.4,
                                            color: isCorrectOpt ? '#10B981' : '#CBD5E1',
                                            '&.Mui-checked': { 
                                              color: isCorrectOpt ? '#10B981' : isSelectedWrong ? '#EF4444' : '#2563EB' 
                                            },
                                          }}
                                        />
                                      }
                                      label={
                                        <Typography
                                          sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: selected === opt || isCorrectOpt ? 700 : 500,
                                            color: isCorrectOpt 
                                              ? '#10B981' 
                                              : isSelectedWrong 
                                                ? '#EF4444' 
                                                : selected === opt 
                                                  ? '#2563EB' 
                                                  : '#475569',
                                          }}
                                        >
                                          {opt}
                                        </Typography>
                                      }
                                      labelPlacement="bottom"
                                      sx={{ m: 0 }}
                                    />
                                  );
                                })}
                              </RadioGroup>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Part 2 */}
                {activeTab === 1 && !isStandard && (
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
                      A. Phần chung
                    </Typography>
                    {[0, 1].map(qi => renderPart2Question(qi, `Câu ${qi + 1}`))}

                    <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
                      B. Phần riêng — Chọn 1 trong 2
                    </Typography>

                    <Box display="flex" gap={1.5} mb={2.5}>
                      {(['CS', 'IT'] as const).map(sub => (
                        <Button
                          key={sub}
                          fullWidth
                          variant={answers.chosenSubject === sub ? 'contained' : 'outlined'}
                          onClick={() => setAnswers(p => ({ ...p, chosenSubject: sub }))}
                          disabled={isSubmitted}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            py: 1,
                            ...(answers.chosenSubject === sub
                              ? {
                                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                                  boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
                                  '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #2563EB)' },
                                }
                              : {
                                  borderColor: '#E2E8F0',
                                  color: '#64748B',
                                  '&:hover': { borderColor: '#2563EB', color: '#2563EB', bgcolor: 'rgba(59,130,246,0.05)' },
                                }),
                          }}
                        >
                          {sub === 'CS' ? 'Khoa học máy tính' : 'Tin học ứng dụng'}
                        </Button>
                      ))}
                    </Box>

                    {answers.chosenSubject === 'CS' && (
                      <Box>{[2, 3].map(qi => renderPart2Question(qi, `Câu ${qi + 1}`))}</Box>
                    )}
                    {answers.chosenSubject === 'IT' && (
                      <Box>{[4, 5].map(qi => renderPart2Question(qi, `Câu ${qi + 1}`))}</Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Form Báo Lỗi */}
      <Dialog open={reportOpen} onClose={() => !reportSubmitting && setReportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportProblemRoundedIcon sx={{ color: '#EF4444' }} />
          Báo lỗi
        </DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth size="small" sx={{ mb: 2.5, mt: 1 }}>
            <InputLabel>Lý do báo lỗi</InputLabel>
            <Select
              value={reportData.reason}
              onChange={(e) => setReportData(prev => ({ ...prev, reason: e.target.value }))}
              label="Lý do báo lỗi"
            >
              <MenuItem value="Đáp án sai">Đáp án sai</MenuItem>
              <MenuItem value="Đề thiếu nội dung/hình ảnh">Đề thiếu nội dung/hình ảnh</MenuItem>
              <MenuItem value="Đề khó nhìn/bị mờ">Đề khó nhìn/bị mờ</MenuItem>
              <MenuItem value="Lỗi khác">Lỗi khác</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth size="small" label="Câu số mấy?" placeholder="Ví dụ: Câu 5 phần 1" sx={{ mb: 2.5 }}
            value={reportData.question}
            onChange={(e) => setReportData(prev => ({ ...prev, question: e.target.value }))}
          />
          <TextField
            fullWidth size="small" label="Mô tả chi tiết lỗi (Không bắt buộc)" placeholder="Chi tiết lỗi giúp admin fix nhanh hơn..."
            multiline rows={3}
            value={reportData.details}
            onChange={(e) => setReportData(prev => ({ ...prev, details: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#F8FAFC' }}>
          <Button onClick={() => setReportOpen(false)} sx={{ color: '#64748B' }} disabled={reportSubmitting}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={handleReportSubmit}
            disabled={reportSubmitting}
            sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}
          >
            {reportSubmitting ? 'Đang gửi...' : 'Gửi báo lỗi'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
          Cảm ơn bạn! Báo lỗi đã được gửi thành công.
        </Alert>
      </Snackbar>

      {/* Xác nhận nộp bài Modal */}
      <Dialog 
        open={confirmSubmitOpen} 
        onClose={() => setConfirmSubmitOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleRoundedIcon sx={{ color: '#F97316', fontSize: 28 }} />
          Xác nhận nộp bài
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', fontSize: '1.05rem', mt: 1 }}>
            Bạn có chắc chắn muốn nộp bài thi? Kết quả sẽ không thể thay đổi sau khi nộp.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pb: 1, gap: 1 }}>
          <Button onClick={() => setConfirmSubmitOpen(false)} sx={{ color: '#64748B', fontWeight: 600 }}>
            Làm tiếp
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleSubmit(true)}
            sx={{ 
              fontWeight: 700, px: 3, 
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              '&:hover': { background: 'linear-gradient(135deg, #EA580C, #C2410C)' }
            }}
          >
            Nộp bài ngay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

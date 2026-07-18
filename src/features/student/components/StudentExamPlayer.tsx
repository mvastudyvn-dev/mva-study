import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Paper, RadioGroup, FormControlLabel,
  Radio, Tabs, Tab, CircularProgress, Divider, LinearProgress, Tooltip, Chip
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { useData } from '../../../core/contexts/DataContext';
import { useAuth } from '../../../core/contexts/AuthContext';

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
  const { exams = [], markExamCompleted } = useData();
  const { user } = useAuth();
  const exam = exams.find(e => e.id === examId);

  const [timeLeft, setTimeLeft] = useState((exam?.timeLimit || 50) * 60);
  const [answers, setAnswers] = useState<ExamAnswers>({ part1: {}, part2: {} });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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
          handleSubmit();
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

  const handleSubmit = () => {
    setIsSubmitted(true);
    let p1Score = 0, p2Score = 0, p1Wrong = 0, p2WrongItems = 0;
    const answerKey = exam.answerKey || { part1: [], part2: [] };

    for (let i = 0; i < numPart1Qs; i++) {
      if (answers.part1[i] === answerKey.part1[i]) {
        p1Score += isStandard ? 10 / (numPart1Qs || 1) : 0.25;
      } else {
        p1Wrong++;
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
          else p2WrongItems++;
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
    if (user?.id) markExamCompleted(user.id, exam.id, total);
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
              bgcolor: isTrue ? 'rgba(16,185,129,0.04)' : isFalse ? 'rgba(239,68,68,0.04)' : 'transparent',
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
          px: { xs: 2, md: 3 },
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        {/* Exam title */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.05rem',
            color: '#0F172A',
            letterSpacing: '-0.3px',
            maxWidth: { xs: 160, sm: 320, md: 500 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {exam.title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1.5}>
          {/* Exit button */}
          <Tooltip title="Thoát khỏi bài thi">
            <Button
              variant="outlined"
              startIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={onExit}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderColor: '#E2E8F0',
                color: '#64748B',
                py: 0.75,
                '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
              }}
            >
              Thoát
            </Button>
          </Tooltip>

          {!isSubmitted && (
            <>
              {/* Timer */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  borderRadius: '10px',
                  bgcolor: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                  border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.2)'}`,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: isUrgent ? '#EF4444' : '#2563EB',
                  fontVariantNumeric: 'tabular-nums',
                  animation: isUrgent ? 'pulse 1s ease-in-out infinite' : 'none',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                  },
                }}
              >
                <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
                {formatTime(timeLeft)}
              </Box>

              {/* Progress pill */}
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
                  height: 28,
                }}
              />

              {/* Submit button */}
              <Button
                variant="contained"
                startIcon={<SendRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(135deg, #F97316, #FB923C)',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  py: 0.85,
                  boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #EA580C, #F97316)',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
                  },
                }}
              >
                Nộp bài
              </Button>
            </>
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
            bgcolor: '#F8FAFC',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {exam.fileUrl ? (
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                display: 'flex',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <iframe
                src={exam.fileUrl.includes('#') ? exam.fileUrl : `${exam.fileUrl}#toolbar=0&view=FitH`}
                width="100%"
                height="100%"
                style={{ border: 'none', flex: 1, display: 'block', backgroundColor: 'white' }}
                title="Exam PDF"
              />
            </Paper>
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
          {isSubmitted && result ? (
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
                    <Chip label={`Phần 2: ${result.p2Score.toFixed(2)}đ`} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(139,92,246,0.1)', color: '#7C3AED', borderRadius: '8px' }} />
                  </Box>
                )}
              </Paper>

              {/* AI Feedback */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  bgcolor: 'rgba(99,102,241,0.04)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Box
                    sx={{
                      p: 0.75,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                      display: 'flex',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#4338CA', fontSize: '0.9rem' }}>
                    AI Phân tích kết quả
                  </Typography>
                </Box>

                {isAnalyzing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1.5 }}>
                    <CircularProgress size={28} sx={{ color: '#6366F1' }} />
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

              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloseRoundedIcon />}
                onClick={onExit}
                sx={{
                  mt: 2.5,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' },
                }}
              >
                Quay lại danh sách đề thi
              </Button>
            </Box>
          ) : (
            /* ── ANSWER SHEET ── */
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
                        return (
                          <Grid item xs={6} sm={4} key={i}>
                            <Paper
                              elevation={0}
                              sx={{
                                borderRadius: '10px',
                                border: selected
                                  ? '1.5px solid rgba(37,99,235,0.4)'
                                  : '1px solid #E2E8F0',
                                bgcolor: selected ? 'rgba(37,99,235,0.03)' : '#FAFAFA',
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
                                {['A', 'B', 'C', 'D'].map(opt => (
                                  <FormControlLabel
                                    key={opt}
                                    value={opt}
                                    control={
                                      <Radio
                                        size="small"
                                        disabled={isSubmitted}
                                        sx={{
                                          p: 0.4,
                                          color: '#CBD5E1',
                                          '&.Mui-checked': { color: '#2563EB' },
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography
                                        sx={{
                                          fontSize: '0.75rem',
                                          fontWeight: selected === opt ? 700 : 500,
                                          color: selected === opt ? '#2563EB' : '#475569',
                                        }}
                                      >
                                        {opt}
                                      </Typography>
                                    }
                                    labelPlacement="bottom"
                                    sx={{ m: 0 }}
                                  />
                                ))}
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
                                  background: 'linear-gradient(135deg, #7C3AED, #9F67FA)',
                                  boxShadow: '0 3px 10px rgba(124,58,237,0.3)',
                                  '&:hover': { background: 'linear-gradient(135deg, #6D28D9, #7C3AED)' },
                                }
                              : {
                                  borderColor: '#E2E8F0',
                                  color: '#64748B',
                                  '&:hover': { borderColor: '#7C3AED', color: '#7C3AED', bgcolor: 'rgba(124,58,237,0.05)' },
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
    </Box>
  );
};

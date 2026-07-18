import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Paper, RadioGroup, FormControlLabel, Radio, Tabs, Tab, CircularProgress, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useData } from '../../../core/contexts/DataContext';

import { useAuth } from '../../../core/contexts/AuthContext';

interface StudentExamPlayerProps {
  examId: string;
  onExit: () => void;
}

interface ExamAnswers {
  part1: Record<number, string>;
  part2: Record<number, Record<number, boolean>>; // questionIndex -> subItemIndex -> boolean
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
  
  // For THPT 2025 UI Tabs
  const [activeTab, setActiveTab] = useState(0);

  const isStandard = exam?.format === 'standard';
  const numPart1Qs = isStandard && Array.isArray(exam?.answerKey?.part1) ? exam.answerKey.part1.length : 24;

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

  if (!exam) return <Box p={4}>Đề thi không tồn tại!</Box>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePart1Change = (qIndex: number, value: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      part1: { ...prev.part1, [qIndex]: value }
    }));
  };

  const handlePart2Change = (qIndex: number, subIndex: number, value: boolean) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      part2: {
        ...prev.part2,
        [qIndex]: {
          ...(prev.part2[qIndex] || {}),
          [subIndex]: value
        }
      }
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    let p1Score = 0;
    let p2Score = 0;
    let p1Wrong = 0;
    let p2WrongItems = 0;

    const answerKey = exam.answerKey || { part1: [], part2: [] };

    // Part 1 Grading
    for (let i = 0; i < numPart1Qs; i++) {
      if (answers.part1[i] === answerKey.part1[i]) {
        if (isStandard) {
          p1Score += 10 / (numPart1Qs || 1);
        } else {
          p1Score += 0.25;
        }
      } else {
        p1Wrong++;
      }
    }

    if (!isStandard) {
      // Part 2 Grading Helper
      const gradePart2Question = (qIndex: number) => {
        const studentAns = answers.part2[qIndex] || {};
        const keyAns = answerKey.part2[qIndex] || [];
        let correctSubItems = 0;
        for (let j = 0; j < 4; j++) {
          // T = true, F = false
          const k = keyAns[j] === 'T';
          if (studentAns[j] === k) {
            correctSubItems++;
          } else {
            p2WrongItems++;
          }
        }
        if (correctSubItems === 1) return 0.1;
        if (correctSubItems === 2) return 0.25;
        if (correctSubItems === 3) return 0.5;
        if (correctSubItems === 4) return 1.0;
        return 0;
      };

      // Common (0, 1)
      p2Score += gradePart2Question(0);
      p2Score += gradePart2Question(1);

      // Chosen Subject
      if (answers.chosenSubject === 'CS') {
        p2Score += gradePart2Question(2);
        p2Score += gradePart2Question(3);
      } else if (answers.chosenSubject === 'IT') {
        p2Score += gradePart2Question(4);
        p2Score += gradePart2Question(5);
      }
    }

    const total = isStandard ? p1Score : p1Score + p2Score;
    if (user?.id) {
      markExamCompleted(user.id, exam.id, total);
    }
    setResult({ p1Score, p2Score, total, p1Wrong, p2WrongItems });

    // AI Mock Analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      let feedback = `Chào bạn, bạn đã đạt ${total}/10.0 điểm. `;
      if (total >= 8) {
        feedback += "Thành tích rất xuất sắc! Nền tảng kiến thức của bạn vững vàng ở cả hai phần.";
      } else if (total >= 5) {
        feedback += "Bạn đã nắm được kiến thức cơ bản. ";
        if (p1Wrong > 10) feedback += "Tuy nhiên, bạn làm sai khá nhiều ở Phần 1, cần chú ý ôn tập lý thuyết căn bản. ";
        if (p2WrongItems > 4) feedback += "Ở Phần 2, việc sai nhiều ý lẻ khiến bạn mất điểm oan, hãy đọc kỹ đề hơn nhé.";
      } else {
        feedback += "Bạn đang hổng khá nhiều kiến thức. Hãy xem lại toàn bộ bài giảng từ đầu, đặc biệt là các phần lý thuyết trọng tâm.";
      }
      setAiFeedback(feedback);
    }, 2500);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F3F4F6' }}>
      {/* Header */}
      <Box sx={{ height: 60, bgcolor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', px: 3, justifyContent: 'space-between', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
          {exam.title}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button variant="outlined" onClick={onExit} sx={{ borderRadius: 1 }}>Thoát</Button>
          {!isSubmitted && (
            <>
              <Box display="flex" alignItems="center" gap={1} sx={{ color: timeLeft < 300 ? '#EF4444' : '#3B82F6', fontWeight: 700, fontSize: '1.2rem', bgcolor: 'rgba(59, 130, 246, 0.1)', px: 2, py: 0.5, borderRadius: 1 }}>
                <AccessTimeIcon /> {formatTime(timeLeft)}
              </Box>
              <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#FF8C2F', borderRadius: 1, '&:hover': { bgcolor: '#FF6B00' } }}>
                Nộp bài
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content (Split Screen) */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left: Document Viewer */}
        <Box sx={{ width: '60%', height: '100%', borderRight: '1px solid #E5E7EB', bgcolor: '#F1F5F9', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
          {exam.fileUrl ? (
            <Paper elevation={4} sx={{ flex: 1, borderRadius: 1, overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex' }}>
              <iframe 
                src={exam.fileUrl.includes('#') ? exam.fileUrl : `${exam.fileUrl}#toolbar=0&view=FitH`} 
                width="100%" 
                height="100%" 
                style={{ border: 'none', flex: 1, display: 'block', backgroundColor: 'transparent' }} 
                title="Exam PDF" 
              />
            </Paper>
          ) : (
            <Box display="flex" height="100%" alignItems="center" justifyContent="center">
              <Typography color="text.secondary">Chưa có link đề thi.</Typography>
            </Box>
          )}
        </Box>

        {/* Right: Bubble Sheet / Results */}
        <Box sx={{ width: '40%', height: '100%', bgcolor: 'white', overflowY: 'auto' }}>
          
          {isSubmitted && result ? (
            <Box p={4}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1F2937' }}>{result.total.toFixed(2)} / 10.0</Typography>
                <Typography sx={{ color: '#6B7280' }}>
                  {isStandard 
                    ? `Trắc nghiệm: ${result.total.toFixed(2)}đ`
                    : `Phần 1: ${result.p1Score.toFixed(2)}đ | Phần 2: ${result.p2Score.toFixed(2)}đ`}
                </Typography>
              </Box>

              <Paper sx={{ p: 3, borderRadius: 1, bgcolor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#3B82F6', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon /> AI Phân tích điểm yếu
                </Typography>
                {isAnalyzing ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CircularProgress size={30} sx={{ color: '#3B82F6', mb: 2 }} />
                    <Typography color="text.secondary">AI đang phân tích bài làm của bạn...</Typography>
                  </Box>
                ) : (
                  <Typography sx={{ color: '#1F2937', lineHeight: 1.6 }}>
                    {aiFeedback}
                  </Typography>
                )}
              </Paper>
            </Box>
          ) : (
            <Box p={2}>
              {!isStandard && (
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                  <Tab label="PHẦN I (24 Câu)" sx={{ fontWeight: 600 }} />
                  <Tab label="PHẦN II (Đúng/Sai)" sx={{ fontWeight: 600 }} />
                </Tabs>
              )}

              {(activeTab === 0 || isStandard) && (
                <Grid container spacing={2}>
                  {Array.from({ length: numPart1Qs }).map((_, i) => (
                    <Grid item xs={6} sm={4} key={i}>
                      <Box sx={{ p: 1, border: '1px solid #E5E7EB', borderRadius: 1 }}>
                        <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.9rem' }}>Câu {i + 1}</Typography>
                        <RadioGroup row value={answers.part1[i] || ''} onChange={(e) => handlePart1Change(i, e.target.value)} sx={{ justifyContent: 'space-between' }}>
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <FormControlLabel key={opt} value={opt} control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="body2">{opt}</Typography>} labelPlacement="bottom" sx={{ m: 0 }} />
                          ))}
                        </RadioGroup>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === 1 && !isStandard && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1F2937' }}>A. Phần chung (Câu 1, 2)</Typography>
                  {[0, 1].map((qIndex) => (
                    <Paper key={qIndex} sx={{ p: 2, mb: 2, borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>Câu {qIndex + 1}</Typography>
                      {['a', 'b', 'c', 'd'].map((item, subIndex) => (
                        <Box key={item} display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                          <Typography variant="body2">Ý {item}</Typography>
                          <Box display="flex" gap={1}>
                            <Button 
                              size="small" 
                              variant={answers.part2[qIndex]?.[subIndex] === true ? 'contained' : 'outlined'} 
                              color="success"
                              onClick={() => handlePart2Change(qIndex, subIndex, true)}
                              sx={{ minWidth: 40, p: 0.5 }}
                            >Đ</Button>
                            <Button 
                              size="small" 
                              variant={answers.part2[qIndex]?.[subIndex] === false ? 'contained' : 'outlined'} 
                              color="error"
                              onClick={() => handlePart2Change(qIndex, subIndex, false)}
                              sx={{ minWidth: 40, p: 0.5 }}
                            >S</Button>
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  ))}

                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1F2937' }}>B. Phần riêng (Chọn 1 trong 2)</Typography>
                  <Box display="flex" gap={2} mb={2}>
                    <Button 
                      fullWidth 
                      variant={answers.chosenSubject === 'CS' ? 'contained' : 'outlined'}
                      onClick={() => setAnswers(p => ({ ...p, chosenSubject: 'CS' }))}
                      sx={{ borderRadius: 1 }}
                    >
                      Khoa học máy tính
                    </Button>
                    <Button 
                      fullWidth 
                      variant={answers.chosenSubject === 'IT' ? 'contained' : 'outlined'}
                      onClick={() => setAnswers(p => ({ ...p, chosenSubject: 'IT' }))}
                      sx={{ borderRadius: 1 }}
                    >
                      Tin học ứng dụng
                    </Button>
                  </Box>

                  {answers.chosenSubject === 'CS' && (
                    <Box>
                      {[2, 3].map((qIndex) => (
                        <Paper key={qIndex} sx={{ p: 2, mb: 2, borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Câu {qIndex + 1}</Typography>
                          {['a', 'b', 'c', 'd'].map((item, subIndex) => (
                            <Box key={item} display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                              <Typography variant="body2">Ý {item}</Typography>
                              <Box display="flex" gap={1}>
                                <Button size="small" variant={answers.part2[qIndex]?.[subIndex] === true ? 'contained' : 'outlined'} color="success" onClick={() => handlePart2Change(qIndex, subIndex, true)} sx={{ minWidth: 40, p: 0.5 }}>Đ</Button>
                                <Button size="small" variant={answers.part2[qIndex]?.[subIndex] === false ? 'contained' : 'outlined'} color="error" onClick={() => handlePart2Change(qIndex, subIndex, false)} sx={{ minWidth: 40, p: 0.5 }}>S</Button>
                              </Box>
                            </Box>
                          ))}
                        </Paper>
                      ))}
                    </Box>
                  )}

                  {answers.chosenSubject === 'IT' && (
                    <Box>
                      {[4, 5].map((qIndex) => (
                        <Paper key={qIndex} sx={{ p: 2, mb: 2, borderRadius: 1, border: '1px solid #E5E7EB', boxShadow: 'none' }}>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Câu {qIndex + 1}</Typography>
                          {['a', 'b', 'c', 'd'].map((item, subIndex) => (
                            <Box key={item} display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                              <Typography variant="body2">Ý {item}</Typography>
                              <Box display="flex" gap={1}>
                                <Button size="small" variant={answers.part2[qIndex]?.[subIndex] === true ? 'contained' : 'outlined'} color="success" onClick={() => handlePart2Change(qIndex, subIndex, true)} sx={{ minWidth: 40, p: 0.5 }}>Đ</Button>
                                <Button size="small" variant={answers.part2[qIndex]?.[subIndex] === false ? 'contained' : 'outlined'} color="error" onClick={() => handlePart2Change(qIndex, subIndex, false)} sx={{ minWidth: 40, p: 0.5 }}>S</Button>
                              </Box>
                            </Box>
                          ))}
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
};

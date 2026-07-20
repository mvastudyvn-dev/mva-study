import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Grid, CircularProgress,
  Chip, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useData } from '../../../core/contexts/DataContext';
import { getAllAttemptsByExamId, type ExamAttempt } from '../../../core/services/examHistory';

export const AdminExamAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exams, users } = useData();

  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  const exam = exams.find(e => e.id === id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAllAttemptsByExamId(id).then(data => {
        setAttempts(data);
        setLoading(false);
      });
    }
  }, [id]);

  // Map users for easy lookup
  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    users.forEach(u => { map[u.id] = u; });
    return map;
  }, [users]);

  // Aggregate wrong answers
  const chartData = useMemo(() => {
    const wrongCounts: Record<string, number> = {};
    attempts.forEach(attempt => {
      if (attempt.wrongAnswers && Array.isArray(attempt.wrongAnswers)) {
        attempt.wrongAnswers.forEach(q => {
          wrongCounts[q] = (wrongCounts[q] || 0) + 1;
        });
      }
    });

    const data = Object.keys(wrongCounts).map(key => ({
      name: key,
      count: wrongCounts[key]
    }));

    // Sort by most wrong
    return data.sort((a, b) => b.count - a.count).slice(0, 20); // Top 20 wrong questions
  }, [attempts]);

  if (!exam) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">Đề thi không tồn tại</Typography>
      <Button variant="contained" onClick={() => navigate('/admin?tab=exams')} sx={{ mt: 2 }}>
        Quay lại
      </Button>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin?tab=exams')}
          sx={{ color: '#64748B', mr: 2, '&:hover': { bgcolor: '#F1F5F9' } }}
        >
          Quay lại
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B' }}>
          Thống kê & Lịch sử: {exam.title}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#3B82F6' }} />
        </Box>
      ) : attempts.length === 0 ? (
        <Card sx={{ borderRadius: '16px', boxShadow: 'none', border: '1px solid #E2E8F0', p: 5, textAlign: 'center' }}>
          <AssessmentIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Chưa có ai làm bài thi này</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Top wrong questions chart */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WarningIcon sx={{ color: '#EF4444', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Top các câu hỏi sai nhiều nhất
                  </Typography>
                </Box>
                
                {chartData.length > 0 ? (
                  <Box sx={{ height: 350, width: '100%' }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          allowDecimals={false} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748B', fontSize: 12 }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#F8FAFC' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                          dataKey="count" 
                          name="Số lượt làm sai"
                          fill="#EF4444" 
                          radius={[4, 4, 0, 0]} 
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography sx={{ color: '#64748B', textAlign: 'center', py: 5 }}>
                    Không có dữ liệu câu sai.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Attempts Table */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #F1F5F9' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
                    Lịch sử làm bài ({attempts.length} lượt)
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Học viên</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Lần thử</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Điểm số</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Thời gian nộp</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Số câu sai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attempts.map((attempt, idx) => {
                        const user = attempt.userId ? userMap[attempt.userId] : null;
                        const scoreColor = attempt.score >= 8 ? '#10B981' : attempt.score >= 5 ? '#F59E0B' : '#EF4444';
                        
                        return (
                          <TableRow key={idx} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar 
                                  src={user?.avatar} 
                                  sx={{ width: 32, height: 32, bgcolor: '#3B82F6' }}
                                >
                                  {user?.name?.charAt(0) || '?'}
                                </Avatar>
                                <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                  {user?.name || attempt.userId || 'Ẩn danh'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`Lần ${attempt.attemptNumber}`} 
                                size="small" 
                                sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 700, color: scoreColor }}>
                                {attempt.score.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                                {new Date(attempt.submittedAt).toLocaleString('vi-VN')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ color: '#EF4444', fontWeight: 600 }}>
                                {attempt.wrongAnswers ? attempt.wrongAnswers.length : '?'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

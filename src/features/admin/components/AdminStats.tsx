import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, FormControl, Select, MenuItem } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

const growthData = [
  { month: 'T1', students: 45, activations: 30, revenue: 15 },
  { month: 'T2', students: 52, activations: 40, revenue: 20 },
  { month: 'T3', students: 90, activations: 75, revenue: 37 },
  { month: 'T4', students: 120, activations: 110, revenue: 55 },
  { month: 'T5', students: 175, activations: 150, revenue: 75 },
  { month: 'T6', students: 230, activations: 210, revenue: 105 },
];

const thptChoicesData = [
  { name: 'Khoa học máy tính (CS)', value: 65 },
  { name: 'Tin học ứng dụng (IT)', value: 35 },
];
const COLORS = ['#FF8C2F', '#3B82F6'];

const scoreDistribution = [
  { range: '0-4 đ', count: 12 },
  { range: '4-6 đ', count: 45 },
  { range: '6-8 đ', count: 85 },
  { range: '8-10 đ', count: 32 },
];

const CustomTooltipStyle = {
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  fontFamily: '"Inter", sans-serif',
  fontSize: '0.8rem',
};

export const AdminStats: React.FC = () => {
  const [period, setPeriod] = useState('6months');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.8,
            px: 1.8, py: 0.6,
            bgcolor: 'rgba(255,140,47,0.08)', borderRadius: '999px',
            border: '1px solid rgba(255,140,47,0.15)', mb: 1,
          }}>
            <BarChartRoundedIcon sx={{ fontSize: 13, color: '#FF8C2F' }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#FF8C2F', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Báo cáo
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Thống kê & Báo cáo
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{
              borderRadius: '12px',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.08)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,140,47,0.4)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF8C2F' },
            }}
          >
            <MenuItem value="1month">Tháng này</MenuItem>
            <MenuItem value="3months">3 tháng gần nhất</MenuItem>
            <MenuItem value="6months">6 tháng gần nhất</MenuItem>
            <MenuItem value="1year">Năm nay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem' }}>
                Tăng trưởng Học viên & Kích hoạt
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, fontSize: '0.8rem' }}>
                Số liệu trong 6 tháng qua
              </Typography>
              <Box sx={{ width: '100%', height: 340 }}>
                <ResponsiveContainer>
                  <LineChart data={growthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} />
                    <RechartsTooltip contentStyle={CustomTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontFamily: 'Inter', fontSize: '0.8rem' }} />
                    <Line type="monotone" name="Học viên mới" dataKey="students" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Mã kích hoạt" dataKey="activations" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Doanh thu (Tr VNĐ)" dataKey="revenue" stroke="#FF8C2F" strokeWidth={2.5} dot={{ r: 4, fill: '#FF8C2F' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
          }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem' }}>
                Định hướng phần thi riêng
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, fontSize: '0.8rem' }}>
                Tỷ lệ học viên chọn CS vs IT
              </Typography>
              <Box sx={{ flex: 1, minHeight: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={thptChoicesData}
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {thptChoicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={CustomTooltipStyle}
                      formatter={(value: number) => [`${value}%`, 'Tỷ lệ']}
                    />
                    <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontFamily: 'Inter', fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
            '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#0F172A', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1rem' }}>
                Phổ điểm thi thử THPT Quốc Gia
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, fontSize: '0.8rem' }}>
                Phân bố điểm số của toàn bộ học viên
              </Typography>
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={scoreDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }} />
                    <RechartsTooltip contentStyle={CustomTooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                    <Bar dataKey="count" name="Số bài làm" fill="#FF8C2F" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

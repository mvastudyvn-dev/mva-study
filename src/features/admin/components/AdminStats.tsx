import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

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
const COLORS = ['#4F46E5', '#10B981'];

const scoreDistribution = [
  { range: '0-4 đ', count: 12 },
  { range: '4-6 đ', count: 45 },
  { range: '6-8 đ', count: 85 },
  { range: '8-10 đ', count: 32 },
];

export const AdminStats: React.FC = () => {
  const [period, setPeriod] = useState('6months');

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm="auto">
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', lineHeight: 1.5 }}>
            Thống kê & Báo cáo
          </Typography>
        </Grid>
        <Grid item xs={12} sm="auto">
          <FormControl size="small" sx={{ minWidth: 150, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Thời gian</InputLabel>
            <Select value={period} label="Thời gian" onChange={(e) => setPeriod(e.target.value)}>
              <MenuItem value="1month">Tháng này</MenuItem>
              <MenuItem value="3months">3 tháng gần nhất</MenuItem>
              <MenuItem value="6months">6 tháng gần nhất</MenuItem>
              <MenuItem value="1year">Năm nay</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Biểu đồ Doanh thu & Kích hoạt */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                Tăng trưởng Học viên & Kích hoạt khóa học
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Số lượng học viên đăng ký mới và mã kích hoạt được sử dụng trong 6 tháng qua.
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 1, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" />
                    <Line type="monotone" name="Học viên mới" dataKey="students" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Mã kích hoạt" dataKey="activations" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" name="Doanh thu (Tr VNĐ)" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Định hướng THPT 2025 */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                Định hướng phần thi riêng
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tỷ lệ học viên chọn định hướng CS vs IT trong các bài thi thử THPT 2025.
              </Typography>
              <Box sx={{ flex: 1, minHeight: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={thptChoicesData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {thptChoicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 1, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Tỷ lệ']}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Phân bố điểm */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#374151' }}>
                Phổ điểm thi thử THPT Quốc Gia
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Phân bố điểm số của toàn bộ học viên làm bài trên hệ thống.
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={scoreDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 1, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#F3F4F6' }}
                    />
                    <Bar dataKey="count" name="Số bài làm" fill="#6366F1" radius={[6, 6, 0, 0]} />
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

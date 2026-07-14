import React from 'react';
import {
  Box, Typography, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useData } from '../../../core/contexts/DataContext';

const rankColors: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export const TopStudentsTable: React.FC = () => {
  const { topStudents } = useData();

  return (
    <Card sx={{ borderRadius: 1, border: '1px solid #F3F4F6', boxShadow: 'none' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2.5}>
          <EmojiEventsIcon sx={{ color: '#FF8C2F', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem' }}>
            Top học viên
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6', width: 40 }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>
                  Học viên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>
                  Điểm
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>
                  Khóa học
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#6B7280', borderBottom: '2px solid #F3F4F6' }}>
                  Phiên giờ học
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topStudents.map((student) => (
                <TableRow
                  key={student.rank}
                  sx={{
                    '&:hover': { bgcolor: '#FAFAFA' },
                    '& td': { borderBottom: '1px solid #F3F4F6' },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: rankColors[student.rank] || '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: student.rank <= 3 ? '#fff' : '#6B7280' }}>
                        {student.rank}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: '#FF8C2F',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {student.name.split(' ').pop()?.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1F2937' }}>
                        {student.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#FF8C2F' }}>
                    {student.points.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {student.coursesCount}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {student.studyHours}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

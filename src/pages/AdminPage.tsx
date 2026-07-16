import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import {
  AdminSidebar, AdminOverview, AdminStudentChart, AdminTestResults,
  ActivationCodesTable, TopStudentsTable, AdminCourses, AdminLessons, AdminExams,
  AdminStudents, AdminStats, AdminSettings, AdminDocuments, AdminOrders, AdminTuition
} from '../features/admin';

const AdminPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tabId: string) => {
    setSearchParams(prev => {
      prev.set('tab', tabId);
      return prev;
    }, { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <AdminOverview />
            {/* Charts Row */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <AdminStudentChart />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <AdminTestResults />
              </Grid>
            </Grid>

            {/* Tables Row */}
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <ActivationCodesTable />
              </Grid>
              <Grid size={{ xs: 12, lg: 5 }}>
                <TopStudentsTable />
              </Grid>
            </Grid>
          </>
        );
      case 'courses':
        return <AdminCourses />;
      case 'videos':
        return <AdminLessons />;
      case 'exams':
        return <AdminExams />;
      case 'codes':
        return <ActivationCodesTable />;
      case 'students':
        return <AdminStudents />;
      case 'documents':
        return <AdminDocuments />;
      case 'stats':
        return <AdminStats />;
      case 'settings':
        return <AdminSettings />;
      case 'orders':
        return <AdminOrders />;
      case 'tuition':
        return <AdminTuition />;
      default:
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Tính năng đang được phát triển...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F3F4F6' }}>
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminPage;

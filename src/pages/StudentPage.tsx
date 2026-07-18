import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import {
  StudentSidebar, StudentOverview, StudentCourses, StudentNotifications, StudentDocuments, StudentSettings, StudentTuition
} from '../features/student';

const StudentPage: React.FC = () => {
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
            <StudentOverview />
            <StudentCourses />
          </>
        );
      case 'courses':
        return <StudentCourses />;
      case 'documents':
        return <StudentDocuments />;
      case 'notifications':
        return <StudentNotifications />;
      case 'tuition':
        return <StudentTuition />;
      case 'settings':
        return <StudentSettings />;
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFF8F2' }}>
      <StudentSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {renderContent()}
        </Box>

        {/* Notifications Panel */}
        <Box
          sx={{
            width: 300,
            p: 2,
            display: { xs: 'none', lg: 'block' },
            flexShrink: 0,
          }}
        >
          <StudentNotifications />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentPage;

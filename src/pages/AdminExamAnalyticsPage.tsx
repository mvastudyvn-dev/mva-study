import React from 'react';
import { Box } from '@mui/material';
import { AdminSidebar } from '../features/admin';
import { AdminExamAnalytics } from '../features/admin/components/AdminExamAnalytics';
import { useNavigate } from 'react-router-dom';

const AdminExamAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    navigate(`/admin?tab=${tabId}`);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F3F4F6' }}>
      {/* We pass 'exams' so the sidebar highlights the Exams tab */}
      <AdminSidebar activeTab={'exams'} onTabChange={handleTabChange} />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <AdminExamAnalytics />
      </Box>
    </Box>
  );
};

export default AdminExamAnalyticsPage;

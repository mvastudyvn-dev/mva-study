import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const nav = useNavigate();
  return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><Typography variant="h1">404</Typography><Button onClick={() => nav('/')}>Về trang chủ</Button></Box>;
};
export default NotFoundPage;

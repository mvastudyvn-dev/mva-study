import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './core/theme';
import { AuthProvider } from './core/contexts/AuthContext';
import { DataProvider } from './core/contexts/DataContext';
import { RouteGuard } from './core/components/RouteGuard';
import { ScrollToTop } from './core/components/ScrollToTop';

import LandingPage from './pages/LandingPage';
import StudentPage from './pages/StudentPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import CheckDHPage from './pages/CheckDHPage';

import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentResultPage from './pages/PaymentResultPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<RouteGuard allowedRoles={['guest', 'student', 'admin']}><LandingPage /></RouteGuard>} />
            <Route path="/login" element={<RouteGuard allowedRoles={['guest']}><LoginPage /></RouteGuard>} />
            <Route path="/register" element={<RouteGuard allowedRoles={['guest']}><RegisterPage /></RouteGuard>} />
            <Route path="/uni" element={<CheckDHPage />} />
            <Route path="/courses" element={<RouteGuard allowedRoles={['guest', 'student', 'admin']}><CoursesPage /></RouteGuard>} />
            <Route path="/student" element={<RouteGuard allowedRoles={['student']}><StudentPage /></RouteGuard>} />
            <Route path="/admin" element={<RouteGuard allowedRoles={['admin']}><AdminPage /></RouteGuard>} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
);
export default App;

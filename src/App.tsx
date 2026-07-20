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

import CourseDetailsPage from './pages/CourseDetailsPage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentResultPage from './pages/PaymentResultPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PaymentPolicyPage from './pages/PaymentPolicyPage';
import ExamInfoPage from './pages/ExamInfoPage';
import AdminExamAnalyticsPage from './pages/AdminExamAnalyticsPage';

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<RouteGuard allowedRoles={['guest', 'student', 'admin']}><LandingPage /></RouteGuard>} />
            <Route path="/login" element={<RouteGuard allowedRoles={['guest']} ignoreMaintenance><LoginPage /></RouteGuard>} />
            <Route path="/register" element={<RouteGuard allowedRoles={['guest']}><RegisterPage /></RouteGuard>} />
            <Route path="/uni" element={<CheckDHPage />} />
            <Route path="/courses" element={<RouteGuard allowedRoles={['guest', 'student', 'admin']}><CoursesPage /></RouteGuard>} />
            <Route path="/courses/:id" element={<RouteGuard allowedRoles={['guest', 'student', 'admin']}><CourseDetailsPage /></RouteGuard>} />
            <Route path="/student" element={<RouteGuard allowedRoles={['student']}><StudentPage /></RouteGuard>} />
            <Route path="/exam/:id" element={<RouteGuard allowedRoles={['student']}><ExamInfoPage /></RouteGuard>} />
            <Route path="/admin" element={<RouteGuard allowedRoles={['admin']}><AdminPage /></RouteGuard>} />
            <Route path="/admin/exams/:id/analytics" element={<RouteGuard allowedRoles={['admin']}><AdminExamAnalyticsPage /></RouteGuard>} />
            <Route path="/payment-result" element={<PaymentResultPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/payment-policy" element={<PaymentPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </ThemeProvider>
);
export default App;

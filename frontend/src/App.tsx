import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MedicalDataProvider } from './contexts/MedicalDataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './components/ThemeProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import { Toaster } from 'sonner';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Sandbox from './pages/Sandbox';
import Patients from './pages/Patients';
import Upload from './pages/Upload';
import ScanHistory from './pages/History';
import AdvancedDiagnosis from './pages/AdvancedDiagnosis';
import Explainability from './pages/Explainability';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SymptomChecker from './pages/SymptomChecker';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MedicalDataProvider>
          <NotificationProvider>
            <ThemeProvider defaultTheme="light" storageKey="medvision-theme">
              <BackgroundAnimation />
              <div className="min-h-screen bg-transparent text-foreground flex flex-col">
              <Toaster position="bottom-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/demo" element={<Sandbox />} />
                
                <Route path="/" element={<Index />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/explainability" element={<ProtectedRoute><Explainability /></ProtectedRoute>} />
                <Route path="/explainability/:scanId" element={<ProtectedRoute><Explainability /></ProtectedRoute>} />
                <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
                <Route path="/advanced-diagnosis" element={<ProtectedRoute><AdvancedDiagnosis /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><ScanHistory /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/reports/:scanId" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              </div>
            </ThemeProvider>
          </NotificationProvider>
        </MedicalDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

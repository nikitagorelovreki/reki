import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import { useAuthenticatedAPI } from './hooks/useAuthenticatedAPI';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DevicesPage from './pages/Devices/DevicesPage';
import ClientsPage from './pages/Clients/ClientsPage';
import FormsPage from './pages/Forms/FormsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import './App.css';

const AppContent: React.FC = () => {
  useAuthenticatedAPI();
  
  return (
    <Router>
      <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/devices' element={
              <ProtectedRoute>
                <MainLayout>
                  <DevicesPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/clients' element={
              <ProtectedRoute>
                <MainLayout>
                  <ClientsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/forms' element={
              <ProtectedRoute>
                <MainLayout>
                  <FormsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/forms/client/:clientId' element={
              <ProtectedRoute>
                <MainLayout>
                  <FormsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path='/settings' element={
              <ProtectedRoute requiredRoles={['ADMIN']}>
                <MainLayout>
                  <div>Settings Page (Coming Soon)</div>
                </MainLayout>
              </ProtectedRoute>
            } />
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import MainLayout from './components/Layout/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DevicesPage from './pages/Devices/DevicesPage';
import ClientsPage from './pages/Clients/ClientsPage';
import FormsPage from './pages/Forms/FormsPage';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          } />
          <Route path="/devices" element={
            <MainLayout>
              <DevicesPage />
            </MainLayout>
          } />
          <Route path="/clients" element={
            <MainLayout>
              <ClientsPage />
            </MainLayout>
          } />
          <Route path="/forms" element={
            <MainLayout>
              <FormsPage />
            </MainLayout>
          } />
          <Route path="/forms/client/:clientId" element={
            <MainLayout>
              <FormsPage />
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <div>Settings Page (Coming Soon)</div>
            </MainLayout>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
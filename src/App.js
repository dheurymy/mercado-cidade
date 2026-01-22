

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import ShoppingListPage from './pages/ShoppingListPage';
import RoteiroPage from './pages/RoteiroPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEditFeirantePage from './pages/AdminEditFeirantePage';
import AdminLoginPage from './pages/AdminLoginPage';
import FeirantePanelPage from './pages/FeirantePanelPage';
import FeiranteAreaPage from './pages/FeiranteAreaPage';





function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial: Catálogo */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />

        {/* Área do Feirante/Admin */}
        <Route path="/feirante-area" element={<FeiranteAreaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/feirante/:feiranteId" element={<AdminEditFeirantePage />} />
        <Route path="/feirante" element={<FeirantePanelPage />} />

        {/* Página de roteiro */}
        <Route path="/roteiro" element={<RoteiroPage />} />

        {/* Redirecionamento padrão para catálogo */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

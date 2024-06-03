import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/auth/login/LoginPage';
import { useAuth } from './provider/AuthProvider';
import RequireAuth from './components/RequireAuth';
import runDefaultApi from './api/default';
import HomeComponent from './views/Home/HomeComponent';
import './App.css';


export default function App() {
  const { isAuth, logout } = useAuth();
  runDefaultApi({ logout });
  return (
    <Routes>
      <Route path="/*" element={isAuth ? <HomeComponent /> : <Navigate to="/login" />} />
      <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" />} />
      <Route element={<RequireAuth />}>
        <Route path="/protected" element={<ProtectedPage />} />
      </Route>
    </Routes>
  );
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

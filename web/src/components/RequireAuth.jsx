import React from 'react';
import { useAuth } from '../provider/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
  const auth = useAuth();
  return auth.isAuth ? <Outlet /> : <Navigate to="/" />;
}
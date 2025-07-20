import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedLayoutProps {
  user: { username: string } | null;
}

const ProtectedLayout = ({ user }: ProtectedLayoutProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
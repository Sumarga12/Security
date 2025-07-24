
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <main className="flex items-center justify-center min-h-screen dark-theme-bg">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
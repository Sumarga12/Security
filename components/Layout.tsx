
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FFF7]">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/admin/site-builder') || location.pathname.startsWith('/community');

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Header />}
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/admin/site-builder');

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideChrome && <Header />}
      <main className="pt-20">
        {children || <Outlet />}
      </main>
    </div>
  );
};

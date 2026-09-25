import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="app-container">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

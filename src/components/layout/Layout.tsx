
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import HeaderAction from '../messaging/HeaderAction';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <HeaderAction />
      </Header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

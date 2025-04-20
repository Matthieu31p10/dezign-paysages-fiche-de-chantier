
import { Outlet } from 'react-router-dom';
import Header from './Header';
import HeaderAction from '../messaging/HeaderAction';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <div id="header-action-container">
          <HeaderAction />
        </div>
      </Header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

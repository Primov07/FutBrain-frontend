import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../styles/admin.css';
import { useAuth } from '../auth/AuthContext';
import { BASE_URL } from '../pages';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarActive, setIsSidebarActive] = React.useState(false);

  const closeSidebar = () => setIsSidebarActive(false);

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-body">
      <div className="admin-wrapper">
        <aside className={`admin-sidebar ${isSidebarActive ? 'sidebar-active' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo-container">
              <img src="/img/logo.png" alt="FutBrain лого" />
              <span>Админ панел</span>
            </div>
            <button className="sidebar-close" onClick={closeSidebar}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <Link to="/admin" className={isActive('/admin')} onClick={closeSidebar}>
                  <i className="fas fa-chart-line"></i> Табло
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className={isActive('/admin/users')} onClick={closeSidebar}>
                  <i className="fas fa-users"></i> Потребители
                </Link>
              </li>
              <li>
                <Link to="/admin/posts" className={isActive('/admin/posts')} onClick={closeSidebar}>
                  <i className="fas fa-file-alt"></i> Публикации
                </Link>
              </li>
              <li>
                <Link to="/admin/players" className={isActive('/admin/players')} onClick={closeSidebar}>
                  <i className="fas fa-running"></i> Играчи
                </Link>
              </li>
              <li>
                <Link to="/admin/accessories" className={isActive('/admin/accessories')} onClick={closeSidebar}>
                  <i className="fas fa-store"></i> Аксесоари
                </Link>
              </li>
              <li>
                <Link to="/admin/game" className={isActive('/admin/game')} onClick={closeSidebar}>
                  <i className="fas fa-trophy"></i> Управление на играта
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className={isActive('/admin/reports')} onClick={closeSidebar}>
                  <i className="fas fa-exclamation-circle"></i> Доклади
                </Link>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <Link to="/" onClick={closeSidebar}><i className="fas fa-sign-out-alt"></i> Към сайта</Link>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div className="header-left">
              <button className="sidebar-toggle" onClick={() => setIsSidebarActive(true)}>
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className="admin-profile">
              <span className="desktop-only">Добре дошли, <strong>{ user?.username}</strong></span>
              <img src={user?.pictureURL?.startsWith('http') ? user.pictureURL : `${BASE_URL}/user.png`} alt="Админ" className="admin-avatar" />
            </div>
          </header>

          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
      {isSidebarActive && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default AdminLayout;

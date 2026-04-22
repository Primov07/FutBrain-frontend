import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import '../styles/admin.css';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-body">
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <img src="/img/logo.png" alt="FutBrain лого" />
            <span>Админ панел</span>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-chart-line"></i> Табло
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-users"></i> Потребители
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/posts" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-file-alt"></i> Публикации
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/players" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-running"></i> Играчи
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/comments" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-comments"></i> Коментари
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/replies" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-reply-all"></i> Отговори
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/accessories" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i className="fas fa-store"></i> Аксесоари
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <Link to="/"><i className="fas fa-sign-out-alt"></i> Към сайта</Link>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div className="header-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Търси данни..." />
            </div>
            <div className="admin-profile">
              <span>Добре дошли, <strong>администратор</strong></span>
              <img src="/img/logo.png" alt="Админ" className="admin-avatar" />
            </div>
          </header>

          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

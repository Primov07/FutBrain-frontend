import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/user.css';

const UserLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        credentials: "include",
      });
      setUser(null);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Грешка при излизане:", error);
    }
  };

  return (
    <div className="user-body">
      <header>
        <div className="nav-container">
          <Link id="home" to="/">
            <img id="logo" src="/img/logo.png" alt="FutBrain лого" />
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/posts" className={location.pathname === '/posts' ? 'active' : ''}>
                  Публикации
                </Link>
              </li>
              <li>
                <Link to="/game" className={location.pathname === '/game' ? 'active' : ''}>
                  Игра
                </Link>
              </li>
              <li>
                <Link to="/store" className={location.pathname === '/store' ? 'active' : ''}>
                  Магазин
                </Link>
              </li>
              <li>
                <Link to="/rankings" className={location.pathname === '/rankings' ? 'active' : ''}>
                  Класации
                </Link>
              </li>
              <li>
                <Link to="/contacts" className={location.pathname === '/contacts' ? 'active' : ''}>
                  Контакти
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link to="/admin" className="admin-link-highlight">
                    Админ Панел
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="auth-buttons">
            {user ? (
              <div className="user-menu-container">
                <div 
                  className="user-info-header" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img 
                    src={user.pictureURL.startsWith('http') ? user.pictureURL : `${import.meta.env.VITE_API_URL}${user.pictureURL.replace('..', '')}`} 
                    alt={user.username} 
                    className="user-avatar-header" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/logo.png';
                    }}
                  />
                  <div className="user-details-header">
                    <span className="username-header">{user.username}</span>
                    <span className="user-role-header">
                      {user.isAdmin ? 'Администратор' : 'Потребител'}
                    </span>
                  </div>
                </div>
                
                {isMenuOpen && (
                  <div className="user-dropdown-menu">
                    <Link to={`/profile/${user.username}`} onClick={() => setIsMenuOpen(false)}>Преглед на профила</Link>
                    <button onClick={handleLogout} className="btn-logout-dropdown">Изход</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-login">Вход</Link>
                <Link to="/register" className="btn-register">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/img/logo.png" alt="FutBrain лого" />
            <p>Твоята футболна общност.</p>
          </div>
          <div className="footer-links">
            <h4>Бързи връзки</h4>
            <ul>
              <li><Link to="/">Начало</Link></li>
              <li><Link to="/posts">Публикации</Link></li>
              <li><Link to="/game">Игра</Link></li>
              <li><Link to="/rankings">Класации</Link></li>
            </ul>
          </div>
          <div className="footer-about">
            <h4>За нас</h4>
            <p>Обсъждай любимите си отбори и играчи и участвай в седмичните ни игри за награди.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 FutBrain. Всички права запазени.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;

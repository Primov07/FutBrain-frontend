import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/user.css';
import { BASE_URL } from '../pages';

const UserLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      //@ts-ignore
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        credentials: "include",
      });
      
      setUser(null);
      setIsMenuOpen(false);
      setIsMobileNavOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Грешка при излизане:", error);
    }
  };

  return (
    <div className="user-body">
      <header>
        <div className="nav-container">
          <Link id="home" to="/" onClick={() => setIsMobileNavOpen(false)}>
            <img id="logo" src="img/logo.png" alt="FutBrain лого" />
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isMobileNavOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <nav className={isMobileNavOpen ? 'nav-active' : ''}>
            <ul className="nav-links">
              <li>
                <Link to="/posts" className={location.pathname === '/posts' ? 'active' : ''} onClick={() => setIsMobileNavOpen(false)}>
                  Публикации
                </Link>
              </li>
              <li>
                <Link to="/game" className={location.pathname === '/game' ? 'active' : ''} onClick={() => setIsMobileNavOpen(false)}>
                  Игра
                </Link>
              </li>
              <li>
                <Link to="/store" className={location.pathname === '/store' ? 'active' : ''} onClick={() => setIsMobileNavOpen(false)}>
                  Магазин
                </Link>
              </li>
              <li>
                <Link to="/rankings" className={location.pathname === '/rankings' ? 'active' : ''} onClick={() => setIsMobileNavOpen(false)}>
                  Класации
                </Link>
              </li>
              <li>
                <Link to="/contacts" className={location.pathname === '/contacts' ? 'active' : ''} onClick={() => setIsMobileNavOpen(false)}>
                  Контакти
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link to="/admin" className="admin-link-highlight" onClick={() => setIsMobileNavOpen(false)}>
                    Админ Панел
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className={`auth-buttons ${isMobileNavOpen ? 'nav-active' : ''}`}>
            {user ? (
              <div className="user-menu-container">
                <div 
                  className="user-info-header" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img 
                    src={`${BASE_URL}${user.pictureURL}`} 
                    alt={user.username} 
                    className="user-avatar-header" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'img/logo.png';
                    }}
                  />
                  <div className="user-details-header">
                    <span className="username-header">{user.username}</span>
                    <div className="user-meta-header">
                      <span className="user-role-header">
                        {user.isAdmin ? 'Администратор' : 'Потребител'}
                      </span>
                      <span className="user-coins-header">
                        <i className="fas fa-coins"></i> {user.futcoins} FC
                      </span>
                    </div>
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
            <img src="img/logo.png" alt="FutBrain лого" />
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

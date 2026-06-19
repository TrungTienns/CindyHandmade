import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLottie } from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '../../common/path';
import { SlUser } from 'react-icons/sl';
import catLoading from '../../assets/animations/catLoading.json';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import './Header.scss';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = React.useRef(0);
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  const lottieOptions = {
    animationData: catLoading,
    loop: true,
  };
  const { View: CatAnimation } = useLottie(lottieOptions);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setIsHidden(true);
          } else {
            setIsHidden(false);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    localStorage.setItem('appLanguage', lng);
  };

  return (
    <header className={`header ${isHidden ? 'header-hidden' : ''}`}>
      <div className="header-container">
        <div className="logo-section">
          <Link to={PATHS.HOME} className="logo-text">
            <span className="hidden md:inline">Cindy Handmade</span>
            <span className="inline md:hidden">Cindy</span>
          </Link>
        </div>
        <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            {[
              { key: 'home', path: PATHS.HOME },
              { key: 'shop', path: PATHS.SHOP },
              { key: 'about', path: PATHS.ABOUT },
              { key: 'contact', path: PATHS.CONTACT },
            ].map(item => (
              <li key={item.key}>
                <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  {t(`header.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="actions">
          <div className="lang-switcher">
            <button
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <span>|</span>
            <button
              className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`}
              onClick={() => changeLanguage('fr')}
            >
              FR
            </button>
          </div>
          <button className="btn-cart" onClick={() => navigate(PATHS.CART)}>
            Cart ({cartCount})
          </button>

          <div className="hidden md:flex w-20 h-20 ml-2 items-center justify-center">
            {CatAnimation}
          </div>

          <div className="user-menu-container ml-2">
            <button
              className="btn-user"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <SlUser size={24} strokeWidth={20} />
            </button>

            {isUserDropdownOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="dropdown-item" style={{ fontWeight: 'bold' }}>
                      Xin chào, {user.username}
                    </div>
                    {user.role === 'admin' && (
                      <Link to={PATHS.ADMIN} className="dropdown-item">
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      className="dropdown-item"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        logout();
                        navigate(PATHS.HOME);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={PATHS.LOGIN} className="dropdown-item">
                      {t('header.login', 'Đăng nhập')}
                    </Link>
                    <Link to={PATHS.LOGIN} className="dropdown-item">
                      {t('header.register', 'Đăng ký')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

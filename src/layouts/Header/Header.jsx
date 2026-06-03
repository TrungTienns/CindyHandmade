import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLottie } from 'lottie-react';
import { PATHS } from '../../common/path';
import catLoading from '../../assets/animations/catLoading.json';
import './Header.scss'; // Import lại file SCSS chứa Tailwind @apply
const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lottieOptions = {
    animationData: catLoading,
    loop: true,
  };
  const { View: CatAnimation } = useLottie(lottieOptions);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <a href={PATHS.HOME} className="logo-text">Cindy Handmade</a>
        </div>
        <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            {[
              { key: 'home', path: PATHS.HOME },
              { key: 'shop', path: PATHS.SHOP },
              { key: 'about', path: PATHS.ABOUT },
              { key: 'contact', path: PATHS.CONTACT }
            ].map((item) => (
              <li key={item.key}>
                <a 
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`header.${item.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="actions">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} 
              onClick={() => changeLanguage('en')}
            >EN</button>
            <span>|</span>
            <button 
              className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`} 
              onClick={() => changeLanguage('fr')}
            >FR</button>
          </div>
          <button className="btn-cart">
            Cart (0)
          </button>
          
          <div className="hidden md:flex w-20 h-20 ml-2 items-center justify-center">
            {CatAnimation}
          </div>
          <button 
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

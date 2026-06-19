import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../common/path';

import logoIcon from '../../assets/Icons/logo.svg';
import './Banner.scss';

const Banner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const title = t('banner.title') || 'Cindy Handmade';
  const words = title.split(' ');
  const firstWord = words[0]; // Cindy
  const remainingWords = words.slice(1).join(' '); // Handmade

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tính toán fade-out và parallax trượt xuống khi cuộn lên
  const opacity = Math.max(1 - scrollY / 600, 0);
  const translateY = scrollY * 0.4;

  return (
    <section className="banner">
      <div
        className="banner-container"
        style={{
          opacity: opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div className="banner-content">
          <h1>
            <span className="title-first-line">
              {firstWord}
              <img src={logoIcon} alt="logo" className="title-icon" />
            </span>
            <br />
            <span className="title-second-line">{remainingWords}</span>
          </h1>
          <button className="btn-primary" onClick={() => navigate(PATHS.SHOP)}>
            {t('banner.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;

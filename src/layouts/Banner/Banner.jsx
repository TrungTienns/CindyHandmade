import React from 'react';
import { useTranslation } from 'react-i18next';
import bannerImg from '../../assets/images/banner.png';
import logoIcon from '../../assets/images/logo.svg';
import './Banner.scss';

const Banner = () => {
  const { t } = useTranslation();

  // Tách tiêu đề để nhét logo vào chữ Cindy (từ đầu tiên)
  const title = t('banner.title') || 'Cindy Handmade';
  const words = title.split(' ');
  const firstWord = words[0]; // Cindy
  const remainingWords = words.slice(1).join(' '); // Handmade

  return (
    <section className="banner">
      <div className="banner-container">
        <div className="banner-content">
          <h1>
            <span className="title-first-line">
              {firstWord}
              <img src={logoIcon} alt="logo" className="title-icon" />
            </span>
            <br />
            <span className="title-second-line">{remainingWords}</span>
          </h1>
          <p>{t('banner.subtitle')}</p>
          <button className="btn-primary">{t('banner.button')}</button>
        </div>
        <div className="banner-image-wrapper">
          <img src={bannerImg} alt="Cindy Handmade" className="banner-image" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
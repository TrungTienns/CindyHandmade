import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import aboutImg1 from '../../assets/images/aboutus/aboutus_1.jpeg';
import aboutImg2 from '../../assets/images/aboutus/aboutus_2.jpeg';
import aboutImg3 from '../../assets/images/aboutus/aboutus_3.jpg';
import './BannerAboutUs.scss';

const BannerAboutUs = () => {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className={`ap-hero ${ready ? 'ready' : ''}`}>
      <div className="ap-hero__bg" aria-hidden="true" />

      <div className="ap-hero__body">
        <p className="ap-hero__label">
          <span className="mr">
            <span className="mi">{t('aboutUsPage.heroLabel')}</span>
          </span>
        </p>
        <h1 className="ap-hero__h1">
          <span className="mr">
            <span className="mi">{t('aboutUsPage.heroTitle')}</span>
          </span>
          <br />
          <span className="mr delay1">
            <span className="mi italic">{t('aboutUsPage.heroTitleItalic')}</span>
          </span>
        </h1>
        <p className="ap-hero__sub">
          <span className="mr delay2">
            <span className="mi">{t('aboutUsPage.heroSub')}</span>
          </span>
        </p>
      </div>

      <div className={`ap-hero__mosaic ${ready ? 'ready' : ''}`} aria-hidden="true">
        <div className="mosaic-item mosaic-item--1">
          <img src={aboutImg1} alt="" fetchpriority="high" decoding="async" />
        </div>
        <div className="mosaic-item mosaic-item--2">
          <img src={aboutImg3} alt="" fetchpriority="high" decoding="async" />
        </div>
        <div className="mosaic-item mosaic-item--3">
          <img src={aboutImg2} alt="" decoding="async" />
        </div>
      </div>

      <div className="ap-hero__scroll" aria-hidden="true">
        <span className="scroll-bar" />
      </div>
    </section>
  );
};

export default BannerAboutUs;

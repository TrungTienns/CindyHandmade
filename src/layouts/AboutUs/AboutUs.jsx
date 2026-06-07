import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import aboutImg1 from '../../assets/images/aboutus/aboutus_1.jpeg';
import aboutImg2 from '../../assets/images/aboutus/aboutus_2.jpeg';
import './AboutUs.scss';

const AboutUs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Ngừng theo dõi sau khi đã xuất hiện để tiết kiệm hiệu năng
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2, // Kích hoạt khi 20% section lọt vào màn hình
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className={`about-us ${isVisible ? 'visible' : ''}`} ref={sectionRef} id="about-us">
      <div className="about-container">
        {/* Tiêu đề hiển thị riêng trên Mobile (Nằm trên ảnh) */}
        <div className="about-text-header mobile-only">
          <span className="section-subtitle">{t('aboutUs.subtitle')}</span>
          <h2>{t('aboutUs.title')}</h2>
        </div>

        <div className="about-image-grid">
          <div className="grid-item item-main">
            <img src={aboutImg1} alt={t('aboutUs.title')} className="about-img" />
          </div>
          <div className="grid-item item-sub">
            <img src={aboutImg2} alt={t('aboutUs.subtitle')} className="about-img" />
          </div>
        </div>

        <div className="about-content">
          {/* Tiêu đề hiển thị trên Desktop (Nằm cùng khối chữ) */}
          <div className="about-text-header desktop-only">
            <span className="section-subtitle">{t('aboutUs.subtitle')}</span>
            <h2>{t('aboutUs.title')}</h2>
          </div>

          <p>{t('aboutUs.paragraph1')}</p>
          <p>{t('aboutUs.paragraph2')}</p>
          <button className="btn-secondary" onClick={() => navigate('/about')}>
            {t('aboutUs.button')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

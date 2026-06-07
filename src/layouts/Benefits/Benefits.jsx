import React from 'react';
import { useTranslation } from 'react-i18next';
import Img1 from '../../assets/images/Benefit/Benefit_1.jpeg';
import Img2 from '../../assets/images/Benefit/Benefit_2.jpeg';
import Img3 from '../../assets/images/Benefit/Benefit_3.jpeg';
import Img4 from '../../assets/images/Benefit/Benefit_4.jpeg';
import './Benefits.scss';

const Benefits = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      id: 1,
      title: t('benefits.quality.title', 'Premium Quality'),
      desc: t(
        'benefits.quality.desc',
        'We source only the finest yarns from around the world for your projects.',
      ),
    },
    {
      id: 2,
      title: t('benefits.handmade.title', 'Hand-dyed Colors'),
      desc: t(
        'benefits.handmade.desc',
        'Unique, vibrant colors created by artisan dyers in small batches.',
      ),
    },
    {
      id: 3,
      title: t('benefits.shipping.title', 'Fast Shipping'),
      desc: t(
        'benefits.shipping.desc',
        'Quick and reliable delivery to get your yarn to you when you need it.',
      ),
    },
    {
      id: 4,
      title: t('benefits.eco.title', 'Eco-Friendly'),
      desc: t(
        'benefits.eco.desc',
        'Sustainable practices and organic materials that care for our planet.',
      ),
    },
  ];

  const images = [Img1, Img2, Img3, Img4];

  return (
    <section className="benefits-section visible">
      <div className="benefits-container">
        {/* Left Side: Content */}
        <div className="benefits-content">
          <div className="benefits-header">
            <span className="subtitle">{t('benefits.welcome', 'Welcome to')}</span>
            <h2>Cindy Handmade</h2>
            <p>
              {t(
                'benefits.subtitle',
                'Experience the difference with our curated selection and dedicated service.',
              )}
            </p>
          </div>

          <div className="benefits-list">
            {benefits.map((item, index) => (
              <div key={item.id} className="benefit-item" style={{ '--delay': `${index * 0.15}s` }}>
                <h3 className="benefit-title">{item.title}</h3>
                <p className="benefit-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Pinterest Style Masonry Gallery */}
        <div className="benefits-gallery">
          <div className="masonry-grid">
            {images.map((img, idx) => (
              <div key={idx} className={`masonry-item item-${idx + 1}`}>
                <div className="img-wrapper">
                  <img src={img} alt={`Cindy Handmade ${idx + 1}`} loading="lazy" />
                  <div className="overlay"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

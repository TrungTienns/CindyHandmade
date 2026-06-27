import React from 'react';
import { useTranslation } from 'react-i18next';
import './Lookbook.scss';
import Image1 from '../../assets/images/LookBook/LookImage1.jpg';
import Image2 from '../../assets/images/LookBook/LookImage2.jpg';
import Image3 from '../../assets/images/LookBook/LookImage3.jpg';
import Image4 from '../../assets/images/LookBook/LookImage4.jpg';
import Image5 from '../../assets/images/LookBook/LookImage5.jpg';
import Image6 from '../../assets/images/LookBook/LookImage6.jpg';

const Lookbook = () => {
  const { t } = useTranslation();

  const images = [Image1, Image2, Image3, Image4, Image5, Image6];

  return (
    <div className="lookbook-section">
      <div className="container">
        <div className="lookbook-header">
          <h2>{t('lookbook.title', 'Our Lookbook')}</h2>
          <p>{t('lookbook.subtitle', 'Discover the art of handmade crochet through our curated gallery.')}</p>
        </div>
        <div className="masonry-grid">
          {images.map((src, index) => (
            <div className="masonry-item" key={index}>
              <img src={src} alt={`Lookbook item ${index + 1}`} loading="lazy" />
              <div className="overlay">
                <span className="overlay-text">Cindy Handmade</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lookbook;

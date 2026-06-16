import React from 'react';
import './ShopBanner.scss';
import { useTranslation } from 'react-i18next';

const ShopBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="shop-banner">
      <div className="shop-banner-content">
        <h1>{t('shop.bannerTitle', 'Our Shop')}</h1>
        <p>{t('shop.bannerSubtitle', 'Discover our handcrafted products')}</p>
      </div>
    </div>
  );
};

export default ShopBanner;

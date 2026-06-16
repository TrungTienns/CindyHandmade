import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import ShopBannerImage from '../../assets/images/Banner/bannerShop.png';
import Shop from '../../layouts/Shop/Shop';

const ShopPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="shop-hero-banner" style={{ backgroundImage: `url(${ShopBannerImage})` }}>
        <div className="shop-hero-overlay"></div>
        <div className="shop-hero-content">
          <h1>Cindy Handmade Shop</h1>
          <p>{t('shop.slogan', 'Crafting memories, one stitch at a time')}</p>
        </div>
      </div>
      <Shop />
    </MainLayout>
  );
};

export default ShopPage;

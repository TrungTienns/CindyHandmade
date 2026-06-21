import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import Banner from '../../layouts/Banner/Banner';
import AboutUs from '../../layouts/AboutUs/AboutUs';
import Benefits from '../../layouts/Benefits/Benefits';
import FeaturedProducts from '../../layouts/FeaturedProducts/FeaturedProducts';
import './HomePage.scss';
import LoopImage  from '../../layouts/LoopImage/LoopImage';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="home-page">
        <Banner />
        <LoopImage />
        <AboutUs />
        <Benefits />
        <FeaturedProducts />
      </div>
    </MainLayout>
  );
};

export default HomePage;

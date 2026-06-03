import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import Banner from '../../layouts/Banner/Banner';
import './HomePage.scss';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="home-page">
        <Banner />
        <section className="features-placeholder">
          <h2>Featured Creations</h2>
          <p>More sections will be added here...</p>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import Header from '../../layouts/Header/Header';
import Footer from '../../layouts/Footer/Footer';
import errorAnimation from '../../assets/animations/404Error.json';
import { PATHS } from '../../common/path';
import './NotFoundPage.scss';

const NotFoundPage = () => {
  const { t } = useTranslation();

  const lottieOptions = {
    animationData: errorAnimation,
    loop: true,
  };

  const { View } = useLottie(lottieOptions);

  return (
    <>
      <Header />
      <div className="not-found-page">
        <div className="not-found-container">
          <div className="animation-wrapper">
            {View}
          </div>
          <div className="content">
            <h1>Oops!</h1>
            <p>We can't seem to find the page you're looking for.</p>
            <Link to={PATHS.HOME} className="back-home-btn">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;

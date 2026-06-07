import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PATHS } from '../../common/path';
import BackToTop from '../../components/BackToTop/BackToTop';
import './Footer.scss';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-column brand-column">
          <h2 className="footer-logo">Cindy Handmade</h2>
          <p className="brand-desc">
            {t(
              'footer.brandDesc',
              'Premium handcrafted knitwear for you and your loved ones. Made with love, care, and the finest materials.',
            )}
          </p>
        </div>

        <div className="footer-column links-column">
          <h3>{t('footer.quickLinks', 'Quick Links')}</h3>
          <ul>
            <li>
              <Link to={PATHS.HOME}>{t('footer.home', 'Home')}</Link>
            </li>
            <li>
              <Link to={PATHS.SHOP}>{t('footer.shop', 'Shop')}</Link>
            </li>
            <li>
              <Link to={PATHS.ABOUT}>{t('footer.about', 'About Us')}</Link>
            </li>
            <li>
              <Link to={PATHS.CONTACT}>{t('footer.contact', 'Contact')}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column links-column">
          <h3>{t('footer.customerCare', 'Customer Care')}</h3>
          <ul>
            <li>
              <Link to={PATHS.FAQ}>{t('footer.faq', 'FAQ')}</Link>
            </li>
            <li>
              <a href="#">{t('footer.shipping', 'Shipping & Returns')}</a>
            </li>
            <li>
              <a href="#">{t('footer.privacy', 'Privacy Policy')}</a>
            </li>
            <li>
              <a href="#">{t('footer.terms', 'Terms of Service')}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column map-column">
          <h3>{t('footer.findUs', 'Find Us')}</h3>
          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=619%20%C4%90.%20%C4%90%E1%BB%97%20Xu%C3%A2n%20H%E1%BB%A3p,%20Ph%C6%B0%E1%BB%9Bc%20Long,%20H%E1%BB%93%20Ch%C3%AD%20Minh%20700000,%20Vietnam&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: '12px', marginBottom: '15px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="social-links-inline">
            <span>{t('footer.followUs', 'Follow Us')}:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61561704558006"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/cindyy.handmade/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} Cindy Handmade.{' '}
            {t('footer.copyright', 'All rights reserved.')}
          </p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
};

export default Footer;

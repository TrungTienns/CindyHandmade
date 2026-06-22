import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import './Footer.scss';
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
              <Link to={PATHS.PRIVACY_POLICY}>{t('footer.privacy', 'Privacy Policy')}</Link>
            </li>
            <li>
              <a href="#">{t('footer.terms', 'Terms of Service')}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column map-column">
          <h3>{t('footer.visitUs', 'Visit Us')}</h3>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.6896263889154!2d106.63845893845942!3d10.782245203309914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ea11b8b21ed%3A0x633d9943d002a281!2zMjEgxJAuIFPhu5EgNywgUGjGsOG7nW5nIDExLCBRdeG6rW4gNiwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1731511267568!5m2!1svi!2s"
              width="100%"
              height="200"
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
              className="social-icon"
              title="Facebook"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://www.instagram.com/cindyy.handmade/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title="Zalo"
            >
              <SiZalo size={22} />
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

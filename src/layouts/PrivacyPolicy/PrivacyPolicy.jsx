import React from 'react';
import './PrivacyPolicy.scss';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-layout">
      <div className="privacy-container">
        <div className="privacy-header">
          <h1>{t('privacy.title', 'Privacy Policy')}</h1>
          <p className="last-updated">{t('privacy.lastUpdated', 'Last Updated: June 2026')}</p>
        </div>
        
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>{t('privacy.section1.title', '1. Information We Collect')}</h2>
            <p>{t('privacy.section1.content1', 'We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.')}</p>
            <ul>
              <li>{t('privacy.section1.item1', 'Contact information (name, email address, phone number)')}</li>
              <li>{t('privacy.section1.item2', 'Shipping and billing address')}</li>
              <li>{t('privacy.section1.item3', 'Payment information (processed securely by our payment partners)')}</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>{t('privacy.section2.title', '2. How We Use Your Information')}</h2>
            <p>{t('privacy.section2.content1', 'We use the information we collect to provide, maintain, and improve our services, process transactions, and send related information.')}</p>
          </section>

          <section className="privacy-section">
            <h2>{t('privacy.section3.title', '3. Information Sharing')}</h2>
            <p>{t('privacy.section3.content1', 'We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights.')}</p>
          </section>

          <section className="privacy-section">
            <h2>{t('privacy.section4.title', '4. Security')}</h2>
            <p>{t('privacy.section4.content1', 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.')}</p>
          </section>

          <section className="privacy-section">
            <h2>{t('privacy.section5.title', '5. Contact Us')}</h2>
            <p>{t('privacy.section5.content1', 'If you have any questions about this Privacy Policy, please contact us at support@cindyhandmade.com.')}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

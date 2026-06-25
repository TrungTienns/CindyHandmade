import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './Contact.scss';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <div className="container">
        <div className="title">
          <h2>{t('contact.title', 'Contact Us')}</h2>
          <p>
            {t(
              'contact.subtitle',
              'We’re always here to help. Reach out through any of the channels below.',
            )}
          </p>
        </div>
        <div className="contact-wrapper">
          <div className="contact-info">
            <h3>{t('contact.infoTitle', 'Get In Touch')}</h3>
            <p className="info-desc">
              {t(
                'contact.infoDesc',
                'We would love to hear from you. Whether you have a question about products, pricing, or anything else, our team is ready to answer all your questions.',
              )}
            </p>

            <div className="info-item">
              <div className="icon"><FiMapPin size={24} /></div>
              <div>
                <h4>{t('contact.addressTitle', 'Address')}</h4>
                <p>Thôn đông hà ,Cẩm Kim , Phường Hội An , TP Đà Nẵng</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon"><FiPhone size={24} /></div>
              <div>
                <h4>{t('contact.phoneTitle', 'Phone')}</h4>
                <p>+84 77 8735 699</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon"><FiMail size={24} /></div>
              <div>
                <h4>{t('contact.emailTitle', 'Email')}</h4>
                <p>tuyetduongge.1993@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name">{t('contact.nameLabel', 'Your Name')}</label>
                <input
                  type="text"
                  id="name"
                  placeholder={t('contact.namePlaceholder', 'John Doe')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t('contact.emailLabel', 'Your Email')}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={t('contact.emailPlaceholder', 'john@example.com')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">{t('contact.subjectLabel', 'Subject')}</label>
                <input
                  type="text"
                  id="subject"
                  placeholder={t('contact.subjectPlaceholder', 'How can we help?')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('contact.messageLabel', 'Message')}</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder={t('contact.messagePlaceholder', 'Write your message here...')}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                {t('contact.submitBtn', 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

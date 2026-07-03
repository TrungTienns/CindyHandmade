import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './Contact.scss';

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.target;
    const data = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/xpqgdazg', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
                <p>{t('contact.address')}</p>
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
            {status === 'success' ? (
              <div className="success-message" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#e6ffe6', borderRadius: '8px', color: '#2b7a2b' }}>
                <h3>{t('contact.successTitle', 'Thank You!')}</h3>
                <p>{t('contact.successMessage', 'Your message has been sent successfully. We will get back to you soon.')}</p>
                <button onClick={() => setStatus('')} className="submit-btn" style={{ marginTop: '1rem' }}>
                  {t('contact.sendAnother', 'Send another message')}
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                    {t('contact.errorMessage', 'Oops! There was a problem submitting your form. Please try again.')}
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="name">{t('contact.nameLabel', 'Your Name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('contact.namePlaceholder', 'John Doe')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('contact.emailLabel', 'Your Email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t('contact.emailPlaceholder', 'john@example.com')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{t('contact.subjectLabel', 'Subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder={t('contact.subjectPlaceholder', 'How can we help?')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">{t('contact.messageLabel', 'Message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder={t('contact.messagePlaceholder', 'Write your message here...')}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                  {status === 'submitting' ? t('contact.submittingBtn', 'Sending...') : t('contact.submitBtn', 'Send Message')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

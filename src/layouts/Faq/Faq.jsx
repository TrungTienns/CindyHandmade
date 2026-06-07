import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Faq.scss';

const Faq = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Lấy danh sách câu hỏi từ translation
  const faqItems = t('faq.items', { returnObjects: true });

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1 className="faq-title">{t('faq.title', 'Frequently Asked Questions')}</h1>
          <p className="faq-subtitle">
            {t(
              'faq.subtitle',
              'Find answers to common questions about our products, shipping, and more.',
            )}
          </p>
        </div>

        <div className="faq-accordion">
          {Array.isArray(faqItems) &&
            faqItems.map((item, index) => (
              <div
                className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                key={index}
              >
                <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <h3 className="accordion-question">{item.question}</h3>
                  <span className="accordion-icon"></span>
                </div>
                <div
                  className="accordion-content"
                  style={{ maxHeight: activeIndex === index ? '500px' : '0px' }}
                >
                  <p className="accordion-answer">{item.answer}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiFeather, FiHeart, FiShield, FiPackage } from 'react-icons/fi';
import './ProductCommitments.scss';

const ProductCommitments = () => {
  const { t } = useTranslation();

  const commitments = [
    {
      id: 'material',
      icon: <FiFeather />,
      title: t('productCommitments.material.title'),
      desc: t('productCommitments.material.desc')
    },
    {
      id: 'handmade',
      icon: <FiHeart />,
      title: t('productCommitments.handmade.title'),
      desc: t('productCommitments.handmade.desc')
    },
    {
      id: 'warranty',
      icon: <FiShield />,
      title: t('productCommitments.warranty.title'),
      desc: t('productCommitments.warranty.desc')
    },
    {
      id: 'shipping',
      icon: <FiPackage />,
      title: t('productCommitments.shipping.title'),
      desc: t('productCommitments.shipping.desc')
    }
  ];

  return (
    <div className="product-commitments">
      <h3 className="commitments-title">{t('productCommitments.title')}</h3>
      <div className="commitments-grid">
        {commitments.map((item) => (
          <div key={item.id} className="commitment-card">
            <div className="commitment-icon-wrapper">
              {item.icon}
            </div>
            <div className="commitment-content">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCommitments;

import React from 'react';
import './CheckoutStepper.scss';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiUser, FiCreditCard } from 'react-icons/fi';

const CheckoutStepper = ({ currentStep }) => {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t('checkout.stepCart', 'Cart'),
      icon: <FiShoppingCart />
    },
    {
      id: 2,
      title: t('checkout.stepDetails', 'Details'),
      icon: <FiUser />
    },
    {
      id: 3,
      title: t('checkout.stepPayment', 'Payment'),
      icon: <FiCreditCard />
    }
  ];

  return (
    <div className="checkout-stepper-container">
      <div className="checkout-stepper">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`step ${currentStep >= step.id ? 'active' : ''}`}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-title">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-line ${currentStep > step.id ? 'active' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutStepper;

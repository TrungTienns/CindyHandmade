import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { PATHS } from '../../common/path';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentResult.scss';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect back to home if they stay here too long, optional
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate(PATHS.HOME);
  //   }, 10000);
  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <MainLayout>
      <div className="payment-result-page success-page">
        <div className="result-container">
          <div className="icon-wrapper success">
            <FaCheckCircle />
          </div>
          <h1 className="result-title">{t('paymentResult.successTitle', 'Thanh toán thành công!')}</h1>
          <p className="result-message">
            {t('paymentResult.successMessage1', 'Cảm ơn bạn đã mua sắm tại Cindy Handmade.')}<br/>
            {t('paymentResult.successMessage2', 'Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý. Chúng tôi sẽ kiểm tra giao dịch và tiến hành giao hàng sớm nhất có thể.')}
          </p>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate(PATHS.SHOP)}>
              {t('paymentResult.continueShopping', 'Tiếp tục mua sắm')}
            </button>
            <button className="btn-secondary" onClick={() => navigate(PATHS.PROFILE)}>
              {t('paymentResult.viewOrder', 'Xem đơn hàng')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccessPage;

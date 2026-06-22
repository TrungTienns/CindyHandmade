import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { PATHS } from '../../common/path';
import { FaTimesCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './PaymentResult.scss';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="payment-result-page failed-page">
        <div className="result-container">
          <div className="icon-wrapper failed">
            <FaTimesCircle />
          </div>
          <h1 className="result-title">{t('paymentResult.failedTitle', 'Thanh toán thất bại')}</h1>
          <p className="result-message">
            {t('paymentResult.failedMessage1', 'Rất tiếc, giao dịch thanh toán của bạn không thành công hoặc đã bị hủy.')}<br/>
            {t('paymentResult.failedMessage2', 'Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại sau.')}
          </p>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate(PATHS.CART)}>
              {t('paymentResult.retryPayment', 'Thử lại thanh toán')}
            </button>
            <button className="btn-secondary" onClick={() => navigate(PATHS.SHOP)}>
              {t('paymentResult.backToShop', 'Quay lại cửa hàng')}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentFailedPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import { PATHS } from '../../common/path';
import { useCurrency } from '../../hooks/useCurrency';
import { useAlert } from '../../context/Alert/AlertContext';
import http from '../../services/http';
import './PaymentQRPage.scss';

const PaymentQRPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { showAlert } = useAlert();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await http.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        showAlert(t('paymentQR.orderNotFound', 'Không tìm thấy thông tin đơn hàng'), t('alerts.errorTitle', 'Lỗi'), 'error');
        navigate(PATHS.HOME);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, navigate, showAlert]);

  if (loading) return <MainLayout><div className="payment-loading">{t('paymentQR.loading', 'Đang tải thông tin...')}</div></MainLayout>;
  if (!order) return null;

  // Placeholder Bank details
  const BANK_ID = 'TPBANK'; 
  const ACCOUNT_NO = '07172030101'; 
  const ACCOUNT_NAME = 'CINDY HANDMADE'; 
  
  const amount = order.totalAmount || 0;
  const description = `Thanh toan don hang ${order.id}`;
  
  // VietQR generation URL
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handlePaymentSuccess = () => {
    setIsChecking(true);
    // Simulate checking transaction
    setTimeout(() => {
      setIsChecking(false);
      navigate(PATHS.PAYMENT_SUCCESS);
    }, 2500);
  };

  return (
    <MainLayout>
      <div className="payment-qr-page">
        <div className="payment-qr-wrapper">
          <div className="payment-qr-container">
            <h2>{t('paymentQR.title', 'Thanh Toán Đơn Hàng #')}{order.id}</h2>
          <p className="subtitle">{t('paymentQR.subtitle', 'Quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán')}</p>
          
          <div className="qr-box">
            <img src={qrUrl} alt="QR Code" className="qr-image" />
          </div>

          <div className="bank-details">
            <div className="detail-row">
              <span className="label">{t('paymentQR.bank', 'Ngân hàng:')}</span>
              <span className="value"><strong>{BANK_ID}</strong></span>
            </div>
            <div className="detail-row">
              <span className="label">{t('paymentQR.accountNo', 'Số tài khoản:')}</span>
              <span className="value"><strong>{ACCOUNT_NO}</strong></span>
            </div>
            <div className="detail-row">
              <span className="label">{t('paymentQR.accountName', 'Chủ tài khoản:')}</span>
              <span className="value"><strong>{ACCOUNT_NAME}</strong></span>
            </div>
            <div className="detail-row">
              <span className="label">{t('paymentQR.amount', 'Số tiền:')}</span>
              <span className="value highlight">{formatPrice(amount)}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t('paymentQR.description', 'Nội dung:')}</span>
              <span className="value"><strong>{description}</strong></span>
            </div>
          </div>
          
          <div className="actions">
            <button 
              className="btn-primary" 
              onClick={handlePaymentSuccess}
              disabled={isChecking}
            >
              {isChecking ? t('paymentQR.checkingBtn', 'Đang kiểm tra giao dịch...') : t('paymentQR.confirmBtn', 'Tôi đã chuyển khoản')}
            </button>
          </div>
          </div>
          
          <div className="payment-qr-notes-container">
            <div className="important-notes">
              <h3>{t('paymentQR.noteTitle', '⚠️ LƯU Ý QUAN TRỌNG:')}</h3>
              <ul>
                <li>
                  <strong>{t('paymentQR.note1', 'Sau khi chuyển khoản, vui lòng chụp lại màn hình giao dịch để làm bằng chứng xác minh rồi mới bấm nút "Tôi đã chuyển khoản". Nếu không chuyển khoản mà bấm nút, đơn hàng sẽ bị hủy.')}</strong>
                </li>
                <li>
                  <strong>{t('paymentQR.note2', 'Sau khi thực hiện các bước trên, vui lòng vào trang Lịch sử đơn hàng (Order History) để kiểm tra trạng thái. Trạng thái sẽ được cập nhật trong vòng 5-15 phút. Nếu chưa thấy cập nhật, vui lòng liên hệ Hotline: 1900-000-000.')}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentQRPage;

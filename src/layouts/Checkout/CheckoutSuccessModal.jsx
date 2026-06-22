import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../common/path';
import { useCurrency } from '../../hooks/useCurrency';
import './Checkout.scss'; // It will reuse styles from Checkout.scss

const CheckoutSuccessModal = ({ orderData, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [isChecking, setIsChecking] = useState(false);

  if (!orderData) return null;

  // Placeholder Bank details (The user will change these)
  const BANK_ID = 'TPBANK'; // e.g., Vietcombank, MBBank (BIN or short name)
  const ACCOUNT_NO = '07172030101'; // Account number
  const ACCOUNT_NAME = 'CINDY HANDMADE'; // Account name without accents
  
  const amount = orderData.totalPrice || 0;
  const orderId = orderData.id || orderData._id || 'UNKNOWN';
  const description = `Thanh toan don hang ${orderId}`;
  
  // VietQR generation URL
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handlePaymentSuccess = () => {
    setIsChecking(true);
    // Simulate checking transaction for 2.5 seconds
    setTimeout(() => {
      setIsChecking(false);
      onClose();
      navigate(PATHS.PAYMENT_SUCCESS);
    }, 2500);
  };

  const handlePaymentCancel = () => {
    onClose();
    navigate(PATHS.PAYMENT_FAILED);
  };

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-content qr-modal">
        <div className="modal-header">
          <h2>{t('checkout.orderSuccess', 'Order placed successfully!')}</h2>
        </div>
        
        <div className="modal-body">
          <p className="success-msg">
            Cảm ơn bạn đã đặt hàng! Vui lòng quét mã QR bên dưới để thanh toán.
          </p>
          
          <div className="qr-container">
            <img src={qrUrl} alt="QR Code Thanh Toán" className="qr-image" />
          </div>

          <div className="bank-details">
            <p><strong>Ngân hàng:</strong> {BANK_ID}</p>
            <p><strong>Số tài khoản:</strong> {ACCOUNT_NO}</p>
            <p><strong>Chủ tài khoản:</strong> {ACCOUNT_NAME}</p>
            <p><strong>Số tiền:</strong> {formatPrice(amount)}</p>
            <p><strong>Nội dung:</strong> {description}</p>
          </div>
          
          <p className="note-text">
            Đơn hàng của bạn (Mã: <strong>{orderId}</strong>) sẽ được xử lý ngay sau khi chúng tôi nhận được thanh toán.
          </p>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button 
            className="btn-primary" 
            onClick={handlePaymentSuccess}
            disabled={isChecking}
          >
            {isChecking ? 'Đang kiểm tra giao dịch...' : 'Tôi đã chuyển khoản'}
          </button>
          <button 
            className="btn-primary" 
            style={{ background: '#f1f5f9', color: '#475569', border: 'none' }}
            onClick={handlePaymentCancel}
            disabled={isChecking}
          >
            Hủy giao dịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessModal;

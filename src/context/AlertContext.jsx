import React, { createContext, useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './Alert.scss';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const { t } = useTranslation();
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'alert', // 'alert', 'confirm', 'success', 'error'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = useCallback((message, title, type = 'info') => {
    setAlertState({
      isOpen: true,
      type: type,
      title: title || t('alerts.infoTitle', 'Thông báo'),
      message,
      onConfirm: () => closeAlert(),
      onCancel: null,
    });
  }, [t]);

  const showConfirm = useCallback((message, title) => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        type: 'confirm',
        title: title || t('alerts.confirmTitle', 'Xác nhận'),
        message,
        onConfirm: () => {
          closeAlert();
          resolve(true);
        },
        onCancel: () => {
          closeAlert();
          resolve(false);
        },
      });
    });
  }, [t]);

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const getIcon = () => {
    switch (alertState.type) {
      case 'error':
        return <FiAlertCircle className="error-icon" size={40} color="#ff3b3b" />;
      case 'success':
        return <FiCheckCircle className="success-icon" size={40} color="#43a047" />;
      case 'confirm':
        return <FiAlertCircle className="confirm-icon" size={40} color="#fb8c00" />;
      default:
        return <FiInfo size={40} color="#1e88e5" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {alertState.isOpen && (
        <div className="alert-overlay">
          <div className="alert-modal">
            <button className="alert-close" onClick={alertState.onCancel || alertState.onConfirm}>
              <FiX size={20} />
            </button>
            <div className="alert-icon">{getIcon()}</div>
            <h3 className="alert-title">{alertState.title}</h3>
            <p className="alert-message">{alertState.message}</p>
            
            <div className="alert-actions">
              {alertState.type === 'confirm' && (
                <button className="btn-cancel" onClick={alertState.onCancel}>
                  {t('alerts.cancelBtn', 'Hủy')}
                </button>
              )}
              <button 
                className={`btn-confirm ${alertState.type}`} 
                onClick={alertState.onConfirm}
              >
                {alertState.type === 'confirm' ? t('alerts.confirmBtn', 'Đồng ý') : t('alerts.closeBtn', 'Đóng')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

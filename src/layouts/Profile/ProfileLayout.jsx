import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { fetchMyOrders } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../common/path';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useCurrency } from '../../hooks/useCurrency';
import './ProfileLayout.scss';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'status-warning' },
  processing: { label: 'Đang xử lý', color: 'status-info' },
  shipped: { label: 'Đang giao', color: 'status-primary' },
  delivered: { label: 'Hoàn thành', color: 'status-success' },
  cancelled: { label: 'Đã huỷ', color: 'status-danger' },
};

const ProfileLayout = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      const loadOrders = async () => {
        setLoadingOrders(true);
        try {
          const data = await fetchMyOrders();
          setOrders(data || []);
        } catch (error) {
          console.error("Error loading orders", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      loadOrders();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
  };

  if (!user) {
    return null;
  }

  const displayName = user.name || user.username || 'User';
  const displayRole = user.role === 'admin' ? 'Administrator' : 'Customer';

  return (
    <div className="profile-dashboard-wrapper">
      <div className="profile-dashboard-container">
        
        {/* Left Sidebar Menu */}
        <aside className="dashboard-sidebar">
          <h2 className="sidebar-title">Account Settings</h2>
          
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              {t('profile.myProfile', 'My Profile')}
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              {t('profile.orderHistory', 'Order History')}
            </button>
            
            <button className="nav-item logout-text" onClick={handleLogout}>
              {t('header.logout', 'Log out')}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          
          {activeTab === 'profile' && (
            <div className="tab-pane fade-in">
              <h1 className="page-title">{t('profile.myProfile', 'My Profile')}</h1>
              
              {/* Top Profile Card */}
              <div className="dashboard-card profile-overview-card">
                <div className="avatar-section">
                  <div className="avatar-circle">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="profile-brief">
                  <h2>{displayName}</h2>
                  <p className="role-text">{displayRole}</p>
                  <p className="location-text">Vietnam</p>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="dashboard-card detail-card">
                <h3 className="card-title">{t('profile.personalInfo', 'Personal information')}</h3>
                
                <div className="info-grid">
                  <div className="grid-item">
                    <span className="label">{t('profile.username', 'Username')}</span>
                    <span className="value">{displayName}</span>
                  </div>
                  <div className="grid-item">
                    <span className="label">{t('profile.role', 'Role')}</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{user.role}</span>
                  </div>
                  <div className="grid-item">
                    <span className="label">{t('profile.email', 'Email address')}</span>
                    <span className="value">{user.email}</span>
                  </div>
                  <div className="grid-item">
                    <span className="label">Phone</span>
                    <span className="value">Not provided</span>
                  </div>
                </div>
              </div>
              
              {/* Dummy Address Card to match design */}
              <div className="dashboard-card detail-card">
                <h3 className="card-title">Address</h3>
                
                <div className="info-grid">
                  <div className="grid-item">
                    <span className="label">Country</span>
                    <span className="value">Vietnam</span>
                  </div>
                  <div className="grid-item">
                    <span className="label">City / Province</span>
                    <span className="value">Not provided</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-pane fade-in">
              <h1 className="page-title">{t('profile.orderHistory', 'Order History')}</h1>
              
              {loadingOrders ? (
                <div className="loading-spinner">{t('profile.loading', 'Loading...')}</div>
              ) : orders.length === 0 ? (
                <div className="dashboard-card empty-state">
                  <p>{t('profile.noOrders', 'You don\'t have any orders yet.')}</p>
                  <button className="btn-primary" onClick={() => navigate(PATHS.SHOP)}>
                    {t('profile.shopNow', 'Shop Now')}
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => {
                    const isExpanded = expandedOrder === (order.id || order._id);
                    return (
                    <div key={order.id || order._id} className="dashboard-card order-item-card">
                      <div 
                        className="order-grid" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleOrderDetails(order.id || order._id)}
                      >
                        <div className="grid-item">
                          <span className="label">{t('profile.orderId', 'Order ID')}</span>
                          <span className="value">#{String(order.id || order._id).padStart(4, '0')}</span>
                        </div>
                        <div className="grid-item">
                          <span className="label">{t('profile.date', 'Date')}</span>
                          <span className="value">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="grid-item">
                          <span className="label">{t('profile.total', 'Total')}</span>
                          <span className="value highlight">
                            {formatPrice(order.totalAmount || order.totalPrice || 0)}
                          </span>
                        </div>
                        <div className="grid-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span className="label" style={{ display: 'block' }}>Status</span>
                            <span className={`status-badge ${STATUS_MAP[order.status]?.color || 'status-default'}`}>
                              {t(`status.${order.status}`, STATUS_MAP[order.status]?.label || order.status)}
                            </span>
                          </div>
                          <div className="dropdown-icon" style={{ color: '#8b95a5', paddingRight: '10px' }}>
                            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="order-details-dropdown fade-in">
                          <div className="details-section">
                            <h4>{t('profile.shippingInfo', 'Delivery Information')}</h4>
                            <p><strong>{t('profile.receiver', 'Receiver:')}</strong> {order.fullName}</p>
                            <p><strong>{t('profile.phoneNumber', 'Phone Number:')}</strong> {order.phone}</p>
                            <p><strong>{t('profile.addressDetails', 'Address:')}</strong> {order.address}, {order.ward}, {order.district}, {order.province}</p>
                            <p><strong>{t('profile.paymentMethod', 'Payment Method:')}</strong> {order.paymentMethod}</p>
                          </div>
                          
                          <div className="details-section">
                            <h4>{t('profile.productDetails', 'Product Details')}</h4>
                            <div className="order-items-list">
                              {order.items && order.items.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                  <div className="item-name">{item.product?.name || t('profile.productNameFallback', 'Product')}</div>
                                  <div className="item-qty">x{item.quantity}</div>
                                  <div className="item-price">
                                    {formatPrice((item.priceAtPurchase || item.price || item.product?.price || 0) * item.quantity)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;

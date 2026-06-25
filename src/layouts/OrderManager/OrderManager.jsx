import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus, updatePaymentStatus } from '../../services/orderService';
import { useAlert } from '../../context/Alert/AlertContext';
import { FiSearch, FiEye, FiCheckCircle } from 'react-icons/fi';
import './OrderManager.scss';

const STATUS_MAP = {
  pending: { label: 'Waiting for Confirm', color: 'status-warning' },
  processing: { label: 'Processing', color: 'status-info' },
  shipped: { label: 'Delivering', color: 'status-primary' },
  delivered: { label: 'Completed', color: 'status-success' },
  cancelled: { label: 'Cancelled', color: 'status-danger' },
};

const OrderManager = () => {
  const { showAlert, showConfirm } = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
      showAlert('Không thể tải dữ liệu đơn hàng.', 'Lỗi', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const isConfirmed = await showConfirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${STATUS_MAP[newStatus].label}"?`);
    if (isConfirmed) {
      try {
        await updateOrderStatus(orderId, newStatus);
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        showAlert('Đã cập nhật trạng thái thành công', 'Thành công', 'success');
      } catch (error) {
        showAlert('Có lỗi xảy ra khi cập nhật!', 'Lỗi', 'error');
      }
    }
  };

  const handlePaymentStatusChange = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    const isConfirmed = await showConfirm(`Xác nhận đổi trạng thái thanh toán thành "${newStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}"?`);
    if (isConfirmed) {
      try {
        await updatePaymentStatus(orderId, newStatus);
        setOrders(orders.map(order => order.id === orderId ? { ...order, paymentStatus: newStatus } : order));
        showAlert('Cập nhật trạng thái thanh toán thành công', 'Thành công', 'success');
      } catch (error) {
        showAlert('Có lỗi xảy ra khi cập nhật!', 'Lỗi', 'error');
      }
    }
  };

  const filteredOrders = orders.filter(o => 
    String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="order-manager">
      <div className="manager-header">
        <h2 style={{ color: '#2b3674' }}>Quản lý đơn hàng</h2>
        
        <div className="manager-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã đơn hoặc tên KH..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p className="loading-text">Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Cập nhật trạng thái</th>
                <th>Thông tin đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy đơn hàng nào.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 'bold', color: '#555' }}>#{String(order.id).padStart(4, '0')}</td>
                    <td style={{ fontWeight: 500 }}>{order.fullName || 'Khách vãng lai'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ fontWeight: 'bold', color: '#2b3674' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_MAP[order.status]?.color || 'status-default'}`}>
                        {STATUS_MAP[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td>
                      {order.paymentMethod === 'COD' ? (
                        <span style={{ color: '#64748b', fontWeight: 500 }}>(COD)</span>
                      ) : (
                        <button 
                          className={`btn-primary ${order.paymentStatus === 'PAID' ? 'btn-success' : 'btn-warning'}`}
                          style={{ padding: '6px 12px', fontSize: '0.85rem', width: '130px' }}
                          onClick={() => handlePaymentStatusChange(order.id, order.paymentStatus)}
                        >
                          {order.paymentStatus === 'PAID' ? 'Đã thu tiền' : 'Xác nhận thu tiền'}
                        </button>
                      )}
                    </td>
                    <td>
                      <select 
                        className="status-select" 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view" 
                          title="Xem chi tiết"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{String(selectedOrder.id).padStart(4, '0')}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <h4>Thông tin giao hàng</h4>
                <p><strong>Người nhận:</strong> {selectedOrder.fullName}</p>
                <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : selectedOrder.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : selectedOrder.paymentMethod}</p>
              </div>
              <div className="order-items">
                <h4>Sản phẩm đã mua</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map(item => {
                        let imageUrl = '/placeholder.jpg';
                        if (item.product?.images) {
                          try {
                            const images = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images;
                            if (images && images.length > 0) imageUrl = images[0];
                          } catch (e) {
                            console.error('Error parsing images', e);
                          }
                        }
                        
                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                  src={imageUrl} 
                                  alt={item.product?.name || 'Sản phẩm'} 
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                  onError={(e) => { e.target.src = '/placeholder.jpg' }}
                                />
                                <span>
                                  {item.product?.name || 'Sản phẩm không xác định'}
                                  {item.size && <span style={{ display: 'block', color: '#666', fontSize: '0.85em' }}>Size: {item.size}</span>}
                                </span>
                              </div>
                            </td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceAtPurchase || 0)}</td>
                            <td>{item.quantity}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.priceAtPurchase || 0) * item.quantity)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>Không có thông tin sản phẩm.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '1.1rem' }}>
                  <strong>Tổng cộng: <span style={{ color: '#e53e3e' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalAmount)}</span></strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AdminPage.scss';

const AdminPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Bảng điều khiển Quản trị viên</h1>
        <p>
          Xin chào, {user?.username}! Bạn đang truy cập với quyền {user?.role}.
        </p>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h3>Quản lý người dùng</h3>
          <p>Khu vực dành riêng cho admin để quản lý thông tin người dùng.</p>
          <button>Xem chi tiết</button>
        </div>

        <div className="admin-card">
          <h3>Thống kê doanh thu</h3>
          <p>Xem báo cáo doanh thu và tình hình kinh doanh.</p>
          <button>Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import ProductManager from '../../layouts/ProductManager/ProductManager';
import Dashboard from '../../layouts/Dashboard/Dashboard';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'orders':
        return (
          <div className="admin-card">
            <h2>Đơn hàng</h2>
            <p>Tính năng quản lý đơn hàng đang được xây dựng.</p>
          </div>
        );
      case 'users':
        return (
          <div className="admin-card">
            <h2>Người dùng</h2>
            <p>Tính năng quản lý người dùng đang được xây dựng.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;

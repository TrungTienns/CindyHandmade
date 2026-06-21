import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import ProductManager from '../../layouts/ProductManager/ProductManager';
import Dashboard from '../../layouts/Dashboard/Dashboard';
import UserManager from '../../layouts/UserManager/UserManager';
import CategoryManager from '../../layouts/CategoryManager/CategoryManager';
import OrderManager from '../../layouts/OrderManager/OrderManager';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'orders':
        return <OrderManager />;
      case 'users':
        return <UserManager />;
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

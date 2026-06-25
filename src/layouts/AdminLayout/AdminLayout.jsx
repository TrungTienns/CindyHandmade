import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut, FiList,
  FiMenu, FiX
} from 'react-icons/fi';
import './AdminLayout.scss';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile when a tab is clicked
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Cindy Handmade</Link>
          </h2>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-label">Menu</div>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => handleTabClick('dashboard')}
          >
            <FiHome /> Dashboard
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => handleTabClick('products')}
          >
            <FiBox /> Products
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => handleTabClick('categories')}
          >
            <FiList /> Categories
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => handleTabClick('orders')}
          >
            <FiShoppingCart /> Orders
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => handleTabClick('users')}
          >
            <FiUsers /> Users
          </button>

          <button style={{ marginTop: 'auto', color: '#ef4444' }} onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="main-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} color="#1e293b" />
            </button>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <div className="user-text">
                <span>{user?.name || 'Admin'}</span>
                <small>{user?.role === 'admin' ? 'Administrator' : 'User'}</small>
              </div>
              <div className="avatar">
                {/* Fallback avatar if not provided */}
                <FiUsers size={20} color="#64748b" />
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

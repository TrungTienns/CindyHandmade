import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut, 
  FiSearch, FiBell, FiMessageSquare, FiMenu 
} from 'react-icons/fi';
import './AdminLayout.scss';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>
            <span className="logo-icon"><FiBox size={24} /></span> 
            Cindy Handmade
          </h2>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-label">Menu</div>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome /> Dashboard
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            <FiBox /> Products
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingCart /> Orders
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
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
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Type to search..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <FiBell />
              <span className="badge"></span>
            </button>
            <button className="icon-btn">
              <FiMessageSquare />
              <span className="badge"></span>
            </button>

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

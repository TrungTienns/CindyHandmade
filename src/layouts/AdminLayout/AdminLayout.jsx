import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut, FiList,
  FiMenu 
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
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Cindy Handmade</Link>
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
            className={activeTab === 'categories' ? 'active' : ''} 
            onClick={() => setActiveTab('categories')}
          >
            <FiList /> Danh mục
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
          <div></div> {/* Empty div to push user-info to the right since we use justify-content: space-between */}
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

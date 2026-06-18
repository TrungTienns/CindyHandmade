import React, { useState, useEffect, useContext } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import './UserManager.scss';

const UserManager = () => {
  const { user: currentUser } = useContext(AuthContext);
  const { showConfirm, showAlert } = useAlert();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    const actionText = newRole === 'admin' ? 'cấp quyền Quản trị viên cho' : 'giáng quyền xuống Khách hàng cho';
    
    const isConfirmed = await showConfirm(`Bạn có chắc chắn muốn ${actionText} người dùng ${user.name}?`);
    if (isConfirmed) {
      try {
        await updateUserRole(user.id, newRole);
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        showAlert(`Đã ${actionText} ${user.name} thành công.`, 'Thành công', 'success');
      } catch (error) {
        showAlert('Có lỗi xảy ra khi cập nhật quyền!', 'Lỗi', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.');
    if (isConfirmed) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        showAlert('Đã xóa người dùng thành công.', 'Thành công', 'success');
      } catch (error) {
        showAlert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng!', 'Lỗi', 'error');
      }
    }
  };

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h2>Quản lý Người dùng</h2>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Không có người dùng nào.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user.id !== currentUser?.id && (
                          <>
                            <button 
                              className={`btn-toggle-role ${user.role === 'admin' ? 'is-admin' : ''}`} 
                              onClick={() => handleToggleRole(user)}
                              title={user.role === 'admin' ? "Chuyển thành Customer" : "Cấp quyền Admin"}
                            >
                              {user.role === 'admin' ? <FiUser size={18} /> : <FiShield size={18} />}
                            </button>
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDelete(user.id)}
                              title="Xóa người dùng"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </>
                        )}
                        {user.id === currentUser?.id && (
                          <span style={{ fontSize: '0.85rem', color: '#a3aed1', fontStyle: 'italic' }}>
                            (Bạn)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManager;

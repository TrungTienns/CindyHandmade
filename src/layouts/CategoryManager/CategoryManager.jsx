import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { useAlert } from '../../context/AlertContext';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import './CategoryManager.scss';

const CategoryManager = () => {
  const { showConfirm, showAlert } = useAlert();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for adding/editing
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      showAlert('Lỗi khi tải danh sách danh mục.', 'Lỗi', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Bạn có chắc chắn muốn xóa danh mục này không? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng.');
    if (isConfirmed) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        showAlert('Đã xóa danh mục thành công', 'Thành công', 'success');
      } catch (error) {
        showAlert('Có lỗi xảy ra khi xóa danh mục!', 'Lỗi', 'error');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showAlert('Vui lòng nhập tên danh mục.', 'Cảnh báo', 'info');
      return;
    }

    try {
      if (editingId) {
        // Update
        const updated = await updateCategory(editingId, formData);
        setCategories(categories.map(c => c.id === editingId ? updated : c));
        showAlert('Cập nhật danh mục thành công.', 'Thành công', 'success');
      } else {
        // Create
        const created = await createCategory(formData);
        setCategories([...categories, created]);
        showAlert('Thêm danh mục mới thành công.', 'Thành công', 'success');
      }
      handleCancel();
    } catch (error) {
      showAlert('Có lỗi xảy ra khi lưu danh mục.', 'Lỗi', 'error');
    }
  };

  return (
    <div className="category-manager">
      <div className="manager-header">
        <h2>Quản lý Danh mục</h2>
        <button className="btn-add" onClick={handleAddNew} disabled={isAdding || editingId}>
          <FiPlus size={20} /> Thêm Danh Mục
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '250px' }}>Tên danh mục</th>
                <th>Mô tả</th>
                <th style={{ width: '120px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {/* Form Add New */}
              {isAdding && (
                <tr className="editing-row">
                  <td>Mới</td>
                  <td>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="Tên danh mục..."
                      autoFocus
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      placeholder="Mô tả..."
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-save" onClick={handleSave} title="Lưu"><FiCheck size={18} /></button>
                      <button className="btn-cancel-edit" onClick={handleCancel} title="Hủy"><FiX size={18} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {categories.length === 0 && !isAdding ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có danh mục nào.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <React.Fragment key={category.id}>
                    {editingId === category.id ? (
                      <tr className="editing-row">
                        <td>#{category.id}</td>
                        <td>
                          <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                          />
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-save" onClick={handleSave} title="Lưu"><FiCheck size={18} /></button>
                            <button className="btn-cancel-edit" onClick={handleCancel} title="Hủy"><FiX size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>#{category.id}</td>
                        <td style={{ fontWeight: 500 }}>{category.name}</td>
                        <td style={{ color: '#718096' }}>{category.description || '---'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-edit" 
                              onClick={() => handleEdit(category)}
                              title="Sửa danh mục"
                              disabled={isAdding || editingId}
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDelete(category.id)}
                              title="Xóa danh mục"
                              disabled={isAdding || editingId}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;

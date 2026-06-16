import React, { useState, useEffect } from 'react';
import { fetchCategories, createProduct } from '../../services/productService';
import { FiArrowLeft } from 'react-icons/fi';

const ProductForm = ({ onBack, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Dùng FormData để hỗ trợ upload file
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('categoryId', formData.categoryId);
      
      if (imageFile) {
        submitData.append('image', imageFile); // 'image' phải khớp với uploadCloud.single('image') ở Backend
      }

      await createProduct(submitData);
      setLoading(false);
      onSuccess(); // Trở về danh sách và báo thành công
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm.');
    }
  };

  return (
    <div className="product-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={onBack}>
          <FiArrowLeft size={20} />
        </button>
        <h2>Thêm sản phẩm mới</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Nhập tên sản phẩm..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giá (VND) *</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Số lượng tồn kho (Stock) *</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Danh mục</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ảnh đại diện (Cloudinary)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả chi tiết *</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            placeholder="Nhập mô tả sản phẩm..."
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang tải ảnh và lưu trữ...' : 'Lưu Sản Phẩm'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

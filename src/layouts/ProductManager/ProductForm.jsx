import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { FiArrowLeft } from 'react-icons/fi';

const ProductForm = ({ initialData, onBack, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    name_fr: initialData?.translations?.fr?.name || '',
    description: initialData?.description || '',
    description_fr: initialData?.translations?.fr?.description || '',
    price: initialData?.price ? String(initialData.price).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '',
    stock: initialData?.stock || '',
    categoryId: initialData?.categoryId || '',
    sizes: initialData?.sizes ? initialData.sizes.join(', ') : '',
  });
  const [imageFiles, setImageFiles] = useState([]);
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
    if (name === 'price') {
      const rawValue = value.replace(/\D/g, '');
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      setFormData((prev) => ({ ...prev, price: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
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
      submitData.append('price', formData.price.replace(/\./g, ''));
      submitData.append('stock', formData.stock);
      submitData.append('categoryId', formData.categoryId);
      if (formData.sizes.trim()) {
        submitData.append('sizes', formData.sizes);
      }
      
      const translations = { fr: {} };
      if (formData.name_fr) translations.fr.name = formData.name_fr;
      if (formData.description_fr) translations.fr.description = formData.description_fr;
      if (Object.keys(translations.fr).length > 0) {
        submitData.append('translations', JSON.stringify(translations));
      }
      
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach(file => {
          submitData.append('images', file);
        });
      }

      if (initialData) {
        await updateProduct(initialData.id, submitData);
      } else {
        await createProduct(submitData);
      }
      
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
        <h2>{initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
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
          <div className="form-group">
            <label>Tên sản phẩm (Tiếng Pháp)</label>
            <input 
              type="text" 
              name="name_fr" 
              value={formData.name_fr} 
              onChange={handleChange} 
              placeholder="Nhập tên sản phẩm bằng tiếng Pháp..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giá (VND) *</label>
            <input 
              type="text" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              placeholder="0"
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
            <label>Ảnh sản phẩm (Có thể chọn nhiều ảnh)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleFileChange} 
            />
            {imageFiles.length > 0 && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                Đã chọn {imageFiles.length} ảnh
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <label>Kích cỡ (Sizes) - Tùy chọn</label>
            <input 
              type="text" 
              name="sizes" 
              value={formData.sizes} 
              onChange={handleChange} 
              placeholder="Nhập các kích cỡ cách nhau bởi dấu phẩy (VD: S, M, L, XL)..."
            />
          </div>
        </div>

        <div className="form-row">
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
          <div className="form-group">
            <label>Mô tả chi tiết (Tiếng Pháp)</label>
            <textarea 
              name="description_fr" 
              value={formData.description_fr} 
              onChange={handleChange} 
              placeholder="Nhập mô tả bằng tiếng Pháp..."
            />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang tải ảnh và lưu trữ...' : (initialData ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

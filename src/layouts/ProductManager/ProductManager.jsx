import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../../services/productService';
import ProductForm from './ProductForm';
import { useAlert } from '../../context/AlertContext';
import { FiPlus, FiTrash2, FiEdit2, FiSearch } from 'react-icons/fi';
import './ProductManager.scss';

const ProductManager = () => {
  const { showConfirm, showAlert } = useAlert();
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
    if (isConfirmed) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        showAlert('Đã xóa sản phẩm thành công', 'Thành công', 'success');
      } catch (error) {
        showAlert('Có lỗi xảy ra khi xóa!', 'Lỗi', 'error');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsAdding(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdding) {
    return (
      <ProductForm 
        initialData={editingProduct}
        onBack={() => {
          setIsAdding(false);
          setEditingProduct(null);
        }} 
        onSuccess={() => {
          setIsAdding(false);
          setEditingProduct(null);
          loadProducts(); // Load lại danh sách sau khi thêm/sửa thành công
        }} 
      />
    );
  }

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Tất cả sản phẩm</h2>
        
        <div className="manager-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="header-search" style={{ 
            display: 'flex', alignItems: 'center', background: '#f4f7fe', 
            padding: '0.5rem 1rem', borderRadius: '30px', color: '#a3aed1'
          }}>
            <FiSearch style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: '#2b3674' }}
            />
          </div>
          <button className="btn-add" onClick={() => setIsAdding(true)}>
            <FiPlus size={20} /> Thêm Sản Phẩm Mới
          </button>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Danh mục</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-img" 
                      />
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.category?.name || '---'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(product)}
                          title="Sửa sản phẩm"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(product.id)}
                          title="Xóa sản phẩm"
                        >
                          <FiTrash2 size={18} />
                        </button>
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

export default ProductManager;

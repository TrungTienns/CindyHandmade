import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../../services/productService';
import ProductForm from './ProductForm';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './ProductManager.scss';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  if (isAdding) {
    return (
      <ProductForm 
        onBack={() => setIsAdding(false)} 
        onSuccess={() => {
          setIsAdding(false);
          loadProducts(); // Load lại danh sách sau khi thêm thành công
        }} 
      />
    );
  }

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Danh sách sản phẩm</h2>
        <button className="btn-add" onClick={() => setIsAdding(true)}>
          <FiPlus size={20} /> Thêm Sản Phẩm Mới
        </button>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
                </tr>
              ) : (
                products.map((product) => (
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
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(product.id)}
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 size={18} />
                      </button>
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

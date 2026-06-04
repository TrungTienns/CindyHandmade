import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import './FeaturedProducts.scss';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="featured-products">
      <div className="container">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        <p className="section-subtitle">Khám phá các sản phẩm thủ công tinh xảo nhất của chúng tôi</p>

        {loading ? (
          <div className="loading-spinner">Đang tải dữ liệu...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image-container">
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                  <div className="product-overlay">
                    <button 
                      className="btn-add-to-cart"
                      onClick={() => addToCart(product)}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

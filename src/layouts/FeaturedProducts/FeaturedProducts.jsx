import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../hooks/useCurrency';
import { fetchProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import './FeaturedProducts.scss';

const FeaturedProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/cart');
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const goToProductDetail = productId => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="featured-products">
      <div className="container">
        <h2 className="section-title">{t('featuredProducts.title')}</h2>
        <p className="section-subtitle">{t('featuredProducts.subtitle')}</p>

        {loading ? (
          <div className="loading-spinner">{t('featuredProducts.loading')}</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => goToProductDetail(product.id)}
              >
                <div className="product-image-container">
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-row">
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                  <div className="action-buttons">
                    <button className="btn-buy-now" onClick={e => handleBuyNow(e, product)}>
                      {t('featuredProducts.buyNow')}
                    </button>
                    <button className="btn-add-to-cart" onClick={e => handleAddToCart(e, product)}>
                      {t('featuredProducts.addToCart')}
                    </button>
                  </div>
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

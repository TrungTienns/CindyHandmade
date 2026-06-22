import React, { useState, useEffect, useContext } from 'react';
import './Shop.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { useCurrency } from '../../hooks/useCurrency';
import { useProductTranslation } from '../../hooks/useProductTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useAlert } from '../../context/Alert/AlertContext';

const Shop = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { getTranslatedProduct } = useProductTranslation();
  const { getTranslatedCategory } = useCategoryTranslation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        if (data.length > 0) {

        }
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadProducts();
    loadCategories();
  }, []);

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (!user) {
      showAlert(t('alerts.loginRequiredBuy', 'Vui lòng đăng nhập để mua sản phẩm này.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!user) {
      showAlert(t('alerts.loginRequiredCart', 'Vui lòng đăng nhập để thêm vào giỏ hàng.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    addToCart(product);
    showAlert(t('alerts.cartSuccess', 'Đã thêm sản phẩm vào giỏ hàng.'), t('alerts.successTitle', 'Thành công'), 'success');
  };

  const goToProductDetail = productId => {
    navigate(`/product/${productId}`);
  };

  const isNewProduct = createdAt => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };



  const displayedProducts = products.filter(p => {
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(p.categoryId);
    return inCategory;
  });

  return (
    <div className="shop-layout">
      <div className="shop-container">
        <h2 className="shop-title">{t('shop.allProducts', 'All Products')}</h2>
        
        <div className="shop-content">
          <div className="shop-filters">
            <h3>{t('shop.filters', 'Filters')}</h3>
            <div className="categories-list">
              <h4>{t('shop.categories', 'Categories')}</h4>
              {categoriesLoading ? (
                <p>{t('shop.loadingCategories', 'Loading...')}</p>
              ) : (
                <div className="checkbox-list">
                  {categories.map(category => {
                    const translatedCategory = getTranslatedCategory(category);
                    return (
                    <label key={category.id} className="checkbox-item">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      <span className="checkmark"></span>
                      <span className="label-text">{translatedCategory.name}</span>
                    </label>
                  )})}
                </div>
              )}
            </div>


          </div>
          
          <div className="shop-products">
            {loading ? (
              <p className="loading-text">{t('shop.loadingProducts', 'Loading products...')}</p>
            ) : (
              displayedProducts.map(p => {
                const product = getTranslatedProduct(p);
                return (
                  <div
                    className="shop-product-card product-card"
                    key={product.id}
                    onClick={() => goToProductDetail(product.id)}
                  >
                    <div className="product-image-container">
                      {isNewProduct(product.createdAt) && (
                        <div className="new-badge">New</div>
                      )}
                      <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price-row">
                        <p className="product-price">{formatPrice(product.price)}</p>
                      </div>
                      <div className="action-buttons">
                        <button className="btn-buy-now" onClick={e => handleBuyNow(e, product)}>
                          {t('featuredProducts.buyNow', 'Buy Now')}
                        </button>
                        <button className="btn-add-to-cart" onClick={e => handleAddToCart(e, product)}>
                          {t('featuredProducts.addToCart', 'Add to Cart')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

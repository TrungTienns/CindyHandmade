import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProductById } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useAlert } from '../../context/Alert/AlertContext';
import { useCurrency } from '../../hooks/useCurrency';
import { useProductTranslation } from '../../hooks/useProductTranslation';
import ProductCommitments from '../ProductCommitments/ProductCommitments';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { getTranslatedProduct } = useProductTranslation();
  const [productRaw, setProductRaw] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProductRaw(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage('https://via.placeholder.com/500');
        }
      } catch (error) {
        console.error('Failed to load product details', error);
      } finally {
        setLoading(false);
      }
    };

    // Scroll to top when loading a new product
    window.scrollTo(0, 0);
    loadProduct();
  }, [id]);

  const product = getTranslatedProduct(productRaw);

  useEffect(() => {
    let interval;
    if (product?.images && product.images.length > 1) {
      interval = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [product, selectedImage]);

  const handleNext = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setSelectedImage(product.images[nextIndex]);
  };

  const handlePrev = () => {
    if (!product?.images) return;
    const currentIndex = product.images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setSelectedImage(product.images[prevIndex]);
  };

  const handleBuyNow = async () => {
    if (!user) {
      showAlert(t('alerts.loginRequiredBuy', 'Vui lòng đăng nhập để mua sản phẩm này.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    if (product) {
      try {
        await addToCart(product);
        navigate('/cart');
      } catch (error) {
        showAlert(error.message || t('alerts.errorCart', 'Lỗi thêm vào giỏ hàng'), t('alerts.errorTitle', 'Lỗi'), 'error');
      }
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showAlert(t('alerts.loginRequiredCart', 'Vui lòng đăng nhập để thêm vào giỏ hàng.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    if (product) {
      try {
        await addToCart(product);
        showAlert(t('alerts.cartSuccess', 'Đã thêm sản phẩm vào giỏ hàng.'), t('alerts.successTitle', 'Thành công'), 'success');
      } catch (error) {
        showAlert(error.message || t('alerts.errorCart', 'Lỗi thêm vào giỏ hàng'), t('alerts.errorTitle', 'Lỗi'), 'error');
      }
    }
  };

  const isNewProduct = createdAt => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {loading ? (
          <div className="loading-spinner">{t('productDetail.loading')}</div>
        ) : !product ? (
          <div className="error-message">{t('productDetail.notFound')}</div>
        ) : (
          <>
          <div className="product-detail-wrapper">
            <div className="product-detail-image-section">
              {isNewProduct(product.createdAt) && (
                <div className="new-badge">New</div>
              )}
              <div className="main-image-container">
                {product.images && product.images.length > 1 && (
                  <button className="nav-button prev-button" onClick={handlePrev}>
                    <FiChevronLeft size={24} />
                  </button>
                )}
                <img 
                  key={selectedImage}
                  src={selectedImage || product.images?.[0] || 'https://via.placeholder.com/500'} 
                  alt={product.name} 
                  className="main-image" 
                />
                {product.images && product.images.length > 1 && (
                  <button className="nav-button next-button" onClick={handleNext}>
                    <FiChevronRight size={24} />
                  </button>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {product.images.map((imgUrl, index) => (
                    <img 
                      key={index} 
                      src={imgUrl} 
                      alt={`${product.name} ${index + 1}`} 
                      className={`thumbnail ${selectedImage === imgUrl ? 'active' : ''}`}
                      onClick={() => setSelectedImage(imgUrl)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="product-detail-info-section">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">{formatPrice(product.price)}</p>

              <div className="product-description">
                <h3>{t('productDetail.description')}</h3>
                <p>{product.description || t('productDetail.noDescription')}</p>
              </div>

              <div className="product-actions">
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  {t('productDetail.buyNow')}
                </button>
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  {t('productDetail.addToCart')}
                </button>
              </div>
            </div>
          </div>
          <ProductCommitments />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

import React, {
  useEffect, useState, useContext,
  useCallback, useMemo, memo, useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../hooks/useCurrency';
import { useProductTranslation } from '../../hooks/useProductTranslation';
import { fetchProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useAlert } from '../../context/Alert/AlertContext';
import { useLottie } from 'lottie-react';
import loadingProductAnimation from '../../assets/animations/loadingProduct.json';
import './FeaturedProducts.scss';

// ----- Skeleton Card -----
const SkeletonCard = () => (
  <div className="product-card skeleton">
    <div className="product-image-container skeleton-image" />
    <div className="product-info">
      <div className="skeleton-line" style={{ width: '70%' }} />
      <div className="skeleton-line" style={{ width: '40%' }} />
      <div className="skeleton-buttons">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </div>
  </div>
);

// ----- Product Card (memoized) -----
const ProductCard = memo(({ product, onBuyNow, onAddToCart, onDetail }) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const isNew = useMemo(() => {
    if (!product.createdAt) return false;
    const diff = Date.now() - new Date(product.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }, [product.createdAt]);

  return (
    <div
      className="product-card"
      onClick={() => onDetail(product.id)}
      role="button"
      tabIndex={0}
      aria-label={product.name}
    >
      <div className="product-image-container">
        {isNew && <div className="new-badge">{t('featuredProducts.new')}</div>}
        <img
          src={product.images?.[0] || 'https://placehold.co/500x500?text=No+Image'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
        <div className="action-buttons">
          <button
            className="btn-buy-now"
            onClick={(e) => onBuyNow(e, product)}
            aria-label={t('featuredProducts.buyNow')}
          >
            {t('featuredProducts.buyNow')}
          </button>
          <button
            className="btn-add-to-cart"
            onClick={(e) => onAddToCart(e, product)}
            aria-label={t('featuredProducts.addToCart')}
          >
            {t('featuredProducts.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// ----- Error Animation (memo) -----
const ErrorLottieView = memo(() => {
  const { View } = useLottie({
    animationData: loadingProductAnimation,
    loop: true,
  });
  return View;
});
ErrorLottieView.displayName = 'ErrorLottieView';

// ----- Main Component -----
const FeaturedProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { getTranslatedProduct } = useProductTranslation();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [products, setProducts] = useState([]);
  const abortRef = useRef(null);

  // Load products
  useEffect(() => {
    const abortController = new AbortController();
    abortRef.current = abortController;

    const load = async () => {
      setStatus('loading');
      try {
        const data = await fetchProducts({ signal: abortController.signal });
        // Sắp xếp theo createdAt mới nhất
        const sorted = [...data].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted);
        setStatus('success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load products', err);
          setStatus('error');
        }
      }
    };

    load();

    return () => {
      abortController.abort();
    };
  }, []);

  // Translated products (memoized)
  const translatedProducts = useMemo(
    () => products.map(p => getTranslatedProduct(p)),
    [products, getTranslatedProduct]
  );

  // Handlers (memoized)
  const handleBuyNow = useCallback((e, product) => {
    e.stopPropagation();
    if (!user) {
      showAlert(t('alerts.loginRequiredBuy', 'Vui lòng đăng nhập để mua sản phẩm này.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    addToCart(product);
    navigate('/cart');
  }, [addToCart, navigate, user, showAlert, t]);

  const handleAddToCart = useCallback((e, product) => {
    e.stopPropagation();
    if (!user) {
      showAlert(t('alerts.loginRequiredCart', 'Vui lòng đăng nhập để thêm vào giỏ hàng.'), t('alerts.infoTitle', 'Thông báo'), 'info');
      return;
    }
    addToCart(product);
    showAlert(t('alerts.cartSuccess', 'Đã thêm sản phẩm vào giỏ hàng.'), t('alerts.successTitle', 'Thành công'), 'success');
  }, [addToCart, user, showAlert, t]);

  const handleDetail = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Skeleton loading
  const skeletonCount = 6;
  const skeletonItems = Array.from({ length: skeletonCount }, (_, i) => (
    <SkeletonCard key={`skeleton-${i}`} />
  ));

  let content;
  if (status === 'loading') {
    content = <div className="product-grid">{skeletonItems}</div>;
  } else if (status === 'error') {
    content = (
      <div className="error-animation">
        <div className="error-lottie"><ErrorLottieView /></div>
        <p>{t('featuredProducts.error')}</p>
        <button
          className="btn-retry"
          onClick={() => window.location.reload()} // hoặc gọi lại fetch
        >
          {t('featuredProducts.retry')}
        </button>
      </div>
    );
  } else {
    content = (
      <div className="product-grid">
        {translatedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            onDetail={handleDetail}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="featured-products">
      <div className="container">
        <h2 className="section-title">{t('featuredProducts.title')}</h2>
        <p className="section-subtitle">{t('featuredProducts.subtitle')}</p>
        {content}
      </div>
    </section>
  );
};

export default FeaturedProducts;
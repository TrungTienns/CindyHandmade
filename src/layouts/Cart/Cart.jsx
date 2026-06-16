import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../common/path';
import { CartContext } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import './Cart.scss';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../hooks/useCurrency';
import { useProductTranslation } from '../../hooks/useProductTranslation';
import CheckoutStepper from '../../components/CheckoutStepper/CheckoutStepper';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { getTranslatedProduct } = useProductTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div className="cart-page-empty">
        <FiShoppingBag className="empty-icon" />
        <h2>{t('cart.pleaseLogin', 'Please Login')}</h2>
        <p>{t('cart.needToLogin', 'You need to login to view and manage your cart.')}</p>
        <button className="primary-btn" onClick={() => navigate(PATHS.LOGIN)}>
          {t('cart.loginNow', 'Login Now')}
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="cart-page-loading">{t('cart.loading', 'Loading cart...')}</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <FiShoppingBag className="empty-icon" />
        <h2>{t('cart.emptyCart', 'Your cart is empty')}</h2>
        <p>{t('cart.noProducts', 'There are no products in your cart yet.')}</p>
        <button className="primary-btn" onClick={() => navigate(PATHS.SHOP)}>
          {t('cart.continueShopping', 'Continue Shopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">{t('cart.title', 'Your Cart')}</h1>
        <CheckoutStepper currentStep={1} />

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => {
              const product = getTranslatedProduct(item.product);
              return (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {product?.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>

                <div className="item-details">
                  <h3 className="item-name">{product?.name}</h3>
                  <p className="item-price">{formatPrice(product?.price)}</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= product?.stock}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="item-subtotal">
                    {formatPrice(item.quantity * product?.price)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.productId)}
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )})}
          </div>

          <div className="cart-summary">
            <h2>{t('cart.total', 'Total')}</h2>
            <div className="summary-row">
              <span>{t('cart.subtotal', 'Subtotal')}:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>{t('cart.shipping', 'Shipping')}:</span>
              <span>{t('cart.free', 'Free')}</span>
            </div>
            <div className="summary-total">
              <span>{t('cart.total', 'Total')}:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <button className="checkout-btn">{t('cart.checkout', 'Proceed to Checkout')}</button>
            <button className="continue-shopping" onClick={() => navigate(PATHS.SHOP)}>
              {t('cart.continueShopping', 'Continue Shopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

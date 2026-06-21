import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useAlert } from '../../context/Alert/AlertContext';
import { PATHS } from '../../common/path';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from 'react-i18next';
import { useProductTranslation } from '../../hooks/useProductTranslation';
import CheckoutStepper from '../../components/CheckoutStepper/CheckoutStepper';
import './Checkout.scss';

const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  const { getTranslatedProduct } = useProductTranslation();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    address: '',
    paymentMethod: 'COD'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      navigate(PATHS.CART);
    }
  }, [cart, navigate, isSubmitting]);

  // Fetch Provinces
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  // Fetch Districts when Province changes
  useEffect(() => {
    if (formData.provinceCode) {
      fetch(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts || []))
        .catch(err => console.error("Error fetching districts:", err));
      
      // Reset district and ward
      setFormData(prev => ({
        ...prev,
        districtCode: '',
        districtName: '',
        wardCode: '',
        wardName: ''
      }));
      setWards([]);
    }
  }, [formData.provinceCode]);

  // Fetch Wards when District changes
  useEffect(() => {
    if (formData.districtCode) {
      fetch(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards || []))
        .catch(err => console.error("Error fetching wards:", err));
        
      // Reset ward
      setFormData(prev => ({
        ...prev,
        wardCode: '',
        wardName: ''
      }));
    }
  }, [formData.districtCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e, level) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const code = e.target.value;
    const text = selectedOption.text;

    if (level === 'province') {
      setFormData(prev => ({ ...prev, provinceCode: code, provinceName: text }));
    } else if (level === 'district') {
      setFormData(prev => ({ ...prev, districtCode: code, districtName: text }));
    } else if (level === 'ward') {
      setFormData(prev => ({ ...prev, wardCode: code, wardName: text }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.provinceName || !formData.districtName || !formData.wardName) {
      showAlert(t('checkout.selectFullAddressError', 'Please select Province/District/Ward'), t('alerts.warningTitle', 'Warning'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          province: formData.provinceName,
          district: formData.districtName,
          ward: formData.wardName,
          address: formData.address,
          paymentMethod: formData.paymentMethod
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(t('checkout.orderSuccess', 'Order placed successfully!'), t('alerts.successTitle', 'Success'), 'success');
        await fetchCart(); // Refresh cart (will be empty)
        navigate(PATHS.SHOP); // Redirect to shop or a success page
      } else {
        showAlert(data.message || t('checkout.orderError', 'Error placing order'), t('alerts.errorTitle', 'Error'), 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showAlert(t('checkout.generalError', 'An error occurred, please try again later.'), t('alerts.errorTitle', 'Error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutStepper currentStep={2} />

        <form onSubmit={handleSubmit} className="checkout-content">
          {/* Cột trái: Form thông tin */}
          <div className="checkout-form-section">
            <h2>{t('checkout.shippingInfo', 'Shipping Information')}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('checkout.fullName', 'Full Name *')}</label>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder={t('checkout.fullNamePlaceholder', 'Enter your full name')}
                />
              </div>
              <div className="form-group">
                <label>{t('checkout.phone', 'Phone Number *')}</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder={t('checkout.phonePlaceholder', 'Enter your phone number')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('checkout.province', 'Province/City *')}</label>
                <select 
                  required 
                  value={formData.provinceCode} 
                  onChange={(e) => handleSelectChange(e, 'province')}
                >
                  <option value="">{t('checkout.selectProvince', '-- Select Province/City --')}</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('checkout.district', 'District *')}</label>
                <select 
                  required 
                  value={formData.districtCode} 
                  onChange={(e) => handleSelectChange(e, 'district')}
                  disabled={!formData.provinceCode}
                >
                  <option value="">{t('checkout.selectDistrict', '-- Select District --')}</option>
                  {districts.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('checkout.ward', 'Ward *')}</label>
                <select 
                  required 
                  value={formData.wardCode} 
                  onChange={(e) => handleSelectChange(e, 'ward')}
                  disabled={!formData.districtCode}
                >
                  <option value="">{t('checkout.selectWard', '-- Select Ward --')}</option>
                  {wards.map(w => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{t('checkout.specificAddress', 'Specific Address (House No, Street) *')}</label>
              <textarea 
                name="address" 
                required 
                value={formData.address} 
                onChange={handleChange} 
                placeholder={t('checkout.addressPlaceholder', 'E.g., No. 10, Alley 20, ABC Street')}
              ></textarea>
            </div>

            <div className="payment-methods">
              <h2>{t('checkout.paymentMethod', 'Payment Method')}</h2>
              <div className={`payment-option ${formData.paymentMethod === 'COD' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  id="cod" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={formData.paymentMethod === 'COD'} 
                  onChange={handleChange} 
                />
                <label htmlFor="cod">{t('checkout.cod', 'Cash on Delivery (COD)')}</label>
              </div>
              {/* Thêm các phương thức khác ở đây nếu cần */}
            </div>
          </div>

          {/* Cột phải: Summary */}
          <div className="checkout-summary-section">
            <h2>{t('checkout.yourOrder', 'Your Order')}</h2>
            
            <div className="summary-items">
              {cart.map(item => {
                const product = getTranslatedProduct(item.product);
                return (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <p>{product?.name}</p>
                      <span>{t('checkout.quantity', 'Quantity: ')}{item.quantity}</span>
                    </div>
                    <div className="item-price">
                      {formatPrice(product?.price * item.quantity)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>{t('checkout.subtotal', 'Subtotal:')}</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="total-row">
                <span>{t('checkout.shippingFee', 'Shipping Fee:')}</span>
                <span>{t('checkout.free', 'Free')}</span>
              </div>
              <div className="total-row final-total">
                <span>{t('checkout.total', 'Total:')}</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn" disabled={isSubmitting}>
              {isSubmitting ? t('checkout.processing', 'Processing...') : t('checkout.placeOrder', 'Place Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

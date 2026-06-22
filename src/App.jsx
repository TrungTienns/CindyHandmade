import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/Alert/AlertContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { PATHS } from './common/path';

// Lazy loading pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage/AboutUsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'));
const FaqPage = lazy(() => import('./pages/FaqPage/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage/SignUpPage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage/PrivacyPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentResultPage/PaymentSuccessPage'));
const PaymentQRPage = lazy(() => import('./pages/PaymentQRPage/PaymentQRPage'));
const PaymentFailedPage = lazy(() => import('./pages/PaymentResultPage/PaymentFailedPage'));

function App() {
  // Prevent browser from restoring scroll position on reload (F5)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <AlertProvider>
      <AuthProvider>
        <CartProvider>
        <Router>
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#64748b' }}>Loading...</div>}>
            <Routes>
              <Route path={PATHS.HOME} element={<HomePage />} />
              <Route path={PATHS.SHOP} element={<ShopPage />} />
              <Route path={PATHS.ABOUT} element={<AboutUsPage />} />
              <Route path={PATHS.FAQ} element={<FaqPage />} />
              <Route path={PATHS.CONTACT} element={<ContactPage />} />
              <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailPage />} />
              <Route path={PATHS.LOGIN} element={<LoginPage />} />
              <Route path={PATHS.REGISTER} element={<SignUpPage />} />
              <Route path={PATHS.CART} element={<CartPage />} />
              <Route path={PATHS.PRIVACY_POLICY} element={<PrivacyPage />} />
              <Route path={PATHS.PAYMENT_SUCCESS} element={<PaymentSuccessPage />} />
              <Route path={PATHS.PAYMENT_QR} element={<PaymentQRPage />} />
              <Route path={PATHS.PAYMENT_FAILED} element={<PaymentFailedPage />} />
              
              {/* Checkout Route - Protected */}
              <Route
                path={PATHS.CHECKOUT}
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Profile Route - Protected */}
              <Route
                path={PATHS.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Route */}
              <Route
                path={PATHS.ADMIN}
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;

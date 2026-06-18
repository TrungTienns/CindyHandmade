import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomePage from './pages/HomePage/HomePage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import FaqPage from './pages/FaqPage/FaqPage';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import AdminPage from './pages/AdminPage/AdminPage';
import CartPage from './pages/CartPage/CartPage';
import ShopPage from './pages/ShopPage/ShopPage';
import { CartProvider } from './context/CartContext';
import { PATHS } from './common/path';

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
        </Router>
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;

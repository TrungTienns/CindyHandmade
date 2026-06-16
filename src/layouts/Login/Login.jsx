import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PATHS } from '../../common/path';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

import './Login.scss';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t('login.empty_fields', 'Vui lòng điền đầy đủ thông tin.'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('login.invalid_email', 'Email không hợp lệ.'));
      return;
    }

    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate(PATHS.ADMIN || '/admin');
      } else {
        navigate(PATHS.HOME);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-login-page">
      {/* Dynamic Background Elements */}
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
      <div className="ambient-light light-3"></div>

      <div className="glass-card">
        <div className="card-left">
          <div className="brand-section">
            <h1 className="brand-logo">Cindy Handmade</h1>
            <p className="brand-tagline">
              {t('login.tagline', 'Crafting beautiful moments, one stitch at a time.')}
            </p>
          </div>
          <div className="abstract-art">
            <div className="circle circle-sm"></div>
            <div className="circle circle-md"></div>
            <div className="circle circle-lg"></div>
          </div>
        </div>

        <div className="card-right">
          <div className="form-header">
            <h2>{t('login.welcome_back', 'Welcome Back')}</h2>
            <p>{t('login.subtitle', 'Please enter your details to sign in.')}</p>
          </div>

          {error && (
            <div className="error-toast">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="input-group">
              <label htmlFor="email">{t('login.email', 'Email Address')}</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('login.email_placeholder', 'Enter your email')}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">{t('login.password', 'Password')}</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('login.password_placeholder', 'Enter your password')}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>{t('login.remember', 'Remember me')}</span>
              </label>
              <a href="#" className="forgot-password">
                {t('login.forgot', 'Forgot password?')}
              </a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              <span>
                {loading ? t('login.processing', 'Processing...') : t('login.sign_in', 'Sign In')}
              </span>
              {!loading && <FiArrowRight className="arrow-icon" />}
            </button>
          </form>



          <p className="signup-link">
            {t('login.no_account', "Don't have an account?")}{' '}
            <a href="/register">{t('login.sign_up', 'Sign up for free')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

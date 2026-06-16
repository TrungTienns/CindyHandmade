import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PATHS } from '../../common/path';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

import './SignUp.scss';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(t('signup.empty_fields', 'Vui lòng điền đầy đủ thông tin.'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('signup.invalid_email', 'Email không hợp lệ.'));
      return;
    }

    if (password.length < 6) {
      setError(t('signup.short_password', 'Mật khẩu phải có ít nhất 6 ký tự.'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('signup.password_mismatch', 'Mật khẩu xác nhận không khớp.'));
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate(PATHS.HOME);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-signup-page">
      {/* Dynamic Background Elements */}
      <div className="ambient-light light-1"></div>
      <div className="ambient-light light-2"></div>
      <div className="ambient-light light-3"></div>

      <div className="glass-card">
        <div className="card-left">
          <div className="brand-section">
            <h1 className="brand-logo">Cindy Handmade</h1>
            <p className="brand-tagline">
              {t('signup.tagline', 'Join our community of craft lovers and start your journey today.')}
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
            <h2>{t('signup.create_account', 'Create Account')}</h2>
            <p>{t('signup.subtitle', 'Please enter your details to sign up.')}</p>
          </div>

          {error && (
            <div className="error-toast">
              <span className="error-icon">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="input-group">
              <label htmlFor="name">{t('signup.name', 'Full Name')}</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('signup.name_placeholder', 'Enter your full name')}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">{t('signup.email', 'Email Address')}</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('signup.email_placeholder', 'Enter your email')}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">{t('signup.password', 'Password')}</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('signup.password_placeholder', 'Create a password')}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">{t('signup.confirm_password', 'Confirm Password')}</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={t('signup.confirm_password_placeholder', 'Confirm your password')}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              <span>
                {loading ? t('signup.processing', 'Processing...') : t('signup.sign_up', 'Sign Up')}
              </span>
              {!loading && <FiArrowRight className="arrow-icon" />}
            </button>
          </form>



          <p className="login-link">
            {t('signup.already_have_account', 'Already have an account?')}{' '}
            <a href="/login">{t('signup.sign_in', 'Sign in')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

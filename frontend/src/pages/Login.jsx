import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, CheckSquare } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  
  const { login, user, error, clearError, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check for registration success message
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessInfo(location.state.successMessage);
      // Clear the history state so the message doesn't repeat on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Clear context errors on mount/unmount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      // Handled by AuthContext error state
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setFormError('');
      // Send the signed ID Token payload to the backend
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setFormError(err.message || 'Google Sign-in failed');
    }
  };

  const handleGoogleError = () => {
    setFormError('Google Sign-in failed. Please try again.');
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to manage your tasks</p>
          </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {successInfo && (
            <div className="success-banner animate-fade-in">
              <span>{successInfo}</span>
              <button type="button" className="success-banner-close" onClick={() => setSuccessInfo('')} aria-label="Close notification">&times;</button>
            </div>
          )}
          <ErrorMessage message={formError || error} onClose={() => { setFormError(''); clearError(); }} />

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="google-divider">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="360"
            />
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
    <footer className="dashboard-footer">
      <div className="footer-content">
        <span>&copy; {new Date().getFullYear()} TaskManager. All rights reserved.</span>
        <span className="footer-divider">|</span>
        <span className="footer-handcrafted">Handcrafted for INDPRO</span>
      </div>
    </footer>
  </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CheckSquare } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';
import '../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  // OTP States
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');

  const { register, user, error, clearError, loading, loginWithGoogle, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Clear context errors on mount/unmount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (username.trim().length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      const data = await register(username.trim(), email.trim(), password);
      // Save the email to transition to the OTP view
      setRegisteredEmail(data.email || email.trim());
    } catch (err) {
      // Handled by AuthContext error state
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setFormError('Please enter a valid 6-digit OTP code');
      return;
    }

    try {
      await verifyOTP(registeredEmail, otp.trim());
      navigate('/login', { state: { successMessage: 'Account verified successfully! You can now log in.' } });
    } catch (err) {
      // Handled by AuthContext error state
    }
  };

  const handleResendOTP = async () => {
    setFormError('');
    try {
      const res = await resendOTP(registeredEmail);
      alert(res.message || 'Verification code resent successfully!');
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
          {registeredEmail ? (
            <>
              <div className="auth-header">
                <h1 className="auth-title">Verify Your Email</h1>
              <p className="auth-subtitle">
                We sent a 6-digit verification code to <strong>{registeredEmail}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="auth-form">
              <ErrorMessage message={formError || error} onClose={() => { setFormError(''); clearError(); }} />

              <div className="form-group">
                <label className="form-label" htmlFor="otp-input">Verification Code</label>
                <input
                  id="otp-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  style={{ paddingLeft: '14px', textAlign: 'center', letterSpacing: '0.3em', fontSize: '18px', fontWeight: '700' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" className="move-btn" onClick={handleResendOTP} style={{ padding: '8px 12px' }}>
                Resend Code
              </button>
              <button type="button" className="move-btn" onClick={() => { setRegisteredEmail(''); setOtp(''); }} style={{ padding: '8px 12px' }}>
                Back to Signup
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Register to begin tracking your work</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <ErrorMessage message={formError || error} onClose={() => { setFormError(''); clearError(); }} />

              <div className="form-group">
                <label className="form-label" htmlFor="username-input">Username</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={16} />
                  <input
                    id="username-input"
                    type="text"
                    className="form-input"
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} />
                  <input
                    id="confirm-password-input"
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
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
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </div>
          </>
        )}
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

export default Register;

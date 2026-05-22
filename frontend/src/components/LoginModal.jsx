import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldAlert, ShieldOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsBlocked(false);

    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (isRegister) {
      if (!name) {
        setErrorMsg('Please enter your name');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      let loggedInUser;
      if (isRegister) {
        loggedInUser = await register(name, email, password);
      } else {
        loggedInUser = await login(email, password);
      }
      if (onLoginSuccess && loggedInUser) {
        onLoginSuccess(loggedInUser);
      }
      onClose();
    } catch (err) {
      const msg = err.message || 'Authentication failed';
      // Detect blocked account from the backend 403 message
      if (msg.toLowerCase().includes('blocked') || msg.toLowerCase().includes('suspended')) {
        setIsBlocked(true);
        setErrorMsg('Your account has been suspended. Please contact support at helpcleaning@gmail.com.');
      } else {
        setErrorMsg(msg);
      }
    }
    setLoading(false);
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setErrorMsg('');
    setIsBlocked(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal-box animate-scale-in">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Sign up to start booking custom home services' : 'Sign in to manage bookings and payment invoices'}</p>
        </div>

        {errorMsg && (
          <div className={`alert ${isBlocked ? 'alert-blocked' : 'alert-error'}`}>
            {isBlocked ? <ShieldOff size={16} /> : <ShieldAlert size={16} />}
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="e.g. john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading || isBlocked}>
            {loading ? 'Processing...' : isRegister ? 'CREATE ACCOUNT' : 'LOG IN'}
          </button>
        </form>

        <div className="auth-toggle-footer">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button className="auth-link-btn" onClick={() => switchMode(false)}>
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button className="auth-link-btn" onClick={() => switchMode(true)}>
                Register now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

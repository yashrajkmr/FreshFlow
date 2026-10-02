// FreshFlow Enterprise Authentication Modal (Login & Staff Registration)
// Implements Tabbed Auth, Role Selection, and 1-Click Demo Profiles for interview ease
import React, { useState } from 'react';
import axios from 'axios';

const DEMO_ACCOUNTS = [
  {
    label: 'Lead Operations Manager',
    badge: 'Operations Lead',
    icon: 'fa-user-tie',
    username: 'manager',
    password: 'freshflow123',
    desc: 'Authorized to approve markdowns & edit perishable inventory'
  },
  {
    label: 'System Administrator',
    badge: 'Admin',
    icon: 'fa-shield-halved',
    username: 'admin',
    password: 'admin123',
    desc: 'Full regional access across all warehouse & store hubs'
  },
  {
    label: 'Inventory Clerk',
    badge: 'Store Clerk',
    icon: 'fa-clipboard-check',
    username: 'clerk',
    password: 'clerk123',
    desc: 'Audit stock counts & log expiry observations'
  }
];

function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('manager');
  const [loginPassword, setLoginPassword] = useState('freshflow123');

  // Register Form State
  const [regData, setRegData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    staffId: '',
    role: 'Store Operations Lead',
    department: 'Dairy & Perishables',
    storeLocation: 'Christ University Central Hub, Bangalore'
  });

  if (!isOpen) return null;

  function triggerShake(msg) {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }

  // Handle Login Submission
  async function handleLogin(e) {
    if (e) e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !loginPassword) {
      triggerShake('Please enter both your username/email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', {
        username: loginIdentifier.trim(),
        password: loginPassword
      });

      const { token, user, message } = res.data;
      showToast(message || `Logged in as ${user.name}`, 'success');
      onAuthSuccess({ token, user });
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.error || 'Authentication failed. Please verify credentials.';
      triggerShake(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Quick 1-Click Demo Login
  async function handleQuickDemo(demo) {
    setLoginIdentifier(demo.username);
    setLoginPassword(demo.password);
    setError('');
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', {
        username: demo.username,
        password: demo.password
      });
      const { token, user, message } = res.data;
      showToast(message || `Demo session active: ${user.name}`, 'success');
      onAuthSuccess({ token, user });
      onClose();
    } catch (err) {
      console.error('Quick demo login error:', err);
      triggerShake(err.response?.data?.error || 'Failed to authenticate demo account.');
    } finally {
      setLoading(false);
    }
  }

  // Handle Registration Submission
  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    if (!regData.name.trim() || !regData.username.trim() || !regData.email.trim() || !regData.password) {
      triggerShake('Please fill out all required fields marked with *');
      return;
    }

    if (regData.password.length < 6) {
      triggerShake('Password must be at least 6 characters long.');
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      triggerShake('Passwords do not match. Please retype carefully.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', {
        name: regData.name.trim(),
        username: regData.username.trim(),
        email: regData.email.trim(),
        password: regData.password,
        staffId: regData.staffId.trim() || undefined,
        role: regData.role,
        department: regData.department,
        storeLocation: regData.storeLocation
      });

      const { token, user, message } = res.data;
      showToast(message || `Account created! Welcome, ${user.name}`, 'success');
      onAuthSuccess({ token, user });
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.response?.data?.error || 'Failed to register account.';
      triggerShake(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className={`auth-modal-panel ${isShaking ? 'shake' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="authModalTitle"
      >
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-row">
            <div className="auth-brand-badge">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div>
              <h3 id="authModalTitle" className="auth-title">FreshFlow Staff Portal</h3>
              <p className="auth-subtitle">Perishable Inventory & Dynamic Markdown Authorization</p>
            </div>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Register New Staff</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {/* ── TAB 1: LOGIN ── */}
        {activeTab === 'login' && (
          <div className="auth-body">
            {/* Quick 1-Click Demo Profiles (For Interviewers!) */}
            <div className="auth-demo-section">
              <div className="demo-section-header">
                <span className="demo-section-title">
                  <i className="fa-solid fa-bolt text-warning"></i> 1-Click Demo Personas (Interview Demo)
                </span>
                <span className="demo-section-hint">Instant login credentials</span>
              </div>
              <div className="demo-chips-grid">
                {DEMO_ACCOUNTS.map((demo) => (
                  <button
                    key={demo.username}
                    type="button"
                    className="demo-persona-card"
                    onClick={() => handleQuickDemo(demo)}
                    disabled={loading}
                    title={`Log in as ${demo.label}`}
                  >
                    <div className="demo-card-top">
                      <i className={`fa-solid ${demo.icon} demo-card-icon`}></i>
                      <span className="demo-card-badge">{demo.badge}</span>
                    </div>
                    <span className="demo-card-name">{demo.label}</span>
                    <span className="demo-card-sub">{demo.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-divider-line">
              <span>or enter credentials manually</span>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group-restrained">
                <label htmlFor="loginIdentifier" className="form-label-compact">
                  Username or Staff Email <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-user input-icon"></i>
                  <input
                    id="loginIdentifier"
                    type="text"
                    className="field-input field-has-icon"
                    placeholder="e.g. manager or manager@freshflow.internal"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-restrained">
                <div className="label-row-split">
                  <label htmlFor="loginPassword" className="form-label-compact">
                    Password <span className="req">*</span>
                  </label>
                  <button
                    type="button"
                    className="btn-text-ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input
                    id="loginPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="field-input field-has-icon"
                    placeholder="Enter account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    <span>Sign In to Console</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 2: REGISTER / SIGN UP ── */}
        {activeTab === 'register' && (
          <div className="auth-body">
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-grid-2col">
                <div className="form-group-restrained">
                  <label className="form-label-compact">Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Priya Sharma"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-restrained">
                  <label className="form-label-compact">Staff ID (Optional)</label>
                  <input
                    type="text"
                    className="field-input font-mono"
                    placeholder="e.g. FF-MGR-02 (Auto if blank)"
                    value={regData.staffId}
                    onChange={(e) => setRegData({ ...regData, staffId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group-restrained">
                  <label className="form-label-compact">Username <span className="req">*</span></label>
                  <input
                    type="text"
                    className="field-input font-mono"
                    placeholder="e.g. priya_ops"
                    value={regData.username}
                    onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-restrained">
                  <label className="form-label-compact">Corporate Email <span className="req">*</span></label>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="priya@freshflow.internal"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group-restrained">
                  <label className="form-label-compact">Assigned Role</label>
                  <select
                    className="field-input"
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                  >
                    <option value="Store Operations Lead">Store Operations Lead</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Inventory Auditor">Inventory Auditor</option>
                    <option value="Inventory Clerk">Inventory Clerk</option>
                    <option value="Store Associate">Store Associate</option>
                  </select>
                </div>

                <div className="form-group-restrained">
                  <label className="form-label-compact">Department / Section</label>
                  <select
                    className="field-input"
                    value={regData.department}
                    onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                  >
                    <option value="Dairy & Perishables">Dairy & Perishables</option>
                    <option value="Produce Section">Produce Section</option>
                    <option value="Bakery Counter">Bakery Counter</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Frozen Food">Frozen Food</option>
                    <option value="Store Operations">All Departments</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="form-group-restrained">
                  <label className="form-label-compact">Password <span className="req">*</span> (min 6 chars)</label>
                  <input
                    type="password"
                    className="field-input"
                    placeholder="Create a strong password"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-restrained">
                  <label className="form-label-compact">Confirm Password <span className="req">*</span></label>
                  <input
                    type="password"
                    className="field-input"
                    placeholder="Re-enter password"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Registering Account in MongoDB...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-check"></i>
                    <span>Complete Staff Registration</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;

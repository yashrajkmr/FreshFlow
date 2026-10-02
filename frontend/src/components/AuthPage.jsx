// FreshFlow Dedicated Enterprise Authentication Page (Split-Screen Modern SaaS Standard)
// Features cinematic supermarket store manager photography, live operational badges, 1-Click Demo Personas, and secure JWT / Bcrypt authentication
import React, { useState } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  Building2,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Store,
  Layers,
  ChevronRight
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    roleId: 'manager',
    title: 'Lead Operations Manager',
    name: 'Yashraj Kumar',
    username: 'manager',
    password: 'freshflow123',
    badge: 'Store Lead',
    color: '#10B981',
    desc: 'Authorized to approve tiered markdowns, configure elasticity, & manage store inventory.'
  },
  {
    roleId: 'admin',
    title: 'Regional System Admin',
    name: 'Admin Supervisor',
    username: 'admin',
    password: 'admin123',
    badge: 'Admin',
    color: '#06B6D4',
    desc: 'Full regional access across all warehouse distribution centers and retail store hubs.'
  },
  {
    roleId: 'clerk',
    title: 'Inventory Auditor & Clerk',
    name: 'Rohan Verma',
    username: 'clerk',
    password: 'clerk123',
    badge: 'Inventory Clerk',
    color: '#F59E0B',
    desc: 'Conducts shelf stock audits, logs physical observations, and validates batch barcodes.'
  }
];

export default function AuthPage({ onAuthSuccess, onNavigateToDashboard, showToast, currentManager }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('freshflow123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Store Operations Lead');
  const [regDepartment, setRegDepartment] = useState('Dairy & Perishables');
  const [regLocation, setRegLocation] = useState('FreshFlow Flagship Store #104, Bangalore');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide your username/email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', {
        username: username.trim(),
        password
      });

      const { token, user, message } = res.data;
      showToast(message || `Welcome back, ${user.name}!`, 'success');
      onAuthSuccess({ token, user });
      onNavigateToDashboard();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Login (Crucial for Interviewers)
  const handleQuickDemoSelect = async (demo) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setError('');

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', {
        username: demo.username,
        password: demo.password
      });

      const { token, user, message } = res.data;
      showToast(message || `Authenticated as ${user.name} (${user.role})`, 'success');
      onAuthSuccess({ token, user });
      onNavigateToDashboard();
    } catch (err) {
      console.error('Demo auth error:', err);
      setError(err.response?.data?.error || 'Failed to authenticate demo account.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', {
        name: regName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        department: regDepartment,
        storeLocation: regLocation
      });

      const { token, user, message } = res.data;
      showToast(message || `Staff account created! Welcome to FreshFlow, ${user.name}.`, 'success');
      onAuthSuccess({ token, user });
      onNavigateToDashboard();
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.error || 'Failed to register account in MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* ── SPLIT LAYOUT ── */}
      <div className="auth-split-grid">
        {/* ── LEFT SHOWCASE PANEL ── */}
        <div className="auth-showcase-panel">
          <div className="showcase-bg-image-wrapper">
            <img
              src="/images/store-manager.jpg"
              alt="FreshFlow Supermarket Store Manager"
              className="showcase-bg-image"
            />
            <div className="showcase-gradient-overlay"></div>
          </div>

          <div className="showcase-content">
            <div className="showcase-top-badge">
              <span className="pulse-dot"></span>
              ENTERPRISE STORE HUB #01 • BANGALORE CENTRAL
            </div>

            <div className="showcase-quote-box">
              <p className="showcase-quote-text">
                &ldquo;FreshFlow automated our daily perishable clearance routines. What used to take two hours of manual tagging now happens dynamically in seconds, protecting 99.4% of our perishable margin.&rdquo;
              </p>
              <div className="showcase-author-row">
                <div className="author-avatar">YK</div>
                <div>
                  <div className="author-name">Yashraj Kumar</div>
                  <div className="author-role">Store Operations Lead & Systems Architect</div>
                </div>
              </div>
            </div>

            {/* Live Operational Metric Chips */}
            <div className="showcase-telemetry-chips">
              <div className="telemetry-pill">
                <span className="pill-metric tnum">99.4%</span>
                <span className="pill-title">Sell-Through Velocity</span>
              </div>
              <div className="telemetry-pill">
                <span className="pill-metric tnum text-emerald">&lt; 42ms</span>
                <span className="pill-title">POS Sync Latency</span>
              </div>
              <div className="telemetry-pill">
                <span className="pill-metric tnum text-amber">30 SKUs</span>
                <span className="pill-title">Active Live Batch Feed</span>
              </div>
            </div>

            <div className="showcase-security-footer">
              <span className="sec-chip"><ShieldCheck size={13} className="text-emerald" /> Stateless JWT (HS256)</span>
              <span className="sec-chip"><Lock size={13} className="text-cyan" /> Salted Bcrypt (10 Rounds)</span>
              <span className="sec-chip"><UserCheck size={13} className="text-amber" /> RBAC Multi-Role Gating</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT AUTHENTICATION TERMINAL ── */}
        <div className="auth-terminal-panel">
          <div className="terminal-card">
            {/* Brand Header */}
            <div className="terminal-brand-header">
              <div className="brand-logo-badge">
                <Zap size={22} className="text-emerald" />
              </div>
              <div>
                <h2 className="terminal-title">FreshFlow Staff Portal</h2>
                <p className="terminal-desc">
                  Autonomous Dynamic Pricing & Perishable Inventory Control
                </p>
              </div>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="auth-segmented-control">
              <button
                type="button"
                className={`segment-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Sign In to Console
              </button>
              <button
                type="button"
                className={`segment-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                Register New Staff
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="auth-error-chip">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* ── MODE 1: SIGN IN ── */}
            {mode === 'login' && (
              <div className="auth-form-container">
                {/* 1-Click Demo Personas (Interview Hero Feature) */}
                <div className="demo-personas-box">
                  <div className="personas-header">
                    <span className="personas-title">
                      <Sparkles size={14} className="text-amber" />
                      1-Click Interview Demo Personas:
                    </span>
                    <span className="personas-hint">Select a role to instantly sign in</span>
                  </div>

                  <div className="persona-cards-grid">
                    {DEMO_PERSONAS.map((demo) => (
                      <button
                        key={demo.username}
                        type="button"
                        onClick={() => handleQuickDemoSelect(demo)}
                        disabled={loading}
                        className="persona-card-item"
                      >
                        <div className="persona-card-top">
                          <span className="persona-badge" style={{ color: demo.color, borderColor: `${demo.color}44`, background: `${demo.color}15` }}>
                            {demo.badge}
                          </span>
                          <ChevronRight size={13} className="text-dim" />
                        </div>
                        <div className="persona-name">{demo.name}</div>
                        <div className="persona-desc">{demo.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="auth-separator">
                  <span>or enter credentials manually</span>
                </div>

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="terminal-form">
                  <div className="form-group-field">
                    <label className="field-label">Username or Staff Email</label>
                    <div className="field-input-box">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. manager or manager@freshflow.internal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="field-native-input"
                      />
                    </div>
                  </div>

                  <div className="form-group-field">
                    <div className="label-with-action">
                      <label className="field-label">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn-toggle-eye"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="field-input-box">
                      <Lock size={15} className="field-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password (default: freshflow123)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="field-native-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-submit-terminal"
                  >
                    {loading ? (
                      <span>Verifying Session in MongoDB...</span>
                    ) : (
                      <>
                        <span>Sign In to Mission Control</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ── MODE 2: REGISTER NEW STAFF ── */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="terminal-form">
                <div className="form-row-duo">
                  <div className="form-group-field">
                    <label className="field-label">Full Name *</label>
                    <div className="field-input-box">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        className="field-native-input"
                      />
                    </div>
                  </div>

                  <div className="form-group-field">
                    <label className="field-label">Username *</label>
                    <div className="field-input-box">
                      <span className="field-prefix">@</span>
                      <input
                        type="text"
                        placeholder="e.g. priya_lead"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required
                        className="field-native-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Corporate Email Address *</label>
                  <div className="field-input-box">
                    <Mail size={15} className="field-icon" />
                    <input
                      type="email"
                      placeholder="e.g. priya@freshflow.internal"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="field-native-input"
                    />
                  </div>
                </div>

                <div className="form-row-duo">
                  <div className="form-group-field">
                    <label className="field-label">Operational Role</label>
                    <div className="field-input-box">
                      <Building2 size={15} className="field-icon" />
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="field-native-input select-native"
                      >
                        <option value="Store Operations Lead">Store Operations Lead</option>
                        <option value="System Administrator">System Administrator</option>
                        <option value="Inventory Clerk">Inventory Clerk</option>
                        <option value="Shift Supervisor">Shift Supervisor</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-field">
                    <label className="field-label">Assigned Department</label>
                    <div className="field-input-box">
                      <Layers size={15} className="field-icon" />
                      <select
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="field-native-input select-native"
                      >
                        <option value="Dairy & Perishables">Dairy & Perishables</option>
                        <option value="Bakery & Pastry">Bakery & Pastry</option>
                        <option value="Fresh Produce">Fresh Produce</option>
                        <option value="Meat & Butchery">Meat & Butchery</option>
                        <option value="Seafood & Deli">Seafood & Deli</option>
                        <option value="Store Operations">All Store Sections</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Password (min 6 characters) *</label>
                  <div className="field-input-box">
                    <Lock size={15} className="field-icon" />
                    <input
                      type="password"
                      placeholder="Create secure staff password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="field-native-input"
                    />
                  </div>
                </div>

                <div className="form-group-field">
                  <label className="field-label">Assigned Supermarket Location</label>
                  <div className="field-input-box">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      className="field-native-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit-terminal"
                >
                  {loading ? (
                    <span>Registering Account in MongoDB...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Issue JWT</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Guest Bypass */}
            <div className="terminal-bypass-row">
              <span>Already testing the application?</span>
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="btn-bypass-link"
              >
                Continue to Mission Control as Guest <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

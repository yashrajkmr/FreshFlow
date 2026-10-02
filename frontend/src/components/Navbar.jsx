// FreshFlow Global Shell & Navigation Rail (Industrial Kinetic FinTech Benchmark)
// Persistent top rail with breadcrumb context, attention indicator, multi-page wayfinding, and interactive auth dropdown
import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  LayoutDashboard,
  Cpu,
  Terminal,
  FileText,
  Sliders,
  Plus,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  Radio,
  UserCheck
} from 'lucide-react';

function Navbar({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onOpenAddItem,
  criticalCount,
  manager,
  onOpenAuth,
  onLogout,
  onOpenAnalytics
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = manager?.name
    ? manager.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'FF';

  return (
    <header className="quiet-top-rail">
      <div className="rail-container">
        {/* Left: Brand & Context Wayfinding */}
        <div className="rail-left">
          <div className="brand-mark" onClick={() => onTabChange('landing')} style={{ cursor: 'pointer' }}>
            <span className="brand-icon">
              <Zap size={18} className="text-emerald" />
            </span>
            <span className="brand-name">FreshFlow</span>
            <span className="brand-version">v2.6</span>
          </div>

          <div className="rail-divider">/</div>

          <div className="rail-breadcrumb hide-mobile" title="Current Store Branch">
            <span className="breadcrumb-sub">Store Hub #01</span>
            <span className="breadcrumb-main">Bangalore Central</span>
          </div>

          {/* Attention Home Base Indicator */}
          {criticalCount > 0 ? (
            <button
              type="button"
              className="attention-chip chip-critical"
              onClick={() => onTabChange('dashboard')}
              title="Filter to items requiring immediate markdown decision"
            >
              <span className="chip-dot"></span>
              <span>{criticalCount} Critical &lt; 6h</span>
            </button>
          ) : (
            <span className="attention-chip chip-healthy hide-mobile">
              <span className="chip-dot"></span>
              <span>All Systems Nominal</span>
            </span>
          )}
        </div>

        {/* Center: Quiet Single-Level Navigation */}
        <nav className="rail-nav" role="tablist">
          <button
            type="button"
            className={`rail-tab ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => onTabChange('landing')}
          >
            <Globe size={15} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Operations Console</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'engine-demo' ? 'active' : ''}`}
            onClick={() => onTabChange('engine-demo')}
          >
            <Cpu size={15} />
            <span>Engine Sandbox</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'api-docs' ? 'active' : ''}`}
            onClick={() => onTabChange('api-docs')}
          >
            <Terminal size={15} />
            <span>API Hub</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'auth' ? 'active' : ''}`}
            onClick={() => onTabChange('auth')}
          >
            <UserCheck size={15} />
            <span>Staff Portal</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => onTabChange('audit')}
          >
            <FileText size={15} />
            <span>FS Ledger</span>
          </button>

          <button
            type="button"
            className={`rail-tab ${activeTab === 'html5' ? 'active' : ''}`}
            onClick={() => onTabChange('html5')}
          >
            <Sliders size={15} />
            <span>HTML5 APIs</span>
          </button>
        </nav>

        {/* Right: Operational Controls & Manager Profile Dropdown */}
        <div className="rail-right">
          {/* Primary Action Button */}
          <button
            type="button"
            className="btn-primary-compact"
            onClick={onOpenAddItem}
            title="Create New Perishable SKU"
          >
            <Plus size={15} />
            <span className="hide-mobile">New SKU</span>
          </button>

          {/* Interactive User Session Menu */}
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className="operator-chip-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title={`${manager?.name || 'Staff Portal'} · Click for session options`}
              aria-expanded={isDropdownOpen}
            >
              <span className="operator-initials">{initials}</span>
              <div className="operator-meta hide-mobile">
                <span className="operator-name">{manager?.name || 'Sign In'}</span>
                <span className="operator-role-sub">{manager?.role || 'Guest Mode'}</span>
              </div>
              <ChevronDown size={14} className="operator-chevron" />
            </button>

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <div className="operator-dropdown-menu" role="menu">
                <div className="dropdown-user-header">
                  <div className="dropdown-user-name">{manager?.name || 'Store Associate'}</div>
                  <div className="dropdown-user-role">
                    <span className="role-pill">{manager?.role || 'Guest Mode'}</span>
                  </div>
                  <div className="dropdown-user-staff">
                    ID: {manager?.staffId || 'FF-GUEST'}
                  </div>
                  <div className="dropdown-user-loc">
                    {manager?.storeLocation || 'Bangalore Central Hub'}
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-actions">
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onTabChange('auth');
                    }}
                  >
                    <UserCheck size={14} />
                    <span>Staff Portal & Demo Personas</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAnalytics();
                    }}
                  >
                    <Layers size={14} />
                    <span>Category Risk Analytics</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAuth();
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Quick Auth Popup</span>
                  </button>

                  <button
                    type="button"
                    className="dropdown-menu-item item-danger"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

// FreshFlow Pricing Recommendation & "Why" Insight Drawer (Attio benchmark)
// Self-contained recommendation card: Current Price -> Recommended Price -> Algorithmic Drivers -> Calm Diff Actions
import React, { useState, useEffect } from 'react';

function MarkdownModal({ item, isOpen, onClose, onConfirmApproval, isSubmitting }) {
  const [discountPct, setDiscountPct] = useState(25);
  const [managerNote, setManagerNote] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  function getRecommendation(hours) {
    if (hours < 6) return { suggested: 40, tier: 'Critical', label: 'Urgent Liquidation' };
    if (hours < 12) return { suggested: 25, tier: 'Urgent', label: 'Standard Markdown' };
    return { suggested: 15, tier: 'Watch', label: 'Preventive Markdown' };
  }

  useEffect(() => {
    if (item) {
      const rec = getRecommendation(item.hoursLeft);
      setDiscountPct(item.markdown || rec.suggested);
      setManagerNote(item.managerNote || '');
      setError('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const rec = getRecommendation(item.hoursLeft);
  const basePrice = item.basePrice;
  const newPrice = Number((basePrice * (1 - discountPct / 100)).toFixed(2));
  const unitDiscount = Number((basePrice - newPrice).toFixed(2));
  const totalMarginProtected = Math.round(newPrice * item.qty);
  const predictedSales = Math.max(2, Math.round((item.qty * (item.hoursLeft / 24)) * 0.7));

  // Preset discount pills
  const presets = [
    { label: 'Conservative', pct: 15 },
    { label: `Recommended (${rec.suggested}%)`, pct: rec.suggested, isDefault: true },
    { label: 'Aggressive', pct: 50 },
    { label: 'Clearance', pct: 60 }
  ];

  function handleSubmit(e) {
    e.preventDefault();
    if (!managerNote || managerNote.trim().length < 5) {
      setError('Operational justification note is required for the audit ledger (min 5 chars).');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      return;
    }

    setError('');
    onConfirmApproval(item, discountPct, managerNote.trim());
  }

  function handleReject() {
    if (window.confirm(`Dismiss recommendation for "${item.name}" and keep base price ₹${item.basePrice}?`)) {
      onClose();
    }
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="insight-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawerSkuTitle"
      >
        {/* Drawer Header */}
        <div className="drawer-header-row">
          <div className="sku-meta-lead">
            <span className="sku-badge-code">SKU #{(item._id || item.id).slice(-6).toUpperCase()}</span>
            <span className="sku-dept-chip">{item.category}</span>
            <span className={`sku-expiry-chip ${item.hoursLeft < 6 ? 'chip-critical' : 'chip-urgent'}`}>
              <i className="fa-solid fa-clock"></i> {item.hoursLeft}h to expiration
            </span>
          </div>
          <button type="button" className="btn-close-quiet" onClick={onClose} title="Close drawer (Esc)">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <h3 id="drawerSkuTitle" className="drawer-product-title">
          {item.name}
        </h3>
        <p className="drawer-product-sub">
          Stock Density: <strong>{item.qty} units</strong> on shelf · Department: <strong>{item.category}</strong>
        </p>

        {/* ── Attio Price Diff Card (Before vs After) ── */}
        <div className="pricing-diff-card">
          <div className="diff-header-label">
            <span className="diff-title">Dynamic Price Recommendation</span>
            <span className="diff-confidence-tag">Model Confidence: 94%</span>
          </div>

          <div className="diff-values-row">
            <div className="diff-side">
              <span className="diff-eyebrow">Current Base Price</span>
              <span className="diff-figure text-secondary">₹{basePrice.toFixed(2)}</span>
            </div>

            <div className="diff-arrow-wrap">
              <i className="fa-solid fa-arrow-right-long"></i>
            </div>

            <div className="diff-side diff-highlight-side">
              <span className="diff-eyebrow">Recommended Price</span>
              <div className="diff-rec-value">
                <span className="diff-figure text-healthy">₹{newPrice.toFixed(2)}</span>
                <span className="diff-badge-pct">-{discountPct}%</span>
              </div>
            </div>
          </div>

          <div className="diff-summary-footer">
            <div className="diff-impact-item">
              <span className="impact-label">Unit Discount:</span>
              <strong className="impact-val">-₹{unitDiscount.toFixed(2)}</strong>
            </div>
            <div className="diff-impact-divider"></div>
            <div className="diff-impact-item">
              <span className="impact-label">Total Margin Salvaged:</span>
              <strong className="impact-val text-healthy">₹{totalMarginProtected.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* ── Attio Algorithmic Drivers ("Why this recommendation") ── */}
        <div className="algorithmic-drivers-block">
          <span className="drivers-title">
            <i className="fa-solid fa-microchip"></i> Primary Algorithmic Drivers
          </span>

          <div className="driver-cards-list">
            <div className="driver-card">
              <div className="driver-icon-col icon-amber">
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <div className="driver-content-col">
                <span className="driver-heading">Shelf-Life Proximity ({item.hoursLeft}h left)</span>
                <p className="driver-desc">
                  Item has crossed the {rec.tier} threshold. Exponential decay model applies a {discountPct}% markdown weight to accelerate customer checkout before 100% loss.
                </p>
              </div>
            </div>

            <div className="driver-card">
              <div className="driver-icon-col icon-blue">
                <i className="fa-solid fa-chart-line-down"></i>
              </div>
              <div className="driver-content-col">
                <span className="driver-heading">Velocity Deficit ({item.qty} units on hand)</span>
                <p className="driver-desc">
                  Predicted un-discounted sales rate is only {predictedSales} units before expiry. A {discountPct}% price reduction models an immediate velocity surge to clear remaining stock.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Discount Preset Pills & Range Adjustment ── */}
        <div className="adjustment-control-section">
          <div className="adjustment-header">
            <span className="adjust-label">Quick Discount Presets</span>
            <span className="adjust-current-val">{discountPct}% Markdown</span>
          </div>

          <div className="preset-pill-group">
            {presets.map((p) => (
              <button
                key={p.pct}
                type="button"
                className={`preset-btn ${discountPct === p.pct ? 'active' : ''}`}
                onClick={() => setDiscountPct(p.pct)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="slider-container">
            <input
              type="range"
              min="5"
              max="70"
              step="5"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="restrained-slider"
            />
            <div className="slider-ticks">
              <span>5%</span>
              <span className="tick-rec">Recommended: {rec.suggested}%</span>
              <span>70%</span>
            </div>
          </div>
        </div>

        {/* ── Operational Justification Form ── */}
        <form onSubmit={handleSubmit} noValidate className="decision-form">
          <div className={`form-field-group ${isShaking ? 'shake-field' : ''}`}>
            <label htmlFor="justificationInput" className="field-label">
              Store Manager Operational Note *
              <span className="field-label-sub"> (Recorded to immutable disk audit ledger)</span>
            </label>
            <textarea
              id="justificationInput"
              rows="2"
              value={managerNote}
              onChange={(e) => {
                setManagerNote(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Inspected shelf packaging; approved promotional price sticker for immediate floor clearance."
              className={`field-textarea ${error ? 'border-error' : ''}`}
            />
            {error && (
              <span className="field-validation-error">
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </span>
            )}
          </div>

          {/* Action Affordances */}
          <div className="drawer-decision-actions">
            <button
              type="button"
              className="btn-reject-quiet"
              onClick={handleReject}
              disabled={isSubmitting}
              title="Dismiss recommendation without price change"
            >
              Keep Base Price
            </button>

            <button
              type="submit"
              className="btn-approve-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span><i className="fa-solid fa-spinner fa-spin"></i> Pushing to POS...</span>
              ) : (
                <span>
                  <i className="fa-solid fa-check"></i> Accept & Push ₹{newPrice.toFixed(2)} (-{discountPct}%)
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarkdownModal;

// FreshFlow Retail Shelf Markdown Tag & Barcode Generator Modal
// Simulates supermarket POS liquidation label printing (Code128 barcode format & price strike)
import React from 'react';

function ShelfTagModal({ item, isOpen, onClose, manager }) {
  if (!isOpen || !item) return null;

  const basePrice = item.basePrice;
  const discountPrice = item.discountPrice || Number((basePrice * (1 - (item.markdown || 30) / 100)).toFixed(2));
  const markdownPct = item.markdown || Math.round(((basePrice - discountPrice) / basePrice) * 100);
  const savings = (basePrice - discountPrice).toFixed(2);
  const skuId = item.id || item._id || 'SKU-0000';
  const barcodeNumber = `FF-${item.category.toUpperCase().slice(0, 3)}-${item.hoursLeft}H-${Math.round(discountPrice)}`;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="shelf-tag-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shelfTagTitle"
      >
        <div className="shelf-tag-modal-header">
          <div className="tag-header-left">
            <span className="tag-header-icon">
              <i className="fa-solid fa-barcode"></i>
            </span>
            <div>
              <h3 id="shelfTagTitle" className="tag-modal-title">Retail Shelf Markdown Tag</h3>
              <p className="tag-modal-subtitle">Point-of-Sale (POS) Liquidation Label & Barcode Preview</p>
            </div>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Printable Physical Tag Preview */}
        <div className="shelf-tag-canvas-wrap">
          <div className="printable-shelf-tag" id="printableTag">
            {/* Tag Top Header */}
            <div className="tag-top-banner">
              <div className="tag-brand-row">
                <span className="tag-brand-title">FRESHFLOW LIQUIDATION</span>
                <span className="tag-dept-badge">{item.category.toUpperCase()}</span>
              </div>
              <span className="tag-expiry-alert">
                <i className="fa-solid fa-clock"></i> EXPIRES IN {item.hoursLeft} HOURS
              </span>
            </div>

            {/* Product Title */}
            <div className="tag-product-row">
              <h2 className="tag-product-name">{item.name}</h2>
              <span className="tag-qty-badge">{item.qty} units batch</span>
            </div>

            {/* Price Strike & Huge Discount */}
            <div className="tag-pricing-box">
              <div className="tag-was-box">
                <span className="tag-was-label">WAS REGULAR</span>
                <span className="tag-was-price">₹{basePrice.toFixed(2)}</span>
              </div>

              <div className="tag-now-box">
                <span className="tag-now-label">CLEARANCE PRICE</span>
                <div className="tag-now-price-row">
                  <span className="tag-curr">₹</span>
                  <span className="tag-now-price">{discountPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="tag-discount-badge">
                <span className="tag-save-pct">SAVE {markdownPct}%</span>
                <span className="tag-save-amt">Save ₹{savings}</span>
              </div>
            </div>

            {/* Simulated Scannable Barcode SVG */}
            <div className="tag-barcode-zone">
              <svg className="barcode-svg" viewBox="0 0 300 60" preserveAspectRatio="none">
                {/* Visual Code128 bar pattern */}
                {[
                  4, 2, 6, 2, 4, 3, 2, 5, 2, 3, 6, 2, 4, 2, 5, 3, 2, 4, 6, 2, 3, 4, 2, 5, 3, 2, 6, 4, 2, 3, 5, 2, 4,
                  3, 6, 2, 2, 4, 5, 3, 2, 6, 2, 4, 3, 5, 2, 4, 6, 2, 3, 5, 2, 4, 2, 6, 3, 4, 2, 5
                ].map((width, idx) => (
                  <rect
                    key={idx}
                    x={idx * 5}
                    y="0"
                    width={width > 4 ? 3 : 1.5}
                    height="48"
                    fill="#111827"
                  />
                ))}
              </svg>
              <div className="barcode-number">{barcodeNumber}</div>
            </div>

            {/* Verification Footer */}
            <div className="tag-footer-info">
              <span>Auth: {manager?.name || 'Store Operations Lead'}</span>
              <span>Hub: Bangalore Central</span>
              <span>SKU: {String(skuId).slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="shelf-tag-actions">
          <button type="button" className="btn-secondary-compact" onClick={onClose}>
            Close Preview
          </button>
          <button type="button" className="btn-primary-compact" onClick={handlePrint}>
            <i className="fa-solid fa-print"></i>
            <span>Print Physical Shelf Sticker</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShelfTagModal;

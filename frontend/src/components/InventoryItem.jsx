// FreshFlow Inventory Item Card (Linear card-based hierarchy benchmark)
// Quiet chrome, tabular numerals, inline algorithmic rationale, and restrained status tagging
import React from 'react';

function InventoryItem({ item, onOpenMarkdown, onOpenShelfTag, onEdit, onDelete }) {
  function getUrgency(hours) {
    if (hours < 6) return { label: 'Critical', color: 'critical', suggested: 40 };
    if (hours < 12) return { label: 'Urgent', color: 'urgent', suggested: 25 };
    return { label: 'Watch', color: 'neutral', suggested: 15 };
  }

  const tier = getUrgency(item.hoursLeft);
  const isApproved = item.status === 'approved';
  const suggestedPct = isApproved && item.markdown ? item.markdown : tier.suggested;
  const recommendedPrice = (item.basePrice * (1 - suggestedPct / 100)).toFixed(2);
  const itemId = item._id || item.id;
  const shortId = typeof itemId === 'string' && itemId.length > 8 ? itemId.slice(-6).toUpperCase() : itemId;

  function getAlgorithmicWhy() {
    if (item.status === 'approved' && item.managerNote) return item.managerNote;
    if (item.hoursLeft < 6) return `${item.hoursLeft}h left · High spoilage probability · Deficit run-rate`;
    if (item.hoursLeft < 12) return `${item.hoursLeft}h left · Demand below forecast · Standard markdown`;
    return `${item.hoursLeft}h shelf life · Seasonal slow-down · Preventive tier`;
  }

  return (
    <div
      className={`linear-sku-card ${item.hoursLeft < 6 && !isApproved ? 'card-border-critical' : ''}`}
      onClick={() => onOpenMarkdown(item)}
    >
      {/* Top Header Row */}
      <div className="card-top-row">
        <div className="card-id-group">
          <code className="monospace-sku">{shortId}</code>
          <span className="card-dept-tag">{item.category}</span>
        </div>
        <span className={`urgency-chip chip-${tier.color}`}>
          {item.hoursLeft}h left
        </span>
      </div>

      {/* Product Title */}
      <div className="card-title-row">
        <h4 className="card-product-name">{item.name}</h4>
      </div>

      {/* Algorithmic Reason */}
      <p className="card-algorithmic-reason" title={getAlgorithmicWhy()}>
        {getAlgorithmicWhy()}
      </p>

      {/* Numerics Row (Stripe Tabular Alignment) */}
      <div className="card-numerics-grid">
        <div className="numeric-item">
          <span className="num-label">Units</span>
          <span className="num-val tnum">{item.qty}</span>
        </div>

        <div className="numeric-item">
          <span className="num-label">Base Retail</span>
          <span className="num-val tnum">₹{item.basePrice.toFixed(2)}</span>
        </div>

        <div className="numeric-item">
          <span className="num-label">
            {isApproved ? 'Approved' : 'Rec. Price'}
          </span>
          <span className="num-val tnum text-healthy">
            ₹{isApproved && item.discountPrice ? item.discountPrice.toFixed(2) : recommendedPrice}
          </span>
        </div>
      </div>

      {/* Footer Action Strip */}
      <div className="card-footer-strip" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`btn-card-review ${isApproved ? 'btn-card-active' : ''}`}
          onClick={() => onOpenMarkdown(item)}
        >
          {isApproved ? (
            <>
              <i className="fa-solid fa-check"></i>
              <span>Active (-{item.markdown}%)</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-tag"></i>
              <span>Review Rec (-{suggestedPct}%)</span>
            </>
          )}
        </button>

        <div className="card-icon-actions">
          {/* Printable Shelf Tag */}
          <button
            type="button"
            className="btn-card-icon"
            onClick={() => onOpenShelfTag(item)}
            title="Print Retail Markdown Shelf Tag & Barcode"
          >
            <i className="fa-solid fa-barcode"></i>
          </button>

          <button
            type="button"
            className="btn-card-icon"
            onClick={() => onEdit(item)}
            title="Edit SKU Details"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            type="button"
            className="btn-card-icon btn-card-delete"
            onClick={() => onDelete(itemId, item.name)}
            title="Delete SKU"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryItem;

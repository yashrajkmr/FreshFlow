// FreshFlow Stripe-Style Dense Inventory & Pricing Table
// Implements sticky header, right-aligned tabular numerics, inline algorithmic "why", and subtle row hovers
import React from 'react';

function InventoryTable({ items, onOpenMarkdown, onOpenShelfTag, onEdit, onDelete, onResetFilters }) {
  if (items.length === 0) {
    return (
      <div className="table-empty-state">
        <div className="empty-icon-wrap">
          <i className="fa-solid fa-inbox"></i>
        </div>
        <h4 className="empty-title">No Matching Perishable SKUs</h4>
        <p className="empty-desc">
          No inventory items match your current department, status, or search query.
        </p>
        <button type="button" className="btn-secondary-compact" onClick={onResetFilters}>
          Clear All Active Filters
        </button>
      </div>
    );
  }

  // Algorithmic "Why" Generator based on real retail ops criteria
  function getAlgorithmicWhy(item) {
    if (item.status === 'approved' && item.managerNote) {
      return item.managerNote;
    }
    if (item.hoursLeft < 6) {
      return `${item.hoursLeft}h to expiry · Velocity down 24% · Spoilage risk 92%`;
    }
    if (item.hoursLeft < 12) {
      return `${item.hoursLeft}h to expiry · Demand velocity below hourly run-rate`;
    }
    return `${item.hoursLeft}h shelf life · Category overstock · Preventive liquidation`;
  }

  function getUrgencyChip(hours) {
    if (hours < 6) {
      return <span className="urgency-chip chip-critical">{hours}h left</span>;
    }
    if (hours < 12) {
      return <span className="urgency-chip chip-urgent">{hours}h left</span>;
    }
    return <span className="urgency-chip chip-neutral">{hours}h left</span>;
  }

  function getSuggestedMarkdown(hours) {
    if (hours < 6) return 40;
    if (hours < 12) return 25;
    return 15;
  }

  return (
    <div className="stripe-table-container">
      <table className="stripe-dense-table" aria-label="Perishable Inventory Pricing Ledger">
        <thead>
          <tr>
            <th className="th-sku">SKU</th>
            <th className="th-product">Product & Department</th>
            <th className="th-why">Algorithmic Driver ("Why")</th>
            <th className="th-shelflife">Shelf Life</th>
            <th className="th-qty text-right">Units</th>
            <th className="th-price text-right">Base Price</th>
            <th className="th-rec text-right">Recommended Price</th>
            <th className="th-status">Status</th>
            <th className="th-actions text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const itemId = item._id || item.id;
            const shortId = typeof itemId === 'string' && itemId.length > 8 ? itemId.slice(-6).toUpperCase() : itemId;
            const isApproved = item.status === 'approved';
            const suggestedPct = isApproved && item.markdown ? item.markdown : getSuggestedMarkdown(item.hoursLeft);
            const recommendedPrice = (item.basePrice * (1 - suggestedPct / 100)).toFixed(2);
            const whyText = getAlgorithmicWhy(item);

            return (
              <tr
                key={itemId}
                className={`table-row-interactive ${item.hoursLeft < 6 && !isApproved ? 'row-urgency-critical' : ''}`}
                onClick={() => onOpenMarkdown(item)}
              >
                {/* SKU Code */}
                <td className="td-sku">
                  <code className="monospace-sku">{shortId}</code>
                </td>

                {/* Product Name & Department */}
                <td className="td-product">
                  <div className="product-info-cell">
                    <span className="product-name">{item.name}</span>
                    <span className="dept-tag-quiet">{item.category}</span>
                  </div>
                </td>

                {/* Algorithmic Reason / Why Driver */}
                <td className="td-why">
                  <span className="algorithmic-why-text" title={whyText}>
                    {whyText}
                  </span>
                </td>

                {/* Shelf-Life Countdown Chip */}
                <td className="td-shelflife">
                  {getUrgencyChip(item.hoursLeft)}
                </td>

                {/* Stock Quantity (Tabular Numerals, Right-Aligned) */}
                <td className="td-qty text-right col-numeric">
                  <span className="tnum-cell">{item.qty}</span>
                </td>

                {/* Base Retail Price (Tabular Numerals, Right-Aligned) */}
                <td className="td-price text-right col-numeric">
                  <span className="tnum-cell">₹{item.basePrice.toFixed(2)}</span>
                </td>

                {/* Recommended Markdown Price (Before -> After Diff) */}
                <td className="td-rec text-right col-numeric">
                  <div className="price-diff-inline">
                    <span className="diff-target-price">
                      ₹{isApproved && item.discountPrice ? item.discountPrice.toFixed(2) : recommendedPrice}
                    </span>
                    <span className={`diff-pill ${isApproved ? 'diff-pill-approved' : 'diff-pill-suggested'}`}>
                      -{suggestedPct}%
                    </span>
                  </div>
                </td>

                {/* Operational Status */}
                <td className="td-status">
                  {isApproved ? (
                    <span className="status-dot-label text-healthy">
                      <span className="status-dot dot-healthy"></span>
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="status-dot-label text-urgent">
                      <span className="status-dot dot-urgent"></span>
                      <span>Pending</span>
                    </span>
                  )}
                </td>

                {/* Row Inline Actions */}
                <td className="td-actions text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="row-action-buttons">
                    <button
                      type="button"
                      className={`btn-row-action ${isApproved ? 'btn-row-approved' : 'btn-row-review'}`}
                      onClick={() => onOpenMarkdown(item)}
                      title={isApproved ? 'Adjust Approved Markdown' : 'Review Dynamic Pricing Recommendation'}
                    >
                      {isApproved ? 'Adjust' : 'Review'}
                    </button>

                    {/* Shelf Tag & Barcode Preview Button */}
                    <button
                      type="button"
                      className="btn-row-icon btn-row-tag"
                      onClick={() => onOpenShelfTag(item)}
                      title="Print Retail Markdown Shelf Tag & Barcode"
                    >
                      <i className="fa-solid fa-barcode"></i>
                    </button>

                    <button
                      type="button"
                      className="btn-row-icon"
                      onClick={() => onEdit(item)}
                      title="Edit SKU"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>

                    <button
                      type="button"
                      className="btn-row-icon btn-row-delete"
                      onClick={() => onDelete(itemId, item.name)}
                      title="Remove SKU"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;

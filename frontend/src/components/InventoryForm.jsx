// FreshFlow Inventory Form Modal (Mercury / Linear restraint)
// Clean operational input handling with client-side bounds validation
import React, { useState, useEffect } from 'react';

function InventoryForm({ isOpen, onClose, onSubmit, editingItem, isSubmitting }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [hoursLeft, setHoursLeft] = useState('');
  const [qty, setQty] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [status, setStatus] = useState('pending');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setCategory(editingItem.category || 'Dairy');
      setHoursLeft(editingItem.hoursLeft !== undefined ? String(editingItem.hoursLeft) : '');
      setQty(editingItem.qty !== undefined ? String(editingItem.qty) : '');
      setBasePrice(editingItem.basePrice !== undefined ? String(editingItem.basePrice) : '');
      setStatus(editingItem.status || 'pending');
      setErrors({});
    } else {
      setName('');
      setCategory('Dairy');
      setHoursLeft('12');
      setQty('24');
      setBasePrice('95');
      setStatus('pending');
      setErrors({});
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const errs = {};
    const trimmed = name.trim();

    if (!trimmed) {
      errs.name = 'Product name is required.';
    } else if (trimmed.length < 2) {
      errs.name = 'Must be at least 2 characters.';
    }

    if (hoursLeft === '') {
      errs.hoursLeft = 'Required.';
    } else {
      const h = Number(hoursLeft);
      if (!Number.isInteger(h) || h < 0) {
        errs.hoursLeft = 'Non-negative integer (>= 0).';
      }
    }

    if (qty === '') {
      errs.qty = 'Required.';
    } else {
      const q = Number(qty);
      if (!Number.isInteger(q) || q < 1) {
        errs.qty = 'Minimum 1 unit.';
      }
    }

    if (basePrice === '') {
      errs.basePrice = 'Required.';
    } else {
      const p = Number(basePrice);
      if (Number.isNaN(p) || p <= 0) {
        errs.basePrice = 'Must be greater than 0.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      category,
      hoursLeft: parseInt(hoursLeft, 10),
      qty: parseInt(qty, 10),
      basePrice: parseFloat(basePrice),
      status
    };

    onSubmit(payload, editingItem ? (editingItem._id || editingItem.id) : null);
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="form-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header-row">
          <div>
            <span className="modal-eyebrow">Inventory Catalog</span>
            <h3 className="modal-headline">
              {editingItem ? `Edit SKU: ${editingItem.name}` : 'New Perishable SKU'}
            </h3>
          </div>
          <button type="button" className="btn-close-quiet" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="clean-modal-form">
          {/* SKU Name */}
          <div className="field-block">
            <label htmlFor="skuName" className="input-label">Product Name *</label>
            <input
              id="skuName"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Greek Yogurt Cups (4-Pack)"
              className={`input-clean ${errors.name ? 'border-error' : ''}`}
              autoComplete="off"
            />
            {errors.name && <span className="field-hint-error">{errors.name}</span>}
          </div>

          <div className="field-grid-2">
            {/* Department */}
            <div className="field-block">
              <label htmlFor="skuDept" className="input-label">Department *</label>
              <select
                id="skuDept"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-clean"
              >
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Produce">Produce</option>
                <option value="Meat">Meat</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            {/* Hours Left */}
            <div className="field-block">
              <label htmlFor="skuHours" className="input-label">Shelf-Life Countdown (Hours) *</label>
              <input
                id="skuHours"
                type="number"
                min="0"
                step="1"
                value={hoursLeft}
                onChange={(e) => {
                  setHoursLeft(e.target.value);
                  if (errors.hoursLeft) setErrors((prev) => ({ ...prev, hoursLeft: null }));
                }}
                placeholder="e.g. 6"
                className={`input-clean tnum ${errors.hoursLeft ? 'border-error' : ''}`}
              />
              {errors.hoursLeft && <span className="field-hint-error">{errors.hoursLeft}</span>}
            </div>
          </div>

          <div className="field-grid-2">
            {/* Stock Quantity */}
            <div className="field-block">
              <label htmlFor="skuQty" className="input-label">Stock Quantity (Units) *</label>
              <input
                id="skuQty"
                type="number"
                min="1"
                step="1"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  if (errors.qty) setErrors((prev) => ({ ...prev, qty: null }));
                }}
                placeholder="e.g. 25"
                className={`input-clean tnum ${errors.qty ? 'border-error' : ''}`}
              />
              {errors.qty && <span className="field-hint-error">{errors.qty}</span>}
            </div>

            {/* Base Price */}
            <div className="field-block">
              <label htmlFor="skuPrice" className="input-label">Base Retail Price (₹) *</label>
              <input
                id="skuPrice"
                type="number"
                min="0.01"
                step="any"
                value={basePrice}
                onChange={(e) => {
                  setBasePrice(e.target.value);
                  if (errors.basePrice) setErrors((prev) => ({ ...prev, basePrice: null }));
                }}
                placeholder="e.g. 120.00"
                className={`input-clean tnum ${errors.basePrice ? 'border-error' : ''}`}
              />
              {errors.basePrice && <span className="field-hint-error">{errors.basePrice}</span>}
            </div>
          </div>

          {/* Status Radio Choice */}
          <div className="field-block">
            <label className="input-label">Initial Operational Status *</label>
            <div className="clean-radio-group">
              <label className="radio-pill-label">
                <input
                  type="radio"
                  name="skuStatus"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span>Pending Review</span>
              </label>

              <label className="radio-pill-label">
                <input
                  type="radio"
                  name="skuStatus"
                  value="approved"
                  checked={status === 'approved'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span>Markdown Active</span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel-modal"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-modal"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span><i className="fa-solid fa-spinner fa-spin"></i> Saving to Database...</span>
              ) : editingItem ? (
                <span>Update SKU</span>
              ) : (
                <span>Save to Inventory</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryForm;

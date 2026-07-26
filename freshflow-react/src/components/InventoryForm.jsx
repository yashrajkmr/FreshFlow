import { useState, useEffect } from 'react';

// reusable form component - used for both Create and Update
// editingItem is null when creating, has data when editing
function InventoryForm({ onSubmit, editingItem, onCancelEdit }) {

  // multiple input fields managed with useState
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');       // select dropdown
  const [hoursLeft, setHoursLeft] = useState('');
  const [qty, setQty] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [status, setStatus] = useState('pending');          // radio buttons

  // when editingItem changes, fill the form with its data
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setHoursLeft(editingItem.hoursLeft);
      setQty(editingItem.qty);
      setBasePrice(editingItem.basePrice);
      setStatus(editingItem.status);
    } else {
      resetForm();
    }
  }, [editingItem]);

  function resetForm() {
    setName('');
    setCategory('Dairy');
    setHoursLeft('');
    setQty('');
    setBasePrice('');
    setStatus('pending');
  }

  // form submit event handler
  function handleSubmit(e) {
    e.preventDefault();

    // basic validation
    if (!name.trim() || !hoursLeft || !qty || !basePrice) {
      alert('Please fill all fields before submitting.');
      return;
    }

    const itemData = {
      name: name.trim(),
      category,
      hoursLeft: Number(hoursLeft),
      qty: Number(qty),
      basePrice: Number(basePrice),
      status,
    };

    onSubmit(itemData, editingItem ? editingItem.id : null);
    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} className="inventory-form">
      <h3 className="form-title">
        {editingItem ? 'Update Item' : 'Add New Inventory Item'}
      </h3>

      {/* text input */}
      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Farm Fresh Paneer 200g"
        />
      </div>

      <div className="form-row">
        {/* select dropdown */}
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Produce">Produce</option>
            <option value="Meat">Meat</option>
            <option value="Frozen">Frozen</option>
          </select>
        </div>

        {/* number input */}
        <div className="form-group">
          <label>Hours Left</label>
          <input
            type="number"
            value={hoursLeft}
            onChange={(e) => setHoursLeft(e.target.value)}
            placeholder="e.g. 6"
          />
        </div>
      </div>

      <div className="form-row">
        {/* number input */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>

        {/* number input */}
        <div className="form-group">
          <label>Base Price (₹)</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="e.g. 90"
          />
        </div>
      </div>

      {/* radio buttons */}
      <div className="form-group">
        <label>Status</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={status === 'pending'}
              onChange={(e) => setStatus(e.target.value)}
            />
            Pending
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              value="approved"
              checked={status === 'approved'}
              onChange={(e) => setStatus(e.target.value)}
            />
            Approved
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default InventoryForm;

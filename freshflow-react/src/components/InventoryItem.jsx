// reusable component - renders a single inventory item card
// receives item data and callback functions as props
function InventoryItem({ item, onEdit, onDelete }) {

  // determine urgency tier based on hoursLeft
  function getUrgency(hours) {
    if (hours < 6) return { label: 'Critical', className: 'tier-critical' };
    if (hours < 12) return { label: 'Urgent', className: 'tier-urgent' };
    return { label: 'Watch', className: 'tier-watch' };
  }

  const tier = getUrgency(item.hoursLeft);
  const isApproved = item.status === 'approved';

  return (
    <div className={`inventory-card ${isApproved ? 'card-approved' : ''}`}>
      <div className="card-top">
        <span className={`tier-badge ${tier.className}`}>
          {tier.label} · {item.hoursLeft}h left
        </span>
        <span className="category-tag">{item.category}</span>
        {isApproved && <span className="approved-tag">✓ Approved</span>}
      </div>

      <h4 className="card-name">{item.name}</h4>
      <p className="card-details">
        Qty: {item.qty} units · ₹{item.basePrice} base price
      </p>

      <div className="card-actions">
        <button onClick={() => onEdit(item)} className="btn-edit">
          <i className="fa-solid fa-pen"></i> Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="btn-delete">
          <i className="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
}

export default InventoryItem;

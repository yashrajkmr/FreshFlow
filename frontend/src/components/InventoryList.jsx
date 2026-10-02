// FreshFlow Inventory List (Grid View)
import React from 'react';
import InventoryItem from './InventoryItem.jsx';

function InventoryList({ items, onOpenMarkdown, onOpenShelfTag, onEdit, onDelete, onResetFilters }) {
  if (items.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon">
          <i className="fa-solid fa-basket-shopping"></i>
        </div>
        <h3>No Perishable Items Found</h3>
        <p>No perishable products matched your selected filters or search query.</p>
        <button type="button" className="btn-secondary" onClick={onResetFilters}>
          <i className="fa-solid fa-rotate-left"></i> Reset Search & Filters
        </button>
      </div>
    );
  }

  return (
    <div className="inventory-grid">
      {items.map((item) => (
        <InventoryItem
          key={item._id || item.id}
          item={item}
          onOpenMarkdown={onOpenMarkdown}
          onOpenShelfTag={onOpenShelfTag}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default InventoryList;

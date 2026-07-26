import InventoryItem from './InventoryItem.jsx';

// reusable list component - applies search + filter logic
// then renders InventoryItem for each matching record
function InventoryList({ items, searchTerm, activeFilter, onEdit, onDelete }) {

  // apply search filter
  let filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // apply status/urgency filter
  if (activeFilter === 'pending') {
    filtered = filtered.filter((item) => item.status === 'pending');
  } else if (activeFilter === 'approved') {
    filtered = filtered.filter((item) => item.status === 'approved');
  } else if (activeFilter === 'critical') {
    filtered = filtered.filter((item) => item.hoursLeft < 6);
  }

  if (filtered.length === 0) {
    return <p className="empty-state">No inventory items match your search/filter.</p>;
  }

  return (
    <div className="inventory-list">
      {filtered.map((item) => (
        <InventoryItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default InventoryList;

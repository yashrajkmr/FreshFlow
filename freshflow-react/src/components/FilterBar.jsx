// reusable filter bar - shows filter buttons for status
function FilterBar({ activeFilter, onFilterChange }) {
  const filters = ['all', 'pending', 'approved', 'critical'];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`filter-btn ${activeFilter === f ? 'filter-active' : ''}`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;

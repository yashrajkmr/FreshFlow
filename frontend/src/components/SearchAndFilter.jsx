// FreshFlow Filter & Search Rail (Stripe / Linear standard)
// Restrained controls with keyboard shortcuts, compact status chips, batch liquidation, and CSV export
import React from 'react';

function SearchAndFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
  onReset,
  totalResults,
  criticalCount,
  pendingCount,
  approvedCount,
  onBatchLiquidate,
  onExportCSV,
  onOpenAnalytics,
  isBatchProcessing
}) {
  return (
    <div className="filter-rail-bar" role="search">
      <div className="filter-rail-row">
        {/* Search Field with Alt+S indicator */}
        <div className="search-field-box">
          <i className="fa-solid fa-magnifying-glass search-field-icon"></i>
          <input
            id="searchInput"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by product name, SKU, or department..."
            className="search-field-input"
            autoComplete="off"
          />
          {searchTerm ? (
            <button
              type="button"
              className="btn-clear-inline"
              onClick={() => onSearchChange('')}
              title="Clear search (Esc)"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          ) : (
            <span className="kbd-shortcut-hint hide-mobile">
              <kbd>Alt+S</kbd>
            </span>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="category-field-box">
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="select-field-input"
          >
            <option value="">All Departments</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Produce">Produce</option>
            <option value="Meat">Meat</option>
            <option value="Frozen">Frozen</option>
          </select>
        </div>

        {/* Status Filter Tabs (Vercel-style clean pills) */}
        <div className="status-filter-pills" role="tablist">
          <button
            type="button"
            className={`pill-filter ${activeStatus === 'all' ? 'active' : ''}`}
            onClick={() => onStatusChange('all')}
          >
            <span>All SKUs</span>
          </button>

          <button
            type="button"
            className={`pill-filter pill-alert-critical ${activeStatus === 'critical' ? 'active' : ''}`}
            onClick={() => onStatusChange('critical')}
          >
            <span className="dot-indicator dot-critical"></span>
            <span>Critical &lt; 6h</span>
            {criticalCount > 0 && <span className="pill-count">{criticalCount}</span>}
          </button>

          <button
            type="button"
            className={`pill-filter ${activeStatus === 'pending' ? 'active' : ''}`}
            onClick={() => onStatusChange('pending')}
          >
            <span className="dot-indicator dot-urgent"></span>
            <span>Pending Review</span>
            {pendingCount > 0 && <span className="pill-count">{pendingCount}</span>}
          </button>

          <button
            type="button"
            className={`pill-filter ${activeStatus === 'approved' ? 'active' : ''}`}
            onClick={() => onStatusChange('approved')}
          >
            <span className="dot-indicator dot-healthy"></span>
            <span>Active Markdowns</span>
            {approvedCount > 0 && <span className="pill-count">{approvedCount}</span>}
          </button>
        </div>

        {/* Reset Filter Action */}
        {(searchTerm || selectedCategory || activeStatus !== 'all') && (
          <button
            type="button"
            className="btn-reset-clean"
            onClick={onReset}
            title="Reset active filters"
          >
            <i className="fa-solid fa-rotate-left"></i> Reset
          </button>
        )}
      </div>

      {/* Enterprise Quick-Action Toolbar */}
      <div className="filter-actions-subbar">
        <div className="subbar-left">
          <span className="inventory-tally-label">
            Showing <strong>{totalResults}</strong> monitored perishable records
          </span>
        </div>

        <div className="subbar-right">
          {/* Category Analytics Trigger */}
          <button
            type="button"
            className="btn-subbar-action"
            onClick={onOpenAnalytics}
            title="View Department-level Risk & Margin Analytics"
          >
            <i className="fa-solid fa-chart-pie text-accent"></i>
            <span>Department Analytics</span>
          </button>

          {/* Export to CSV */}
          <button
            type="button"
            className="btn-subbar-action"
            onClick={onExportCSV}
            title="Download Perishable Inventory as CSV Spreadsheet"
          >
            <i className="fa-solid fa-file-csv"></i>
            <span>Export CSV</span>
          </button>

          {/* Batch Liquidation Action (High-impact feature!) */}
          {criticalCount > 0 && (
            <button
              type="button"
              className="btn-batch-liquidate"
              onClick={onBatchLiquidate}
              disabled={isBatchProcessing}
              title="Apply emergency 40% liquidation discount to all critical items"
            >
              {isBatchProcessing ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Liquidating Batch...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt"></i>
                  <span>Batch Liquidate {criticalCount} Critical SKUs</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchAndFilter;

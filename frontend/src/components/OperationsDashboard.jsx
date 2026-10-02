// FreshFlow Operations Dashboard - Supermarket Store Manager Console Standard
// Features Visual Shelf Cards vs Dense Ledger toggle, Department Risk Matrix, Instant Actions, and Barcode Shelf Tags
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Radio,
  CheckCircle2,
  TrendingDown,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  Tag,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  DollarSign,
  LayoutGrid,
  List,
  Barcode,
  Store,
  FileSpreadsheet,
  Package
} from 'lucide-react';

const DEPT_ICONS = {
  Dairy: '🥛',
  Bakery: '🥖',
  Produce: '🥑',
  Meat: '🥩',
  Seafood: '🦐',
  Deli: '🧀',
  Frozen: '❄️'
};

export default function OperationsDashboard({
  items,
  telemetry,
  loading,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  activeStatus,
  setActiveStatus,
  onReviewMarkdown,
  onSimulatePosSync,
  onViewShelfTag,
  onEditItem,
  onDeleteItem,
  onAddNewItem,
  onBatchAutoApprove,
  isBatchProcessing,
  refreshData
}) {
  const [displayView, setDisplayView] = useState('cards'); // 'cards' (visual) | 'table' (ledger)
  const [sortField, setSortField] = useState('hoursLeft');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  const categories = ['All', 'Dairy', 'Bakery', 'Produce', 'Meat', 'Seafood', 'Deli', 'Frozen'];

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort items
  const filteredSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by urgency / status
    if (activeStatus === 'critical') {
      result = result.filter((i) => i.hoursLeft <= 6);
    } else if (activeStatus === 'urgent') {
      result = result.filter((i) => i.hoursLeft > 6 && i.hoursLeft <= 24);
    } else if (activeStatus === 'watch') {
      result = result.filter((i) => i.hoursLeft > 24 && i.hoursLeft <= 72);
    } else if (activeStatus === 'fresh') {
      result = result.filter((i) => i.hoursLeft > 72);
    } else if (activeStatus === 'pending') {
      result = result.filter((i) => i.status === 'pending');
    } else if (activeStatus === 'approved') {
      result = result.filter((i) => i.status === 'approved');
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.sku && i.sku.toLowerCase().includes(q)) ||
          (i.batchId && i.batchId.toLowerCase().includes(q)) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'dynamicPrice') {
        valA = a.discountPrice || a.basePrice;
        valB = b.discountPrice || b.basePrice;
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return result;
  }, [items, selectedCategory, activeStatus, searchTerm, sortField, sortDirection]);

  // Compute pending discountable count
  const pendingCount = items.filter((i) => i.status === 'pending' && i.hoursLeft <= 24).length;

  return (
    <div className="operations-dashboard">
      {/* ── TOP KPI TELEMETRY STRIP ── */}
      <div className="telemetry-ticker-bar">
        <div className="telemetry-cell">
          <div className="telemetry-label">ACTIVE PERISHABLE SKUs</div>
          <div className="telemetry-number tnum">
            {telemetry ? telemetry.activeSKUs : items.length}
          </div>
          <div className="telemetry-sub">Live IoT shelf monitoring</div>
        </div>

        <div className="telemetry-cell">
          <div className="telemetry-label">MARGIN PROTECTED TODAY</div>
          <div className="telemetry-number tnum text-emerald">
            ${telemetry ? telemetry.totalSalvagedToday.toLocaleString() : '13,397.40'}
          </div>
          <div className="telemetry-sub">Recaptured from spoilage</div>
        </div>

        <div className="telemetry-cell cell-hazard">
          <div className="telemetry-label">
            <span className="pulse-hazard"></span>
            CRITICAL EXPIRY (&le; 12H)
          </div>
          <div className="telemetry-number tnum text-rose">
            {telemetry ? telemetry.criticalRiskCount : items.filter((i) => i.hoursLeft <= 12).length}
          </div>
          <div className="telemetry-sub">Requires flash liquidation</div>
        </div>

        <div className="telemetry-cell">
          <div className="telemetry-label">SELL-THROUGH VELOCITY</div>
          <div className="telemetry-number tnum text-cyan">
            {telemetry ? telemetry.averageSellThroughRate : '98.7'}%
          </div>
          <div className="telemetry-sub">Target 99.0% SLA</div>
        </div>

        <div className="telemetry-cell">
          <div className="telemetry-label">AVOIDED FOOD WASTE</div>
          <div className="telemetry-number tnum text-emerald">
            {telemetry ? telemetry.esgWasteAvoidedKg : '1,071.8'} kg
          </div>
          <div className="telemetry-sub">Scope 3 ESG certified</div>
        </div>
      </div>

      {/* ── DEPARTMENT RISK DENSITY HEATMAP ── */}
      <div className="dashboard-section heatmap-section">
        <div className="section-head-row">
          <div className="section-head-title">
            <Layers size={16} className="text-amber" />
            <span>DEPARTMENT BATCH EXPIRY RISK MATRIX</span>
            <span className="matrix-badge">Store #BLR-01 Floor Telemetry</span>
          </div>
          <span className="matrix-hint">Click any department to instantly filter shelf inventory</span>
        </div>

        <div className="heatmap-grid">
          {telemetry && telemetry.departmentMatrix
            ? Object.entries(telemetry.departmentMatrix).map(([dept, stats]) => {
                const isSelected = selectedCategory.toLowerCase() === dept.toLowerCase();
                let statusColorClass = 'risk-low';
                if (stats.critical > 0) statusColorClass = 'risk-critical';
                else if (stats.urgent > 0) statusColorClass = 'risk-urgent';

                return (
                  <div
                    key={dept}
                    onClick={() => setSelectedCategory(isSelected ? 'All' : dept)}
                    className={`heatmap-dept-card ${statusColorClass} ${isSelected ? 'selected-dept' : ''}`}
                  >
                    <div className="dept-card-header">
                      <span className="dept-name">
                        <span className="dept-emoji">{DEPT_ICONS[dept] || '📦'}</span> {dept}
                      </span>
                      <span className="dept-count tnum">{stats.count} lots</span>
                    </div>

                    <div className="dept-risk-bar">
                      <div
                        className="risk-bar-fill fill-crit"
                        style={{ width: `${(stats.critical / (stats.count || 1)) * 100}%` }}
                      ></div>
                      <div
                        className="risk-bar-fill fill-urg"
                        style={{ width: `${(stats.urgent / (stats.count || 1)) * 100}%` }}
                      ></div>
                      <div
                        className="risk-bar-fill fill-fresh"
                        style={{ width: `${(stats.fresh / (stats.count || 1)) * 100}%` }}
                      ></div>
                    </div>

                    <div className="dept-card-footer">
                      <span className="critical-tag tnum">
                        {stats.critical > 0 ? `${stats.critical} critical (<12h)` : 'Healthy'}
                      </span>
                      <span className="avg-disc tnum">
                        {stats.avgMarkdown > 0 ? `-${stats.avgMarkdown}% avg` : '0%'}
                      </span>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>

      {/* ── QUEUE CONTROLS & FILTER ROW ── */}
      <div className="queue-controls-bar">
        {/* Search */}
        <div className="search-box-terminal">
          <Search size={15} className="text-dim" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, or Batch ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="terminal-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">
              &times;
            </button>
          )}
        </div>

        {/* Urgency Filter Pills */}
        <div className="urgency-pill-group">
          {[
            { id: 'all', label: 'All Lots' },
            { id: 'critical', label: 'Critical < 6h', badgeClass: 'pill-crit' },
            { id: 'urgent', label: 'Urgent 6-24h', badgeClass: 'pill-urg' },
            { id: 'watch', label: 'Watch 24-72h', badgeClass: 'pill-watch' },
            { id: 'fresh', label: 'Fresh > 72h', badgeClass: 'pill-fresh' },
            { id: 'pending', label: 'Pending Review', badgeClass: 'pill-pending' },
            { id: 'approved', label: 'Active Markdown', badgeClass: 'pill-app' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveStatus(pill.id)}
              className={`urgency-filter-pill ${activeStatus === pill.id ? 'active' : ''} ${pill.badgeClass || ''}`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Batch Actions */}
        <div className="action-buttons-group">
          <div className="view-mode-pill-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${displayView === 'cards' ? 'active' : ''}`}
              onClick={() => setDisplayView('cards')}
              title="Visual Shelf Card View"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${displayView === 'table' ? 'active' : ''}`}
              onClick={() => setDisplayView('table')}
              title="Dense Spreadsheet Ledger"
            >
              <List size={14} />
              <span>Ledger</span>
            </button>
          </div>

          <button
            onClick={onBatchAutoApprove}
            disabled={isBatchProcessing || pendingCount === 0}
            className="btn-batch-auto"
            title="Auto-approves algorithmically suggested markdowns for items under 24 hours"
          >
            <Sparkles size={15} />
            {isBatchProcessing ? 'Processing Batch...' : `Batch Auto-Approve (${pendingCount})`}
          </button>

          <button onClick={onAddNewItem} className="btn-add-sku">
            <Plus size={15} />
            Add SKU Batch
          </button>
        </div>
      </div>

      {/* ── CONDITIONAL RENDER: VISUAL CARDS GRID VS DENSE LEDGER ── */}
      {loading ? (
        <div className="dashboard-loading-state">
          <RefreshCw size={28} className="spin text-emerald" />
          <span>Synchronizing live supermarket inventory with MongoDB...</span>
        </div>
      ) : filteredSortedItems.length === 0 ? (
        <div className="dashboard-empty-state">
          <AlertTriangle size={32} className="text-amber" />
          <h3>No Perishable Lots Match Criteria</h3>
          <p>Try clearing filters or search terms to inspect all monitored supermarket stock.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setActiveStatus('all');
            }}
            className="btn-reset-filters"
          >
            Reset All Filters
          </button>
        </div>
      ) : displayView === 'cards' ? (
        /* ── VIEW MODE 1: VISUAL SHELF CARD GRID ── */
        <div className="visual-shelf-grid">
          {filteredSortedItems.map((item) => {
            const isCritical = item.hoursLeft <= 6;
            const isUrgent = item.hoursLeft > 6 && item.hoursLeft <= 24;
            const totalShelf = item.totalShelfLifeHours || 72;
            const decayRatio = Math.max(0, Math.min(1, item.hoursLeft / totalShelf));
            const dynamicPrice = item.discountPrice || item.basePrice;
            const isApproved = item.status === 'approved';
            const suggestedPct = isCritical ? 70 : isUrgent ? 40 : item.hoursLeft <= 72 ? 15 : 0;
            const suggestedPrice = (item.basePrice * (1 - suggestedPct / 100)).toFixed(2);

            return (
              <div
                key={item._id || item.id}
                className={`shelf-product-card ${isCritical ? 'card-critical-pulse' : ''} ${isApproved ? 'card-approved-border' : ''}`}
              >
                {/* Card Header */}
                <div className="card-top-bar">
                  <span className={`category-tag cat-${item.category.toLowerCase()}`}>
                    <span>{DEPT_ICONS[item.category] || '📦'}</span> {item.category}
                  </span>
                  <span className={`urgency-countdown-badge ${isCritical ? 'badge-crit' : isUrgent ? 'badge-urg' : 'badge-safe'}`}>
                    <Clock size={12} />
                    <span className="tnum">{item.hoursLeft}h left</span>
                  </span>
                </div>

                {/* Product Title & Identifiers */}
                <div className="card-body-meta">
                  <h4 className="shelf-card-title">{item.name}</h4>
                  <div className="shelf-card-sku-row font-mono">
                    <span>{item.sku || 'SKU-GEN'}</span>
                    <span className="bullet-sep">•</span>
                    <span>{item.batchId || 'BAT-2026'}</span>
                  </div>
                </div>

                {/* Stock Depth Progress */}
                <div className="shelf-card-stock-box">
                  <div className="stock-label-row">
                    <span className="text-dim">Shelf Depth:</span>
                    <strong className="tnum text-white">{item.qty} units</strong>
                    <span className="text-dim font-mono">({item.depletionRate || 1.8} u/h)</span>
                  </div>
                  <div className="stock-bar-track">
                    <div
                      className="stock-bar-fill"
                      style={{ width: `${Math.min(100, (item.qty / (item.initialStock || item.qty * 1.5)) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Price Tag Box */}
                <div className="shelf-card-price-box">
                  <div className="price-tag-content">
                    <span className="price-tag-label">Dynamic Price</span>
                    <div className="price-tag-numbers">
                      {isApproved ? (
                        <>
                          <span className="struck-msrp tnum">${item.basePrice.toFixed(2)}</span>
                          <span className="active-dynamic-price tnum text-emerald">${dynamicPrice.toFixed(2)}</span>
                          <span className="active-markdown-badge font-mono">-{item.markdown}%</span>
                        </>
                      ) : suggestedPct > 0 ? (
                        <>
                          <span className="struck-msrp tnum">${item.basePrice.toFixed(2)}</span>
                          <span className="suggested-dynamic-price tnum text-amber">${suggestedPrice}</span>
                          <span className="suggested-markdown-badge font-mono">-{suggestedPct}% sug.</span>
                        </>
                      ) : (
                        <span className="standard-msrp tnum">${item.basePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* POS Status Badge */}
                  <div className="shelf-pos-badge">
                    <span className={`pos-dot ${item.posSyncStatus === 'synced' ? 'dot-synced' : 'dot-pending'}`}></span>
                    <span className="font-mono text-dim">{item.posSyncStatus === 'synced' ? 'POS Synced' : 'Sync Pending'}</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="shelf-card-actions">
                  <button
                    type="button"
                    onClick={() => onReviewMarkdown(item)}
                    className="btn-card-action-primary"
                  >
                    <Sliders size={13} />
                    <span>{isApproved ? 'Edit Markdown' : 'Review Markdown'}</span>
                  </button>

                  <div className="card-sub-actions">
                    <button
                      type="button"
                      onClick={() => onViewShelfTag(item)}
                      className="btn-card-icon"
                      title="Print / Preview Electronic Shelf Label"
                    >
                      <Barcode size={14} className="text-amber" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSimulatePosSync(item)}
                      className="btn-card-icon"
                      title="Broadcast POS Webhook Sync"
                    >
                      <Radio size={14} className="text-cyan" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditItem(item)}
                      className="btn-card-icon"
                      title="Edit Lot Metadata"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item)}
                      className="btn-card-icon delete-icon"
                      title="Remove Lot"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── VIEW MODE 2: DENSE SPREADSHEET LEDGER ── */
        <div className="queue-table-container">
          <table className="terminal-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('sku')} className="sortable-th">
                  SKU / Batch ID <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('name')} className="sortable-th">
                  Product Name <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('category')} className="sortable-th">
                  Dept <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('qty')} className="sortable-th">
                  Stock Depth <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('hoursLeft')} className="sortable-th">
                  Expiry Countdown <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('basePrice')} className="sortable-th">
                  MSRP <ArrowUpDown size={12} />
                </th>
                <th onClick={() => handleSort('dynamicPrice')} className="sortable-th">
                  Dynamic Price <ArrowUpDown size={12} />
                </th>
                <th>Dynamic Tier</th>
                <th>POS Sync</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedItems.map((item) => {
                const isCritical = item.hoursLeft <= 6;
                const isUrgent = item.hoursLeft > 6 && item.hoursLeft <= 24;
                const totalShelf = item.totalShelfLifeHours || 72;
                const decayRatio = Math.max(0, Math.min(1, item.hoursLeft / totalShelf));
                const dynamicPrice = item.discountPrice || item.basePrice;
                const isApproved = item.status === 'approved';
                const suggestedPct = isCritical ? 70 : isUrgent ? 40 : item.hoursLeft <= 72 ? 15 : 0;
                const suggestedPrice = (item.basePrice * (1 - suggestedPct / 100)).toFixed(2);

                return (
                  <tr
                    key={item._id || item.id}
                    className={`queue-row ${isCritical ? 'row-critical' : ''} ${isApproved ? 'row-approved' : ''}`}
                  >
                    <td className="cell-sku">
                      <span className="sku-code">{item.sku || 'SKU-GEN'}</span>
                      <span className="batch-code">{item.batchId || 'BAT-2026'}</span>
                    </td>

                    <td className="cell-name">
                      <strong className="item-name-text">{item.name}</strong>
                      {item.managerNote && (
                        <span className="manager-note-preview" title={item.managerNote}>
                          &ldquo;{item.managerNote}&rdquo;
                        </span>
                      )}
                    </td>

                    <td>
                      <span className={`category-tag cat-${item.category.toLowerCase()}`}>
                        <span>{DEPT_ICONS[item.category] || '📦'}</span> {item.category}
                      </span>
                    </td>

                    <td className="cell-stock tnum">
                      <div className="stock-counter">
                        <strong>{item.qty}</strong> units
                        <span className="stock-rate text-dim">({item.depletionRate || 1.8}/h)</span>
                      </div>
                      <div className="stock-micro-bar">
                        <div
                          className="stock-micro-fill"
                          style={{ width: `${Math.min(100, (item.qty / (item.initialStock || item.qty * 1.5)) * 100)}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="cell-expiry">
                      <div className="expiry-indicator-row">
                        <Clock size={13} className={isCritical ? 'text-rose' : isUrgent ? 'text-amber' : 'text-dim'} />
                        <span className={`expiry-time-text tnum ${isCritical ? 'critical-glow text-rose' : ''}`}>
                          {item.hoursLeft}h left
                        </span>
                      </div>
                      <div className="decay-progress-bar">
                        <div
                          className={`decay-bar-fill ${isCritical ? 'decay-crit' : isUrgent ? 'decay-urg' : 'decay-fresh'}`}
                          style={{ width: `${decayRatio * 100}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="cell-msrp tnum">
                      <span className={item.markdown ? 'struck-through' : ''}>
                        ${item.basePrice.toFixed(2)}
                      </span>
                    </td>

                    <td className="cell-dynamic-price tnum">
                      {isApproved ? (
                        <div className="approved-price-pill">
                          <strong className="text-emerald">${dynamicPrice.toFixed(2)}</strong>
                          <span className="disc-badge">-{item.markdown}%</span>
                        </div>
                      ) : suggestedPct > 0 ? (
                        <div className="suggested-price-pill">
                          <span className="text-amber">${suggestedPrice}</span>
                          <span className="suggested-badge">-{suggestedPct}% sug.</span>
                        </div>
                      ) : (
                        <span className="text-dim">${item.basePrice.toFixed(2)}</span>
                      )}
                    </td>

                    <td>
                      <span className={`tier-badge tier-${(item.dynamicTier || (isCritical ? 'T-6_CRITICAL' : isUrgent ? 'T-24_URGENT' : 'FRESH_PAR')).toLowerCase()}`}>
                        {item.dynamicTier || (isCritical ? 'T-6 CRITICAL' : isUrgent ? 'T-24 URGENT' : 'FRESH PAR')}
                      </span>
                    </td>

                    <td>
                      <div className="pos-status-chip">
                        <span className={`pos-dot ${item.posSyncStatus === 'synced' ? 'dot-synced' : 'dot-pending'}`}></span>
                        <span>{item.posSyncStatus === 'synced' ? 'Synced' : 'Pending'}</span>
                      </div>
                    </td>

                    <td className="cell-actions" style={{ textAlign: 'right' }}>
                      <div className="action-buttons-cell">
                        <button
                          onClick={() => onReviewMarkdown(item)}
                          className="btn-action-primary"
                          title="Review algorithmic pricing and approve markdown"
                        >
                          <Sliders size={13} />
                          {isApproved ? 'Edit Markdown' : 'Approve Markdown'}
                        </button>

                        <button
                          onClick={() => onViewShelfTag(item)}
                          className="btn-action-icon"
                          title="View Digital Electronic Shelf Label"
                        >
                          <Barcode size={13} className="text-amber" />
                        </button>

                        <button
                          onClick={() => onSimulatePosSync(item)}
                          className="btn-action-icon"
                          title="Broadcast POS & ESL Webhook"
                        >
                          <Radio size={13} className="text-cyan" />
                        </button>

                        <button
                          onClick={() => onEditItem(item)}
                          className="btn-action-icon"
                          title="Edit Lot Record"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          onClick={() => onDeleteItem(item)}
                          className="btn-action-icon delete-icon"
                          title="Delete SKU Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── QUEUE FOOTER SUMMARY ── */}
      <div className="queue-footer">
        <div className="queue-footer-left">
          <span>Showing <strong>{filteredSortedItems.length}</strong> of <strong>{items.length}</strong> monitored perishable lots</span>
          <span className="footer-bullet">•</span>
          <span>MongoDB Compound Index: <code>{'{ category: 1, hoursLeft: 1, status: 1 }'}</code></span>
        </div>
        <div className="queue-footer-right">
          <button onClick={refreshData} className="btn-refresh-terminal">
            <RefreshCw size={13} />
            Refresh Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}

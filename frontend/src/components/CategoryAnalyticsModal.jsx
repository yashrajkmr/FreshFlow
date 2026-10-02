// FreshFlow Department-Level Perishable Risk & Valuation Analytics Modal
// Visualizes department waste exposure, dynamic recovery rates, and critical SKU density
import React from 'react';

const CATEGORIES = ['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen'];

function CategoryAnalyticsModal({ isOpen, onClose, items }) {
  if (!isOpen) return null;

  const totalSKUs = items.length;
  const totalValueAtRisk = items.reduce((acc, item) => acc + item.basePrice * item.qty, 0);

  // Department analytics rollup
  const departmentStats = CATEGORIES.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    const count = catItems.length;
    const valueAtRisk = catItems.reduce((acc, i) => acc + i.basePrice * i.qty, 0);
    const criticalCount = catItems.filter((i) => i.hoursLeft < 6 && i.status !== 'approved').length;
    const approvedCount = catItems.filter((i) => i.status === 'approved').length;

    const marginProtected = catItems
      .filter((i) => i.status === 'approved' && i.markdown)
      .reduce((acc, i) => {
        const discounted = i.discountPrice || i.basePrice * (1 - i.markdown / 100);
        return acc + discounted * i.qty;
      }, 0);

    const shareOfRisk = totalValueAtRisk > 0 ? Math.round((valueAtRisk / totalValueAtRisk) * 100) : 0;
    const recoveryRate = valueAtRisk > 0 ? Math.round((marginProtected / valueAtRisk) * 100) : 0;

    return {
      category: cat,
      count,
      valueAtRisk,
      criticalCount,
      approvedCount,
      marginProtected,
      shareOfRisk,
      recoveryRate
    };
  });

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="analytics-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="analyticsTitle"
      >
        <div className="analytics-modal-header">
          <div className="analytics-header-left">
            <span className="analytics-header-icon">
              <i className="fa-solid fa-chart-pie"></i>
            </span>
            <div>
              <h3 id="analyticsTitle" className="analytics-modal-title">Perishable Category Risk Analytics</h3>
              <p className="analytics-modal-subtitle">Department Valuation Breakdown & Markdown Salvage Performance</p>
            </div>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Top Summary Stats */}
        <div className="analytics-summary-strip">
          <div className="summary-strip-card">
            <span className="strip-label">Total Monitored Value</span>
            <span className="strip-val text-accent">₹{Math.round(totalValueAtRisk).toLocaleString('en-IN')}</span>
            <span className="strip-sub">{totalSKUs} Perishable SKUs</span>
          </div>

          <div className="summary-strip-card">
            <span className="strip-label">Highest Exposure Dept</span>
            <span className="strip-val">
              {departmentStats.reduce((max, c) => (c.valueAtRisk > max.valueAtRisk ? c : max), departmentStats[0])?.category || 'N/A'}
            </span>
            <span className="strip-sub">Largest inventory value at risk</span>
          </div>

          <div className="summary-strip-card">
            <span className="strip-label">Critical Action Queue</span>
            <span className="strip-val text-critical">
              {items.filter((i) => i.hoursLeft < 6 && i.status !== 'approved').length} SKUs
            </span>
            <span className="strip-sub">&lt; 6 hours to total food spoilage</span>
          </div>
        </div>

        {/* Department Breakdown Table / Bars */}
        <div className="department-breakdown-list">
          {departmentStats.map((dept) => (
            <div key={dept.category} className="dept-stat-card">
              <div className="dept-header-row">
                <div className="dept-title-group">
                  <span className="dept-name">{dept.category}</span>
                  <span className="dept-sku-count">{dept.count} SKUs</span>
                  {dept.criticalCount > 0 && (
                    <span className="dept-critical-pill">
                      <i className="fa-solid fa-triangle-exclamation"></i> {dept.criticalCount} Critical
                    </span>
                  )}
                </div>
                <div className="dept-metrics-group">
                  <span className="dept-val">₹{Math.round(dept.valueAtRisk).toLocaleString('en-IN')} at risk</span>
                  <span className="dept-share">({dept.shareOfRisk}% share)</span>
                </div>
              </div>

              {/* Exposure Progress Bar */}
              <div className="dept-progress-track">
                <div
                  className="dept-progress-fill"
                  style={{ width: `${Math.min(100, Math.max(5, dept.shareOfRisk))}%` }}
                ></div>
              </div>

              {/* Sub Metrics Row */}
              <div className="dept-footer-row">
                <span className="dept-footer-item">
                  <i className="fa-solid fa-check-circle text-healthy"></i> {dept.approvedCount} Markdowns Approved
                </span>
                <span className="dept-footer-item text-healthy">
                  ₹{Math.round(dept.marginProtected).toLocaleString('en-IN')} Revenue Salvaged ({dept.recoveryRate}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="analytics-modal-footer">
          <button type="button" className="btn-secondary-compact" onClick={onClose}>
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryAnalyticsModal;

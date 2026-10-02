// FreshFlow North-Star Overview Component (Plausible / Mercury benchmark)
// Leads with one authoritative North-Star metric top-left with disciplined progressive breakdown
import React from 'react';

function StatsOverview({ items }) {
  const totalCount = items.length;
  const criticalItems = items.filter((i) => i.hoursLeft < 6 && i.status !== 'approved');
  const criticalCount = criticalItems.length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;

  // North-Star metric: Total inventory valuation currently at risk of expiration
  const totalValueAtRisk = items.reduce((sum, i) => sum + i.basePrice * i.qty, 0);

  // Margin Protected: Value salvaged via dynamic markdown recommendations
  const valueProtected = items
    .filter((i) => i.status === 'approved' && i.markdown)
    .reduce((sum, i) => {
      const discounted = i.discountPrice || i.basePrice * (1 - i.markdown / 100);
      return sum + discounted * i.qty;
    }, 0);

  const salvageRate = totalValueAtRisk > 0 ? Math.round((valueProtected / totalValueAtRisk) * 100) : 0;

  return (
    <section className="north-star-bar" aria-label="Operational Inventory Metrics">
      <div className="north-star-container">
        {/* Left: Primary North-Star Metric */}
        <div className="metric-lead-block">
          <div className="metric-lead-header">
            <span className="metric-eyebrow">Inventory Value at Risk (24h Window)</span>
          </div>
          <div className="metric-lead-number">
            <span className="currency-symbol">₹</span>
            <span className="stat-figure">{Math.round(totalValueAtRisk).toLocaleString('en-IN')}</span>
          </div>
          <p className="metric-lead-context">
            Monitored across <strong>{totalCount} perishable SKUs</strong> under active expiry surveillance.
          </p>
        </div>

        {/* Right: Disciplined Secondary Indicators (Mercury / Plausible Standard) */}
        <div className="secondary-metrics-grid">
          {/* Margin Protected */}
          <div className="secondary-metric-item">
            <span className="sec-label">Margin Protected</span>
            <div className="sec-val-row">
              <span className="sec-val text-healthy">
                ₹{Math.round(valueProtected).toLocaleString('en-IN')}
              </span>
              <span className="sec-pill pill-healthy">+{salvageRate}%</span>
            </div>
            <span className="sec-sub">Salvaged via dynamic markdowns</span>
          </div>

          {/* Critical Liquidation Alert */}
          <div className="secondary-metric-item">
            <span className="sec-label">Critical Window (&lt; 6h)</span>
            <div className="sec-val-row">
              <span className={`sec-val ${criticalCount > 0 ? 'text-critical' : 'text-neutral'}`}>
                {criticalCount} SKUs
              </span>
              {criticalCount > 0 && (
                <span className="sec-pill pill-critical">Urgent Action</span>
              )}
            </div>
            <span className="sec-sub">Risk of 100% write-off</span>
          </div>

          {/* Recommendation Pipeline */}
          <div className="secondary-metric-item">
            <span className="sec-label">Recommendation Pipeline</span>
            <div className="sec-val-row">
              <span className="sec-val text-neutral">
                {pendingCount} Pending
              </span>
              <span className="sec-badge-neutral">{approvedCount} Active</span>
            </div>
            <span className="sec-sub">Automated pricing queue</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsOverview;

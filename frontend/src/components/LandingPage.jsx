// FreshFlow Top 1% Landing Page - Industrial Kinetic FinTech & Modern Supermarket Tech Standard
// Real-World Photography Backdrop, Live Hero Simulator, 4-Step Retail Lifecycle, Architecture Visualizer, Bento, and ROI Model
import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Sliders,
  Cpu,
  Server,
  Radio,
  Zap,
  ShieldAlert,
  BarChart3,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Clock,
  Box,
  Leaf,
  Layers,
  ChevronRight,
  ExternalLink,
  Store,
  Sparkles,
  Barcode,
  Truck,
  FileCheck2,
  Activity,
  Tag
} from 'lucide-react';
import { evaluatePerishableBatch } from '../utils/pricingMath.js';

export default function LandingPage({ onNavigateToDashboard, onNavigateToEngine, onNavigateToApi, onNavigateToAuth }) {
  // ── Hero Simulator Interactive State ──
  const [selectedProductKey, setSelectedProductKey] = useState('salmon');
  const [simHoursLeft, setSimHoursLeft] = useState(8);

  const heroProducts = {
    salmon: {
      name: 'Fresh Atlantic Salmon Fillet 400g',
      sku: 'SKU-SEA-301',
      category: 'Seafood',
      icon: '🦐',
      basePrice: 420,
      totalShelfLifeHours: 40,
      qty: 18,
      depletionRate: 1.4,
      priceElasticity: -1.8,
      floorPrice: 150
    },
    sourdough: {
      name: 'Artisan Sourdough Boule 650g',
      sku: 'SKU-BAK-101',
      category: 'Bakery',
      icon: '🥖',
      basePrice: 120,
      totalShelfLifeHours: 36,
      qty: 24,
      depletionRate: 2.2,
      priceElasticity: -2.4,
      floorPrice: 40
    },
    wagyu: {
      name: 'Wagyu Ribeye Steak MB6+ 350g',
      sku: 'SKU-MEA-601',
      category: 'Meat',
      icon: '🥩',
      basePrice: 850,
      totalShelfLifeHours: 72,
      qty: 12,
      depletionRate: 0.8,
      priceElasticity: -1.5,
      floorPrice: 350
    },
    strawberries: {
      name: 'California Organic Strawberries 400g',
      sku: 'SKU-PRO-403',
      category: 'Produce',
      icon: '🍓',
      basePrice: 180,
      totalShelfLifeHours: 96,
      qty: 40,
      depletionRate: 2.8,
      priceElasticity: -2.1,
      floorPrice: 65
    }
  };

  const activeProduct = heroProducts[selectedProductKey];

  // Calculate dynamic simulation metrics
  const simReport = useMemo(() => {
    return evaluatePerishableBatch({
      basePrice: activeProduct.basePrice,
      hoursLeft: simHoursLeft,
      totalShelfLifeHours: activeProduct.totalShelfLifeHours,
      qty: activeProduct.qty,
      depletionRate: activeProduct.depletionRate,
      priceElasticity: activeProduct.priceElasticity,
      floorPrice: activeProduct.floorPrice,
      category: activeProduct.category
    });
  }, [selectedProductKey, simHoursLeft]);

  // ── Enterprise ROI Calculator State ──
  const [storeCount, setStoreCount] = useState(30);
  const [monthlyRevenuePerStore, setMonthlyRevenuePerStore] = useState(420000); // $420k perishable monthly

  const roiMetrics = useMemo(() => {
    const baselineShrinkageRate = 0.038; // 3.8% grocery perishable industry loss
    const freshFlowShrinkageRate = 0.005; // 0.5% with FreshFlow dynamic markdowns

    const totalAnnualPerishableRevenue = storeCount * monthlyRevenuePerStore * 12;
    const baselineLoss = totalAnnualPerishableRevenue * baselineShrinkageRate;
    const freshFlowLoss = totalAnnualPerishableRevenue * freshFlowShrinkageRate;
    const annualMarginSaved = baselineLoss - freshFlowLoss;
    const foodWasteAvoidedTons = Math.round((annualMarginSaved / 6.8) / 1000); // ~$6.80/kg food

    return {
      annualPerishableVolume: totalAnnualPerishableRevenue,
      baselineAnnualSpoilage: baselineLoss,
      annualMarginSaved,
      foodWasteAvoidedTons,
      paybackPeriodWeeks: 2.8
    };
  }, [storeCount, monthlyRevenuePerStore]);

  // ── Architecture Visualizer State ──
  const [isSyncingArchitecture, setIsSyncingArchitecture] = useState(false);
  const [archSyncTimestamp, setArchSyncTimestamp] = useState(null);

  const handleSimulateSync = () => {
    setIsSyncingArchitecture(true);
    setTimeout(() => {
      setIsSyncingArchitecture(false);
      setArchSyncTimestamp(new Date().toLocaleTimeString());
    }, 1000);
  };

  return (
    <div className="landing-container">
      {/* ── Top Announcement Ribbon ── */}
      <div className="announcement-banner">
        <span className="announcement-pill">ENTERPRISE SYSTEM ARCHITECTURE</span>
        <span className="announcement-text">
          FreshFlow Algorithmic Dynamic Markdown & Perishable Spoilage Engine — Active v2.6 Core
        </span>
        <button onClick={onNavigateToAuth} className="announcement-link">
          Store Staff Portal <ArrowRight size={13} />
        </button>
      </div>

      {/* ── CINEMATIC HERO SECTION WITH SUPERMARKET BACKGROUND ── */}
      <section className="hero-cinematic-wrapper">
        <div className="hero-backdrop-image-container">
          <img
            src="/images/supermarket-hero.jpg"
            alt="Modern Organic Supermarket Aisle"
            className="hero-backdrop-image"
          />
          <div className="hero-cinematic-scrim"></div>
        </div>

        <div className="hero-inner-content">
          <div className="hero-text-block">
            <div className="hero-pill-badge">
              <span className="pulse-indicator"></span>
              RETAIL LOGISTICS & FOOD SHRINKAGE ELIMINATION
            </div>

            <h1 className="hero-headline">
              Turn Perishable Loss into Margin.<br />
              <span className="hero-highlight">Automatically.</span>
            </h1>

            <p className="hero-subheadline">
              FreshFlow replaces manual clearance stickers with mathematical decay velocity modeling. Continuously evaluating shelf life ($t_{'{'}rem{'}'} / t_{'{'}total{'}'}$), stock depth, and demand elasticity to broadcast automated price adjustments to POS registers and Electronic Shelf Labels before food goes to waste.
            </p>

            <div className="hero-actions">
              <button onClick={onNavigateToDashboard} className="btn-primary-hero">
                <Zap size={18} />
                Launch Operations Console
              </button>
              <button onClick={onNavigateToAuth} className="btn-secondary-hero">
                <Store size={18} />
                Staff Sign In & Demo
              </button>
            </div>

            {/* Quick KPI Ticker */}
            <div className="hero-quick-stats">
              <div className="quick-stat-item">
                <span className="quick-stat-val tnum">99.4%</span>
                <span className="quick-stat-lbl">Sell-Through SLA</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="quick-stat-val tnum text-emerald">&lt; 42ms</span>
                <span className="quick-stat-lbl">POS Sync Latency</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="quick-stat-val tnum text-cyan">-85%</span>
                <span className="quick-stat-lbl">Shrinkage Reduction</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="quick-stat-val tnum text-amber">$14.2M+</span>
                <span className="quick-stat-lbl">Chainwide Salvage</span>
              </div>
            </div>
          </div>

          {/* ── LIVE INTERACTIVE HERO SIMULATOR WIDGET ── */}
          <div className="hero-simulator-wrapper">
            <div className="simulator-card">
              <div className="simulator-header">
                <div className="simulator-title-group">
                  <Sliders size={16} className="text-emerald" />
                  <span className="simulator-title">LIVE DYNAMIC PRICING SIMULATOR</span>
                </div>
                <span className="simulator-badge">Model v2.6</span>
              </div>

              {/* Product Preset Tabs */}
              <div className="product-selector-tabs">
                {Object.entries(heroProducts).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProductKey(key)}
                    className={`product-tab-btn ${selectedProductKey === key ? 'active' : ''}`}
                  >
                    <span>{p.icon}</span> {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* SKU Header Bar */}
              <div className="simulator-sku-meta">
                <div>
                  <div className="sku-title">{activeProduct.name}</div>
                  <div className="sku-sub">
                    SKU: <strong className="text-white font-mono">{activeProduct.sku}</strong> • Shelf Life: {activeProduct.totalShelfLifeHours}h • Shelf Depth: {activeProduct.qty} units
                  </div>
                </div>
                <div className="sku-base-tag">
                  MSRP: <strong>${activeProduct.basePrice}</strong>
                </div>
              </div>

              {/* Interactive Hours Slider */}
              <div className="slider-control-block">
                <div className="slider-label-row">
                  <span className="slider-label">
                    <Clock size={14} className="text-amber" />
                    Hours to Expiration ($t_{'{'}remaining{'}'}$):
                  </span>
                  <span className="slider-number-display tnum">
                    {simHoursLeft} hours <span className="text-dim">/ {activeProduct.totalShelfLifeHours}h</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={Math.min(72, activeProduct.totalShelfLifeHours)}
                  step="1"
                  value={simHoursLeft}
                  onChange={(e) => setSimHoursLeft(Number(e.target.value))}
                  className="simulator-slider"
                />
                <div className="slider-ticks">
                  <span className="text-rose">Critical (&le;6h: -70%)</span>
                  <span className="text-amber">Urgent (&le;24h: -40%)</span>
                  <span className="text-emerald">Watch (&le;72h: -15%)</span>
                  <span className="text-dim">Fresh Par (0%)</span>
                </div>
              </div>

              {/* Dynamic Price & Barcode Tag Preview */}
              <div className="simulator-results-grid">
                <div className="result-tile primary-result">
                  <div className="tile-top-row">
                    <span className="tile-label">ALGORITHMIC DYNAMIC SHELF TAG</span>
                    <span className={`discount-pill tier-${simReport.pricingRecommendation.tier.toLowerCase()}`}>
                      {simReport.pricingRecommendation.tier} • -{simReport.pricingRecommendation.recommendedMarkdownPct}%
                    </span>
                  </div>

                  <div className="price-delta-group">
                    <span className="base-struck-price">${activeProduct.basePrice}</span>
                    <span className="dynamic-price-highlight tnum">
                      ${simReport.pricingRecommendation.dynamicPrice}
                    </span>
                    <span className="unit-saved-tag">
                      Save ${simReport.pricingRecommendation.unitSavings} / unit
                    </span>
                  </div>

                  {/* Simulated Code128 Barcode Strip */}
                  <div className="simulated-barcode-strip">
                    <div className="barcode-bars">
                      ||| | |||| | || ||| || |||| | ||| | || |||| | ||| || ||
                    </div>
                    <div className="barcode-sub-text font-mono">
                      {activeProduct.sku} • POS-TAG-${simReport.pricingRecommendation.dynamicPrice}
                    </div>
                  </div>

                  <span className="tile-foot-note">
                    {simReport.pricingRecommendation.tierDescription}
                  </span>
                </div>

                <div className="result-sub-grid">
                  <div className="result-tile">
                    <span className="tile-label">DECAY RATIO (&tau;)</span>
                    <div className="tile-value tnum">
                      {(simReport.decayAnalysis.decayVelocityRatio * 100).toFixed(1)}%
                    </div>
                    <span className="tile-sub">t_rem / t_total</span>
                  </div>

                  <div className="result-tile">
                    <span className="tile-label">DEMAND SURGE</span>
                    <div className="tile-value tnum text-emerald">
                      +{simReport.elasticityAndClearance.projectedDemandSurgePercent}%
                    </div>
                    <span className="tile-sub">&Delta;Q / Q via elasticity</span>
                  </div>

                  <div className="result-tile">
                    <span className="tile-label">SELL-THROUGH</span>
                    <div className="tile-value tnum text-cyan">
                      {simReport.financialAndEsgImpact.projectedSellThroughPercent}%
                    </div>
                    <span className="tile-sub">Projected batch clearance</span>
                  </div>

                  <div className="result-tile">
                    <span className="tile-label">MARGIN SALVAGED</span>
                    <div className="tile-value tnum text-emerald">
                      ${simReport.financialAndEsgImpact.grossRevenueSalvaged}
                    </div>
                    <span className="tile-sub">Batch gross recovery</span>
                  </div>
                </div>
              </div>

              <div className="simulator-card-footer">
                <div className="model-proof-text">
                  <code>{simReport.mathematicalProof.formula1_DecayVelocity}</code>
                  <span className="bullet-sep">•</span>
                  <code>{simReport.mathematicalProof.formula3_PriceElasticity}</code>
                </div>
                <button onClick={onNavigateToEngine} className="sim-deep-dive-btn">
                  Inspect Algorithmic Math <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-STEP RETAIL WORKFLOW SECTION ── */}
      <section className="workflow-section">
        <div className="section-header">
          <div className="section-eyebrow">
            <Activity size={14} className="text-emerald" />
            OPERATIONAL LIFECYCLE
          </div>
          <h2 className="section-title">The Complete Supermarket Perishable Workflow</h2>
          <p className="section-description">
            How store associates and department leads use FreshFlow from dock delivery to consumer checkout.
          </p>
        </div>

        <div className="workflow-cards-grid">
          {/* Step 1 */}
          <div className="workflow-step-card">
            <div className="step-num-pill">PHASE 01</div>
            <div className="step-icon-box">
              <Truck size={22} className="text-cyan" />
            </div>
            <h3 className="step-title">Warehouse Lot Ingestion</h3>
            <p className="step-desc">
              Pallets arrive with expiration manifests. FreshFlow ingests batch SKUs via REST/gRPC and initializes decay countdown timers.
            </p>
            <div className="step-tag-pill font-mono">POST /api/v1/inventory/batch</div>
          </div>

          {/* Step 2 */}
          <div className="workflow-step-card">
            <div className="step-num-pill">PHASE 02</div>
            <div className="step-icon-box">
              <Cpu size={22} className="text-amber" />
            </div>
            <h3 className="step-title">Velocity & Decay Evaluation</h3>
            <p className="step-desc">
              The engine evaluates shelf-life decay velocity ($\tau$) and stock depth ($\rho$) every minute, mapping lots into tiered markdown schedules.
            </p>
            <div className="step-tag-pill font-mono">Continuous Decay Matrix</div>
          </div>

          {/* Step 3 */}
          <div className="workflow-step-card">
            <div className="step-num-pill">PHASE 03</div>
            <div className="step-icon-box">
              <FileCheck2 size={22} className="text-emerald" />
            </div>
            <h3 className="step-title">Gated Manager Approval</h3>
            <p className="step-desc">
              Store managers review recommended markdowns with real-time elasticity math, add justification notes, and authorize discounts.
            </p>
            <div className="step-tag-pill font-mono">Dual-Layer FS Audit Log</div>
          </div>

          {/* Step 4 */}
          <div className="workflow-step-card">
            <div className="step-num-pill">PHASE 04</div>
            <div className="step-icon-box">
              <Radio size={22} className="text-rose" />
            </div>
            <h3 className="step-title">Sub-50ms Edge Sync</h3>
            <p className="step-desc">
              Price changes broadcast immediately to cash registers, Electronic Shelf Labels (ESL), and store apps, synchronizing checkout tags.
            </p>
            <div className="step-tag-pill font-mono">POST /api/v1/pos/sync</div>
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTED ARCHITECTURE VISUALIZER ── */}
      <section className="architecture-section">
        <div className="section-header">
          <div className="section-eyebrow">DISTRIBUTED EVENT-DRIVEN MESH</div>
          <h2 className="section-title">High-Availability Retail Integration Architecture</h2>
          <p className="section-description">
            FreshFlow sits as an autonomous orchestration layer between core Warehouse ERP systems, cloud pricing models, POS cash registers, and physical electronic shelf tags.
          </p>
        </div>

        <div className="architecture-canvas">
          <div className="arch-node-container">
            {/* Node 1: Warehouse ERP */}
            <div className="arch-node">
              <div className="node-icon-box">
                <Server size={22} className="text-cyan" />
              </div>
              <div className="node-title">Warehouse ERP & Manifests</div>
              <div className="node-tag">SAP / Oracle Ingestion</div>
              <p className="node-desc">
                Pushes pallet batches with expiration timestamps, cold-chain telemetry, and initial lot quantities.
              </p>
              <div className="node-protocol">REST / gRPC Webhooks</div>
            </div>

            {/* Connecting Pipe 1 */}
            <div className={`arch-connector ${isSyncingArchitecture ? 'active-pulse' : ''}`}>
              <div className="connector-line"></div>
              <div className="connector-packet"></div>
            </div>

            {/* Node 2: FreshFlow Core Engine (The Brain) */}
            <div className="arch-node node-core">
              <div className="core-badge">CENTRAL LOGIC ENGINE</div>
              <div className="node-icon-box core-icon">
                <Cpu size={28} className="text-emerald" />
              </div>
              <div className="node-title">FreshFlow Pricing Engine</div>
              <div className="node-tag">Decay Velocity & Elasticity Mesh</div>
              <p className="node-desc">
                Stateless mathematical engine continuously evaluating expiry velocity ($\tau$), stock run-out risk ($\rho$), and margin floor safeguards.
              </p>
              <div className="node-status-badge">
                <span className="status-dot"></span> Active MongoDB 8.3 & Express
              </div>
            </div>

            {/* Connecting Pipe 2 */}
            <div className={`arch-connector ${isSyncingArchitecture ? 'active-pulse' : ''}`}>
              <div className="connector-line"></div>
              <div className="connector-packet"></div>
            </div>

            {/* Node 3: POS Terminals & ESL */}
            <div className="arch-node">
              <div className="node-icon-box">
                <Radio size={22} className="text-amber" />
              </div>
              <div className="node-title">POS & Electronic Shelf Labels</div>
              <div className="node-tag">Edge Store Hardware</div>
              <p className="node-desc">
                Instantly synchronizes updated barcodes, promotional tags, and checkout register prices in &lt; 42ms.
              </p>
              <div className="node-protocol">Sub-50ms Edge Broadcast</div>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="arch-controls">
            <button
              onClick={handleSimulateSync}
              disabled={isSyncingArchitecture}
              className="btn-trigger-sync"
            >
              <RefreshCw size={16} className={isSyncingArchitecture ? 'spin' : ''} />
              {isSyncingArchitecture ? 'Broadcasting POS Webhooks...' : 'Simulate Distributed Markdown Broadcast'}
            </button>
            {archSyncTimestamp && (
              <span className="sync-ack-badge">
                <CheckCircle2 size={14} className="text-emerald" />
                Synchronized across 4 enterprise endpoints at {archSyncTimestamp} (Avg Latency: 38ms)
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURE MATRIX ── */}
      <section className="bento-section">
        <div className="section-header">
          <div className="section-eyebrow">ENTERPRISE SYSTEM CAPABILITIES</div>
          <h2 className="section-title">Engineered for Scale, Margin, and ESG Impact</h2>
          <p className="section-description">
            Four specialized operational modules designed to replace manual supermarket clearance stickers with algorithmic rigor.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Automated Markdown Scheduler */}
          <div className="bento-card bento-card-large">
            <div className="bento-icon-bar">
              <div className="bento-icon"><Clock size={20} className="text-emerald" /></div>
              <span className="bento-category">CORE ENGINE</span>
            </div>
            <h3 className="bento-title">Automated Markdown Scheduler</h3>
            <p className="bento-desc">
              Replaces static clearance tags with dynamic time-based schedules. Continuously triggers multi-tiered discounts (T-72h: -15%, T-24h: -40%, T-6h: -70%) aligned with departmental demand elasticity.
            </p>
            <div className="bento-stat-pill-group">
              <div className="bento-stat-chip">
                <strong>4 Tiers</strong> <span>Automated Transition</span>
              </div>
              <div className="bento-stat-chip">
                <strong>Floor Protected</strong> <span>Never sells below salvage</span>
              </div>
            </div>
          </div>

          {/* Card 2: Batch & SKU Expiry Heatmaps */}
          <div className="bento-card">
            <div className="bento-icon-bar">
              <div className="bento-icon"><Layers size={20} className="text-amber" /></div>
              <span className="bento-category">VISIBILITY</span>
            </div>
            <h3 className="bento-title">Batch & SKU Expiry Heatmaps</h3>
            <p className="bento-desc">
              Visual real-time risk density across Bakery, Dairy, Produce, Meat, and Seafood departments to isolate spoilage hotspots before they materialize.
            </p>
            <div className="mini-heatmap-preview">
              <div className="heatmap-cell cell-crit">Meat: &lt;6h</div>
              <div className="heatmap-cell cell-urg">Dairy: 9h</div>
              <div className="heatmap-cell cell-safe">Produce: 48h</div>
            </div>
          </div>

          {/* Card 3: POS REST Sync & Webhooks */}
          <div className="bento-card">
            <div className="bento-icon-bar">
              <div className="bento-icon"><Zap size={20} className="text-cyan" /></div>
              <span className="bento-category">INTEGRATION</span>
            </div>
            <h3 className="bento-title">POS REST Sync & Webhook Dispatcher</h3>
            <p className="bento-desc">
              Idempotent webhook pipeline that pushes approved price reductions simultaneously to electronic shelf labels, self-checkouts, and online store feeds.
            </p>
            <div className="protocol-chip-list">
              <span className="protocol-badge">POS Registers</span>
              <span className="protocol-badge">ESL E-Ink Tags</span>
              <span className="protocol-badge">SAP OData</span>
            </div>
          </div>

          {/* Card 4: ESG Waste Reduction */}
          <div className="bento-card bento-card-large">
            <div className="bento-icon-bar">
              <div className="bento-icon"><Leaf size={20} className="text-emerald" /></div>
              <span className="bento-category">SUSTAINABILITY & ESG</span>
            </div>
            <h3 className="bento-title">ESG Waste Reduction & Carbon Credit Metrics</h3>
            <p className="bento-desc">
              Transforms salvaged inventory into certified Scope 3 emissions reductions. Every salvaged kilogram of food directly reduces municipal landfill methane emissions, generating auditable ESG compliance data.
            </p>
            <div className="bento-esg-metrics">
              <div className="esg-metric-item">
                <span className="esg-val tnum">1.85 kg</span>
                <span className="esg-lbl">CO2e Saved / kg Food</span>
              </div>
              <div className="esg-metric-item">
                <span className="esg-val tnum">100%</span>
                <span className="esg-lbl">Auditable FS Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE ROI CALCULATOR ── */}
      <section className="roi-section">
        <div className="roi-card">
          <div className="roi-header">
            <div>
              <div className="section-eyebrow">FINANCIAL IMPACT MODEL</div>
              <h2 className="roi-title">Enterprise ROI & Shrinkage Recovery Calculator</h2>
              <p className="roi-desc">
                Model your chain's annual margin recovery based on typical grocery shrinkage (3.8% baseline reduced to 0.5% with algorithmic markdowns).
              </p>
            </div>
            <div className="roi-badge">
              <DollarSign size={16} className="text-emerald" />
              Financial Simulator
            </div>
          </div>

          <div className="roi-calculator-body">
            {/* Slider Controls */}
            <div className="roi-controls">
              <div className="roi-slider-group">
                <div className="roi-slider-label">
                  <span>Number of Supermarket Stores:</span>
                  <strong className="tnum text-emerald">{storeCount} stores</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={storeCount}
                  onChange={(e) => setStoreCount(Number(e.target.value))}
                  className="simulator-slider"
                />
                <div className="slider-ticks">
                  <span>1 Store</span>
                  <span>50 Stores</span>
                  <span>100 Stores</span>
                  <span>150 Stores</span>
                </div>
              </div>

              <div className="roi-slider-group">
                <div className="roi-slider-label">
                  <span>Monthly Perishable Revenue per Store:</span>
                  <strong className="tnum text-emerald">${(monthlyRevenuePerStore / 1000).toFixed(0)}k / month</strong>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={monthlyRevenuePerStore}
                  onChange={(e) => setMonthlyRevenuePerStore(Number(e.target.value))}
                  className="simulator-slider"
                />
                <div className="slider-ticks">
                  <span>$50k</span>
                  <span>$350k</span>
                  <span>$700k</span>
                  <span>$1.0M</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="roi-output-grid">
              <div className="roi-stat-box primary-stat">
                <span className="roi-box-label">PROJECTED ANNUAL MARGIN RECOVERY</span>
                <div className="roi-box-val tnum text-emerald">
                  ${(roiMetrics.annualMarginSaved / 1000000).toFixed(2)}M
                </div>
                <span className="roi-box-sub">Direct gross margin recaptured from spoilage</span>
              </div>

              <div className="roi-stat-box">
                <span className="roi-box-label">FOOD WASTE AVERTED</span>
                <div className="roi-box-val tnum text-cyan">
                  {roiMetrics.foodWasteAvoidedTons.toLocaleString()} Tons
                </div>
                <span className="roi-box-sub">Avoided landfill disposal fees</span>
              </div>

              <div className="roi-stat-box">
                <span className="roi-box-label">ESTIMATED PAYBACK PERIOD</span>
                <div className="roi-box-val tnum text-amber">
                  &lt; {roiMetrics.paybackPeriodWeeks} Weeks
                </div>
                <span className="roi-box-sub">Full deployment breakeven timeline</span>
              </div>
            </div>
          </div>

          <div className="roi-footer">
            <span>Ready to explore the live store inventory and active markdowns?</span>
            <button onClick={onNavigateToDashboard} className="btn-roi-cta">
              Open Mission-Control Console <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

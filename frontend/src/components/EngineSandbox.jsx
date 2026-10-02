// FreshFlow Algorithmic Engine Sandbox - Interviewer Logic Walkthrough Archetype
// Interactive Decay Curve Graph, Real-Time Parameter Sliders, Step-by-Step Proofs, and Live Backend API Inspector
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Cpu,
  Sliders,
  TrendingDown,
  Activity,
  Zap,
  Code2,
  CheckCircle2,
  Copy,
  Clock,
  DollarSign,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { evaluatePerishableBatch } from '../utils/pricingMath.js';

export default function EngineSandbox() {
  // ── Engine Parameters ──
  const [basePrice, setBasePrice] = useState(160);
  const [hoursLeft, setHoursLeft] = useState(14);
  const [totalShelfLifeHours, setTotalShelfLifeHours] = useState(72);
  const [qty, setQty] = useState(32);
  const [depletionRate, setDepletionRate] = useState(1.6);
  const [priceElasticity, setPriceElasticity] = useState(-2.0);
  const [floorPercent, setFloorPercent] = useState(30); // 30% floor
  const [category, setCategory] = useState('Dairy');

  // Backend Live Execution State
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLatencyMs, setApiLatencyMs] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Compute floor price in dollars
  const floorPrice = Number(((basePrice * floorPercent) / 100).toFixed(2));

  // Client-side instant evaluation
  const evaluation = useMemo(() => {
    return evaluatePerishableBatch({
      basePrice,
      hoursLeft,
      totalShelfLifeHours,
      qty,
      depletionRate,
      priceElasticity,
      floorPrice,
      category
    });
  }, [basePrice, hoursLeft, totalShelfLifeHours, qty, depletionRate, priceElasticity, floorPrice, category]);

  // Execute live API call to Node.js backend
  const triggerBackendEvaluation = async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      const start = performance.now();

      const res = await axios.post('/api/v1/pricing/evaluate-batch', {
        basePrice: Number(basePrice),
        hoursLeft: Number(hoursLeft),
        totalShelfLifeHours: Number(totalShelfLifeHours),
        qty: Number(qty),
        depletionRate: Number(depletionRate),
        priceElasticity: Number(priceElasticity),
        floorPrice: Number(floorPrice),
        category
      });

      const end = performance.now();
      setApiLatencyMs(Math.round(end - start));
      setApiResponse(res.data);
    } catch (err) {
      console.error('API Evaluation Error:', err);
      setApiError(err.response?.data?.error || err.message || 'Failed to evaluate via backend');
    } finally {
      setApiLoading(false);
    }
  };

  // Trigger evaluation on first mount
  useEffect(() => {
    triggerBackendEvaluation();
  }, []);

  const handleCopyJson = () => {
    const text = JSON.stringify(apiResponse || evaluation, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate SVG Decay Curve points
  const curvePoints = useMemo(() => {
    const points = [];
    const steps = 40;
    const maxT = Math.max(1, totalShelfLifeHours);

    for (let i = 0; i <= steps; i++) {
      const t = (maxT * i) / steps;
      const sim = evaluatePerishableBatch({
        basePrice,
        hoursLeft: t,
        totalShelfLifeHours,
        qty,
        depletionRate,
        priceElasticity,
        floorPrice,
        category
      });

      // SVG coordinates: Width 700, Height 260
      // X maps t from 0 to maxT
      // Y maps price from floorPrice to basePrice (inverted)
      const x = 50 + (t / maxT) * 600;
      const priceRange = basePrice - floorPrice || 1;
      const normalizedPrice = (sim.pricingRecommendation.dynamicPrice - floorPrice) / priceRange;
      const y = 220 - normalizedPrice * 160;

      points.push({ x, y, t, price: sim.pricingRecommendation.dynamicPrice, tier: sim.pricingRecommendation.tier });
    }
    return points;
  }, [basePrice, totalShelfLifeHours, qty, depletionRate, priceElasticity, floorPrice, category]);

  // Current interactive cursor on curve
  const currentCursor = useMemo(() => {
    const maxT = Math.max(1, totalShelfLifeHours);
    const x = 50 + (Math.min(hoursLeft, maxT) / maxT) * 600;
    const priceRange = basePrice - floorPrice || 1;
    const normalizedPrice = (evaluation.pricingRecommendation.dynamicPrice - floorPrice) / priceRange;
    const y = 220 - normalizedPrice * 160;
    return { x, y };
  }, [hoursLeft, totalShelfLifeHours, basePrice, floorPrice, evaluation]);

  return (
    <div className="engine-sandbox-container">
      {/* ── HEADER ── */}
      <div className="sandbox-header">
        <div className="sandbox-header-left">
          <div className="section-eyebrow">
            <Cpu size={14} className="text-emerald" />
            ENGINEERING & ARCHITECTURE WALKTHROUGH
          </div>
          <h1 className="sandbox-title">The Algorithmic Decay & Markdown Engine</h1>
          <p className="sandbox-subtitle">
            A production mathematical engine that eliminates clearance guesswork by continuously solving the decay velocity ratio ($\tau$), stock run-out risk ($\rho$), and price elasticity demand surge.
          </p>
        </div>

        <div className="sandbox-header-right">
          <button
            onClick={triggerBackendEvaluation}
            disabled={apiLoading}
            className="btn-trigger-api"
          >
            <Zap size={16} className={apiLoading ? 'spin' : 'text-amber'} />
            {apiLoading ? 'Executing Engine...' : 'POST /api/v1/pricing/evaluate-batch'}
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE DECAY CURVE GRAPH ── */}
      <div className="decay-curve-card">
        <div className="curve-card-header">
          <div className="curve-title-group">
            <Activity size={16} className="text-emerald" />
            <span className="curve-title">DYNAMIC DECAY CURVE: PRICE VS. VELOCITY VS. TIME</span>
          </div>
          <div className="curve-legend">
            <span className="legend-item"><span className="legend-dot dot-price"></span> Dynamic Price ($)</span>
            <span className="legend-item"><span className="legend-dot dot-cursor"></span> Active Batch (t={hoursLeft}h)</span>
            <span className="legend-item"><span className="legend-dot dot-floor"></span> Margin Floor (${floorPrice})</span>
          </div>
        </div>

        <div className="svg-canvas-container">
          <svg viewBox="0 0 720 270" className="decay-curve-svg">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="50" y1="60" x2="650" y2="60" stroke="#1E2229" strokeDasharray="3 3" />
            <line x1="50" y1="140" x2="650" y2="140" stroke="#1E2229" strokeDasharray="3 3" />
            <line x1="50" y1="220" x2="650" y2="220" stroke="#2D3748" />

            {/* Threshold Vertical Tier Dividers */}
            {/* T-6h line */}
            <line x1={50 + (6 / totalShelfLifeHours) * 600} y1="30" x2={50 + (6 / totalShelfLifeHours) * 600} y2="220" stroke="#EF444455" strokeDasharray="2 2" />
            <text x={50 + (6 / totalShelfLifeHours) * 600} y="25" fill="#EF4444" fontSize="10" textAnchor="middle" fontFamily="monospace">T-6h (-70%)</text>

            {/* T-24h line */}
            <line x1={50 + (24 / totalShelfLifeHours) * 600} y1="30" x2={50 + (24 / totalShelfLifeHours) * 600} y2="220" stroke="#F59E0B55" strokeDasharray="2 2" />
            <text x={50 + (24 / totalShelfLifeHours) * 600} y="25" fill="#F59E0B" fontSize="10" textAnchor="middle" fontFamily="monospace">T-24h (-40%)</text>

            {/* T-72h line if within bounds */}
            {totalShelfLifeHours >= 72 && (
              <>
                <line x1={50 + (72 / totalShelfLifeHours) * 600} y1="30" x2={50 + (72 / totalShelfLifeHours) * 600} y2="220" stroke="#10B98155" strokeDasharray="2 2" />
                <text x={50 + (72 / totalShelfLifeHours) * 600} y="25" fill="#10B981" fontSize="10" textAnchor="middle" fontFamily="monospace">T-72h (-15%)</text>
              </>
            )}

            {/* Dynamic Curve Path */}
            <path
              d={curvePoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')}
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Area under curve */}
            <path
              d={`${curvePoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')} L 650 220 L 50 220 Z`}
              fill="url(#areaGradient)"
            />

            {/* Active Position Indicator Crosshairs */}
            <line x1={currentCursor.x} y1="30" x2={currentCursor.x} y2="220" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={currentCursor.x} cy={currentCursor.y} r="6" fill="#10B981" stroke="#08090A" strokeWidth="2" />
            <circle cx={currentCursor.x} cy={currentCursor.y} r="11" fill="none" stroke="#10B981" strokeWidth="1.5" className="pulse-circle" />

            {/* Y-Axis Labels */}
            <text x="40" y="65" fill="#9CA3AF" fontSize="11" textAnchor="end" fontFamily="monospace">${basePrice}</text>
            <text x="40" y="145" fill="#9CA3AF" fontSize="11" textAnchor="end" fontFamily="monospace">${((basePrice + floorPrice) / 2).toFixed(0)}</text>
            <text x="40" y="225" fill="#9CA3AF" fontSize="11" textAnchor="end" fontFamily="monospace">${floorPrice}</text>

            {/* X-Axis Labels */}
            <text x="50" y="245" fill="#EF4444" fontSize="11" textAnchor="middle" fontFamily="monospace">0h (Expired)</text>
            <text x="350" y="245" fill="#9CA3AF" fontSize="11" textAnchor="middle" fontFamily="monospace">Time to Expiration &rarr;</text>
            <text x="650" y="245" fill="#10B981" fontSize="11" textAnchor="middle" fontFamily="monospace">{totalShelfLifeHours}h (Fresh)</text>
          </svg>
        </div>

        {/* Current State Ribbon */}
        <div className="curve-ribbon">
          <div className="ribbon-item">
            <span className="ribbon-label">EVALUATED TIER</span>
            <span className={`ribbon-value tier-${evaluation.pricingRecommendation.tier.toLowerCase()}`}>
              {evaluation.pricingRecommendation.tier}
            </span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-label">RECOMMENDED MARKDOWN</span>
            <span className="ribbon-value text-amber tnum">
              -{evaluation.pricingRecommendation.recommendedMarkdownPct}%
            </span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-label">DYNAMIC PRICE</span>
            <span className="ribbon-value text-emerald tnum">
              ${evaluation.pricingRecommendation.dynamicPrice}
            </span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-label">FLOOR HIT?</span>
            <span className="ribbon-value text-white">
              {evaluation.pricingRecommendation.floorHit ? 'YES (Capped at Floor)' : 'NO (Unconstrained)'}
            </span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-label">PROJECTED DEMAND SURGE</span>
            <span className="ribbon-value text-cyan tnum">
              +{evaluation.elasticityAndClearance.projectedDemandSurgePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN INTERACTIVE WORKSPACE ── */}
      <div className="sandbox-workspace-grid">
        {/* Column 1: Parameter Control Sliders */}
        <div className="sandbox-card">
          <div className="card-header">
            <div className="card-title-group">
              <Sliders size={16} className="text-emerald" />
              <span className="card-title">ALGORITHMIC PARAMETER TUNING</span>
            </div>
            <span className="card-badge">Reactive Inputs</span>
          </div>

          <div className="slider-control-list">
            {/* Base MSRP */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Base MSRP ($):</span>
                <span className="param-val tnum">${basePrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Hours Remaining */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Hours to Expiry (t_remaining):</span>
                <span className="param-val tnum text-amber">{hoursLeft} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalShelfLifeHours}
                step="1"
                value={hoursLeft}
                onChange={(e) => setHoursLeft(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Total Shelf Life */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Total Shelf Life (t_total):</span>
                <span className="param-val tnum">{totalShelfLifeHours} hours</span>
              </div>
              <input
                type="range"
                min="24"
                max="168"
                step="6"
                value={totalShelfLifeHours}
                onChange={(e) => setTotalShelfLifeHours(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Stock Depth */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Shelf Stock Depth (Q):</span>
                <span className="param-val tnum">{qty} units</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Baseline Depletion Velocity */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Baseline Sales Velocity (v):</span>
                <span className="param-val tnum">{depletionRate} units / hour</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={depletionRate}
                onChange={(e) => setDepletionRate(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Price Elasticity */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Price Elasticity of Demand (&epsilon;):</span>
                <span className="param-val tnum text-cyan">{priceElasticity}</span>
              </div>
              <input
                type="range"
                min="-3.5"
                max="-0.5"
                step="0.1"
                value={priceElasticity}
                onChange={(e) => setPriceElasticity(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Minimum Floor Percentage */}
            <div className="param-slider-item">
              <div className="param-header">
                <span className="param-name">Margin Floor Threshold:</span>
                <span className="param-val tnum">{floorPercent}% of MSRP (${floorPrice})</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={floorPercent}
                onChange={(e) => setFloorPercent(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Mathematical Proof & JSON Payload Inspector */}
        <div className="sandbox-card">
          <div className="card-header">
            <div className="card-title-group">
              <Code2 size={16} className="text-cyan" />
              <span className="card-title">RAW ENGINE TELEMETRY & PROOFS</span>
            </div>
            <div className="card-header-actions">
              {apiLatencyMs && (
                <span className="latency-badge tnum">
                  <Zap size={11} className="text-amber" />
                  {apiLatencyMs}ms Server Latency
                </span>
              )}
              <button onClick={handleCopyJson} className="btn-copy-json">
                {copied ? <CheckCircle2 size={13} className="text-emerald" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
          </div>

          {/* Mathematical Proof Formulas */}
          <div className="math-proofs-box">
            <div className="proof-step">
              <span className="proof-step-badge">1. Velocity Ratio</span>
              <code>{evaluation.mathematicalProof.formula1_DecayVelocity}</code>
            </div>
            <div className="proof-step">
              <span className="proof-step-badge">2. Run-Out Risk</span>
              <code>{evaluation.mathematicalProof.formula2_RunOutRisk}</code>
            </div>
            <div className="proof-step">
              <span className="proof-step-badge">3. Elasticity Surge</span>
              <code>{evaluation.mathematicalProof.formula3_PriceElasticity}</code>
            </div>
            <div className="proof-step">
              <span className="proof-step-badge">4. Dynamic Pricing</span>
              <code>{evaluation.mathematicalProof.formula4_DynamicPrice}</code>
            </div>
          </div>

          {/* Raw JSON Code Viewer */}
          <div className="raw-json-viewer">
            <pre>
              <code>{JSON.stringify(apiResponse || evaluation, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

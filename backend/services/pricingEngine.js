// FreshFlow Algorithmic Dynamic Markdown & Perishable Decay Engine
// Implements mathematical decay velocity, stock depth elasticity surge, and margin floor protection

/**
 * Evaluates perishable batch decay and computes optimal dynamic price
 * @param {Object} params
 * @param {number} params.basePrice - Original MSRP
 * @param {number} params.hoursLeft - Hours remaining until expiration
 * @param {number} params.totalShelfLifeHours - Initial shelf life when received (default 72)
 * @param {number} params.qty - Current inventory units on shelf
 * @param {number} [params.initialStock] - Initial batch units (defaults to qty)
 * @param {number} [params.depletionRate] - Current sales velocity in units/hour (default 1.5)
 * @param {number} [params.priceElasticity] - Price elasticity coefficient (default -2.0)
 * @param {number} [params.floorPrice] - Absolute minimum price floor (default 30% of basePrice)
 * @param {string} [params.category] - Product category (Dairy, Bakery, Produce, Meat, etc.)
 * @returns {Object} Evaluation report with mathematical steps, telemetry, and POS recommendation
 */
export function evaluatePerishableBatch({
  basePrice,
  hoursLeft,
  totalShelfLifeHours = 72,
  qty,
  initialStock = null,
  depletionRate = 1.6,
  priceElasticity = -2.0,
  floorPrice = null,
  category = 'Produce'
}) {
  const pBase = Number(basePrice);
  const tRem = Math.max(0, Number(hoursLeft));
  const tTotal = Math.max(1, Number(totalShelfLifeHours));
  const qRem = Math.max(1, Number(qty));
  const qInit = initialStock ? Math.max(qRem, Number(initialStock)) : Math.max(qRem, qRem * 1.5);
  const vBaseline = Math.max(0.1, Number(depletionRate));
  const epsilon = Math.abs(Number(priceElasticity) || 2.0);
  const pFloor = floorPrice !== null && !isNaN(floorPrice) 
    ? Math.max(0.01, Number(floorPrice)) 
    : Number((pBase * 0.3).toFixed(2));

  // 1. Shelf-Life Decay Velocity (tau = t_remaining / t_total)
  const decayVelocity = Number((tRem / tTotal).toFixed(4));

  // 2. Stock Run-Out Risk Assessment (Natural depletion vs time remaining)
  const hoursToNaturalDepletion = Number((qRem / vBaseline).toFixed(2));
  const runOutRiskRatio = Number((hoursToNaturalDepletion / (tRem || 0.1)).toFixed(2)); // >1.0 means stock won't clear naturally

  // 3. Algorithmic Markdown Tier Determination
  let tier = 'FRESH_PAR';
  let recommendedMarkdownPct = 0;
  let urgencyLevel = 'LOW';
  let tierDescription = 'Optimal shelf life; standard retail price maintained.';

  if (tRem <= 0) {
    tier = 'T-0_EXPIRED';
    recommendedMarkdownPct = 90;
    urgencyLevel = 'TERMINAL';
    tierDescription = 'Batch has reached expiration deadline. Pull for salvage or write-off.';
  } else if (tRem <= 6 || decayVelocity <= 0.12) {
    tier = 'T-6_CRITICAL';
    recommendedMarkdownPct = 70;
    urgencyLevel = 'CRITICAL';
    tierDescription = 'Critical expiration window (<6h). 70% flash markdown to achieve immediate clearance.';
  } else if (tRem <= 24 || decayVelocity <= 0.30) {
    tier = 'T-24_URGENT';
    recommendedMarkdownPct = 40;
    urgencyLevel = 'HIGH';
    tierDescription = 'Urgent liquidation window (<24h). 40% markdown to outpace natural decay.';
  } else if (tRem <= 72 || decayVelocity <= 0.50) {
    tier = 'T-72_EARLY';
    recommendedMarkdownPct = 15;
    urgencyLevel = 'MEDIUM';
    tierDescription = 'Early decay threshold (<72h). 15% promotional discount to stimulate baseline demand.';
  }

  // Stock Depth Modifier: If stock is heavy relative to remaining time, increase discount tier by up to 10%
  if (runOutRiskRatio > 1.8 && recommendedMarkdownPct > 0 && recommendedMarkdownPct < 70) {
    recommendedMarkdownPct = Math.min(75, recommendedMarkdownPct + 10);
    tierDescription += ' (+10% stock depth risk surcharge applied)';
  }

  // 4. Floor Price Enforcement & Dynamic Price Calculation
  const unconstrainedDiscountPrice = Number((pBase * (1 - recommendedMarkdownPct / 100)).toFixed(2));
  const dynamicPrice = Math.max(pFloor, unconstrainedDiscountPrice);
  const effectiveMarkdownPct = pBase > 0 
    ? Number((((pBase - dynamicPrice) / pBase) * 100).toFixed(1)) 
    : 0;
  const floorHit = dynamicPrice === pFloor && unconstrainedDiscountPrice < pFloor;

  // 5. Price Elasticity of Demand & Sales Velocity Surge
  // deltaQ / Q = epsilon * (deltaP / P)
  const priceReductionRatio = pBase > 0 ? (pBase - dynamicPrice) / pBase : 0;
  const demandSurgePercent = Number((priceReductionRatio * epsilon * 100).toFixed(1));
  const acceleratedVelocity = Number((vBaseline * (1 + demandSurgePercent / 100)).toFixed(2));
  const projectedClearanceHours = Number((qRem / (acceleratedVelocity || 0.1)).toFixed(2));

  // 6. Sell-Through & Shrinkage Avoidance Probabilities
  const baselineSellThrough = Math.min(95, Math.max(10, Number(((tRem / (hoursToNaturalDepletion || 1)) * 100).toFixed(1))));
  const projectedSellThrough = tRem <= 0 
    ? 0.0 
    : Math.min(99.4, Number((baselineSellThrough * (1 + (demandSurgePercent / 100) * 0.7)).toFixed(1)));
  const shrinkageAvoidedUnits = Math.round(qRem * (projectedSellThrough - baselineSellThrough) / 100);

  // 7. Financial & ESG Salvage Metrics
  const grossRevenueSalvaged = Number((qRem * dynamicPrice).toFixed(2));
  const fullLossAvoided = Number((qRem * pBase).toFixed(2));
  const landfillWasteAvoidedKg = Number((qRem * 0.45).toFixed(1)); // Approx 0.45kg per grocery SKU
  const carbonOffsetKgCo2 = Number((qRem * 1.85).toFixed(1)); // 1.85kg CO2e per kg food saved

  return {
    meta: {
      engine: 'FreshFlow-Algorithmic-Markdown-v2.6',
      evaluatedAt: new Date().toISOString(),
      category
    },
    inputs: {
      basePrice: pBase,
      hoursLeft: tRem,
      totalShelfLifeHours: tTotal,
      qty: qRem,
      initialStock: qInit,
      depletionRate: vBaseline,
      priceElasticity: -epsilon,
      floorPrice: pFloor
    },
    decayAnalysis: {
      decayVelocityRatio: decayVelocity, // tau = t_rem / t_total
      hoursToNaturalDepletion,
      runOutRiskRatio,
      stockOverhang: hoursToNaturalDepletion > tRem
    },
    pricingRecommendation: {
      tier,
      urgencyLevel,
      recommendedMarkdownPct,
      effectiveMarkdownPct,
      unconstrainedDiscountPrice,
      dynamicPrice,
      unitSavings: Number((pBase - dynamicPrice).toFixed(2)),
      floorHit,
      tierDescription
    },
    elasticityAndClearance: {
      priceReductionPercent: Number((priceReductionRatio * 100).toFixed(1)),
      projectedDemandSurgePercent: demandSurgePercent,
      baselineVelocityUnitsPerHour: vBaseline,
      acceleratedVelocityUnitsPerHour: acceleratedVelocity,
      projectedClearanceHours,
      willClearBeforeExpiry: projectedClearanceHours <= tRem
    },
    financialAndEsgImpact: {
      grossRevenueSalvaged,
      fullLossAvoided,
      baselineSellThroughPercent: baselineSellThrough,
      projectedSellThroughPercent: projectedSellThrough,
      shrinkageAvoidedUnits: Math.max(0, shrinkageAvoidedUnits),
      landfillWasteAvoidedKg,
      carbonOffsetKgCo2
    },
    mathematicalProof: {
      formula1_DecayVelocity: `tau = ${tRem}h / ${tTotal}h = ${decayVelocity}`,
      formula2_RunOutRisk: `rho = (${qRem} units / ${vBaseline} u/h) / ${tRem}h = ${runOutRiskRatio}`,
      formula3_PriceElasticity: `Delta Q / Q = |${epsilon}| * (${pBase} - ${dynamicPrice}) / ${pBase} = +${demandSurgePercent}% surge`,
      formula4_DynamicPrice: `P_dynamic = max(${pFloor}, ${pBase} * (1 - ${recommendedMarkdownPct}%)) = ${dynamicPrice}`
    }
  };
}

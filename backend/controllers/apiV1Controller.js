// FreshFlow API v1 Controller - Enterprise Perishable Inventory & Algorithmic Engine Endpoints
import { InventoryService } from '../services/inventoryService.js';
import { evaluatePerishableBatch } from '../services/pricingEngine.js';
import RuleConfig from '../models/RuleConfig.js';
import { openapiSpecification } from '../config/openapiSpec.js';

/**
 * POST /api/v1/inventory/batch
 * Ingest multiple batch items into inventory
 */
export async function batchIngest(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(422).json({
        error: 'Validation failed',
        details: [{ field: 'items', message: 'Payload must contain a non-empty items array.' }]
      });
    }

    const result = await InventoryService.ingestBatch(items, {
      operator: req.user?.name || req.body.operator || 'Store Operations Lead',
      staffId: req.user?.staffId || 'FF-MGR-01'
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/inventory/decaying
 * Query decaying stock with algorithmic price evaluation
 */
export async function getDecayingInventory(req, res, next) {
  try {
    const { category, urgency, maxHours, status, search, page, limit } = req.query;

    const data = await InventoryService.getDecayingInventory({
      category,
      urgency,
      maxHours,
      status,
      search,
      page,
      limit
    });

    return res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/pricing/evaluate-batch
 * Algorithmic dynamic pricing evaluation
 */
export async function evaluateBatchPricing(req, res, next) {
  try {
    const {
      basePrice,
      hoursLeft,
      totalShelfLifeHours,
      qty,
      initialStock,
      depletionRate,
      priceElasticity,
      floorPrice,
      category
    } = req.body;

    if (basePrice === undefined || hoursLeft === undefined || qty === undefined) {
      return res.status(422).json({
        error: 'Validation failed',
        details: [
          { field: 'basePrice', message: 'basePrice is required and must be > 0.' },
          { field: 'hoursLeft', message: 'hoursLeft is required.' },
          { field: 'qty', message: 'qty is required and must be >= 1.' }
        ]
      });
    }

    const report = evaluatePerishableBatch({
      basePrice,
      hoursLeft,
      totalShelfLifeHours,
      qty,
      initialStock,
      depletionRate,
      priceElasticity,
      floorPrice,
      category
    });

    return res.json(report);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/pricing/markdown-rules
 */
export async function getMarkdownRules(req, res, next) {
  try {
    let rules = await RuleConfig.findOne({ isActive: true });
    if (!rules) {
      rules = await RuleConfig.create({
        name: 'Enterprise Perishable Markdown Policy v2.6',
        tiers: [
          { tierId: 'T-72_EARLY', label: 'Early Watch', maxHoursLeft: 72, decayVelocityThreshold: 0.5, defaultDiscountPercent: 15, colorCode: '#10B981' },
          { tierId: 'T-24_URGENT', label: 'Urgent Liquidation', maxHoursLeft: 24, decayVelocityThreshold: 0.3, defaultDiscountPercent: 40, colorCode: '#F59E0B' },
          { tierId: 'T-6_CRITICAL', label: 'Critical Salvage', maxHoursLeft: 6, decayVelocityThreshold: 0.12, defaultDiscountPercent: 70, colorCode: '#EF4444' }
        ],
        defaultFloorPercent: 30,
        targetSellThroughPercent: 99.0
      });
    }
    return res.json(rules);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/pricing/markdown-rules
 */
export async function updateMarkdownRules(req, res, next) {
  try {
    const updated = await RuleConfig.findOneAndUpdate(
      { isActive: true },
      { ...req.body, $inc: { version: 1 } },
      { new: true, upsert: true }
    );
    return res.json({ success: true, message: 'Pricing rules updated', rules: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/pos/sync
 * Real-time POS webhook trigger
 */
export async function triggerPosSync(req, res, next) {
  try {
    const { itemId, targetPrice, markdownPercent, storeId } = req.body;
    if (!itemId) {
      return res.status(422).json({
        error: 'Validation failed',
        details: [{ field: 'itemId', message: 'itemId is required.' }]
      });
    }

    const result = await InventoryService.syncPosEndpoints({
      itemId,
      targetPrice,
      markdownPercent,
      storeId
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/telemetry
 */
export async function getTelemetry(req, res, next) {
  try {
    const metrics = await InventoryService.getTelemetryMetrics();
    return res.json(metrics);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/openapi.json
 */
export function getOpenapiSpec(_req, res) {
  return res.json(openapiSpecification);
}

/**
 * GET /api/v1/docs (Interactive Swagger / OpenAPI UI Explorer)
 */
export function getApiDocsHtml(_req, res) {
  const specJson = JSON.stringify(openapiSpecification);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FreshFlow API Documentation & Governance</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍃</text></svg>">
  <style>
    body { margin: 0; background: #08090A; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .topbar { display: none !important; }
    .swagger-ui { background: #0D0F12; color: #F3F4F6; }
    .swagger-ui .info .title { color: #10B981 !important; font-family: monospace; }
    .swagger-ui .info p, .swagger-ui .info li { color: #9CA3AF !important; }
    .swagger-ui .scheme-container { background: #13161C !important; box-shadow: none !important; border-bottom: 1px solid #1E2229; }
    .swagger-ui .opblock .opblock-summary-method { border-radius: 4px; font-weight: 700; font-family: monospace; }
    .swagger-ui .opblock { border-radius: 8px; border: 1px solid #1E2229 !important; background: #13161C !important; margin: 0 0 16px; }
    .swagger-ui .opblock .opblock-summary { border-color: #1E2229 !important; }
    .swagger-ui .opblock-body { background: #0D0F12 !important; }
    .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #9CA3AF !important; border-bottom: 1px solid #1E2229 !important; }
    .swagger-ui .btn.execute { background-color: #10B981 !important; border-color: #10B981 !important; color: #08090A !important; font-weight: bold; }
    .swagger-ui section.models { border: 1px solid #1E2229 !important; background: #13161C !important; border-radius: 8px; }
    .header-bar { background: #08090A; border-bottom: 1px solid #1E2229; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
    .header-title { color: #10B981; font-weight: 800; font-family: monospace; font-size: 16px; display: flex; align-items: center; gap: 8px; }
    .badge { background: #10B98122; border: 1px solid #10B98155; color: #10B981; padding: 3px 8px; border-radius: 4px; font-size: 11px; }
    .back-btn { background: #1E2229; color: #F3F4F6; border: 1px solid #2D3748; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-family: monospace; transition: all 0.2s; }
    .back-btn:hover { background: #2D3748; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="header-title">
      <span>🍃 FRESHFLOW REST API ENGINE</span>
      <span class="badge">OpenAPI 3.0.3</span>
      <span class="badge">v2.6-PROD</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <a href="/api/v1/openapi.json" target="_blank" class="back-btn">View JSON Spec</a>
      <a href="http://localhost:5173" class="back-btn">Return to Console</a>
    </div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const spec = ${specJson};
      window.ui = SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}

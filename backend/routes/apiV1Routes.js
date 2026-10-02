// FreshFlow API v1 Route Orchestrator
import express from 'express';
import {
  batchIngest,
  getDecayingInventory,
  evaluateBatchPricing,
  getMarkdownRules,
  updateMarkdownRules,
  triggerPosSync,
  getTelemetry,
  getOpenapiSpec,
  getApiDocsHtml
} from '../controllers/apiV1Controller.js';
import { validateBody, itemCreateSchema, batchIngestionSchema, evaluatePricingSchema, markdownRuleSchema, posSyncSchema } from '../middleware/validation.js';

const router = express.Router();

// ── Inventory Ingestion & Decaying Queries ──
router.post('/inventory/batch', validateBody(batchIngestionSchema), batchIngest);
router.get('/inventory/decaying', getDecayingInventory);

// ── Pricing Engine & Decay Curves ──
router.post('/pricing/evaluate-batch', validateBody(evaluatePricingSchema), evaluateBatchPricing);
router.get('/pricing/markdown-rules', getMarkdownRules);
router.post('/pricing/markdown-rules', validateBody(markdownRuleSchema), updateMarkdownRules);

// ── POS Real-Time Webhook Synchronization ──
router.post('/pos/sync', validateBody(posSyncSchema), triggerPosSync);

// ── Real-Time Telemetry & Heatmaps ──
router.get('/telemetry', getTelemetry);

// ── OpenAPI Governance & Interactive Documentation ──
router.get('/openapi.json', getOpenapiSpec);
router.get('/docs', getApiDocsHtml);

export default router;

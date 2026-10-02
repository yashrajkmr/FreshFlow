// FreshFlow Schema Validation Middleware via Zod
// Enforces strict API contracts, data types, and enum validations for enterprise endpoints
import { z } from 'zod';

// Schema for Single Item Creation
export const itemCreateSchema = z.object({
  name: z.string().min(2, 'Product name must have at least 2 characters.'),
  category: z.enum(['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen', 'Seafood', 'Deli']),
  hoursLeft: z.number().int().nonnegative('Hours left must be a non-negative integer.'),
  qty: z.number().int().positive('Quantity must be a positive integer.'),
  basePrice: z.number().positive('Base price must be greater than zero.'),
  floorPrice: z.number().positive().optional(),
  totalShelfLifeHours: z.number().positive().optional(),
  depletionRate: z.number().positive().optional(),
  priceElasticity: z.number().optional(),
  status: z.enum(['pending', 'approved', 'critical', 'salvaged']).optional()
});

// Schema for Batch Ingestion
export const batchIngestionSchema = z.object({
  items: z.array(itemCreateSchema).min(1, 'Batch must contain at least one item.')
});

// Schema for Algorithmic Pricing Evaluation
export const evaluatePricingSchema = z.object({
  basePrice: z.number().positive('Base price must be greater than zero.'),
  hoursLeft: z.number().nonnegative('Hours left must be >= 0.'),
  totalShelfLifeHours: z.number().positive().optional().default(72),
  qty: z.number().positive('Quantity must be >= 1.'),
  initialStock: z.number().positive().optional(),
  depletionRate: z.number().positive().optional().default(1.8),
  priceElasticity: z.number().optional().default(-2.0),
  floorPrice: z.number().positive().optional(),
  category: z.string().optional().default('Produce')
});

// Schema for Markdown Rule Update
export const markdownRuleSchema = z.object({
  name: z.string().min(3).optional(),
  defaultFloorPercent: z.number().min(5).max(80).optional(),
  targetSellThroughPercent: z.number().min(50).max(100).optional(),
  tiers: z.array(
    z.object({
      tierId: z.string(),
      label: z.string(),
      maxHoursLeft: z.number().nonnegative(),
      decayVelocityThreshold: z.number().nonnegative(),
      defaultDiscountPercent: z.number().min(0).max(90),
      colorCode: z.string().optional()
    })
  ).optional()
});

// Schema for POS Sync Webhook Trigger
export const posSyncSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required.'),
  targetPrice: z.number().positive().optional(),
  markdownPercent: z.number().min(0).max(90).optional(),
  storeId: z.string().optional().default('STR-BLR-01')
});

/**
 * Higher-order middleware function to validate request body with Zod
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(422).json({
        error: 'Validation failed',
        details: formattedErrors
      });
    }
    req.validatedBody = result.data;
    next();
  };
}

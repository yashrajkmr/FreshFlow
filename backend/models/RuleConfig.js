// FreshFlow Mongoose Model - Dynamic Pricing & Markdown Rule Configuration
// Configures automated decay velocity thresholds, elasticity multipliers, and floor protection
import mongoose from 'mongoose';

const ruleConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Default Enterprise Perishable Rules'
    },
    version: {
      type: Number,
      default: 1
    },
    tiers: [
      {
        tierId: { type: String, required: true }, // e.g. T-72_EARLY, T-24_URGENT, T-6_CRITICAL
        label: { type: String, required: true },
        maxHoursLeft: { type: Number, required: true },
        decayVelocityThreshold: { type: Number, required: true }, // t_remaining / t_total ratio
        defaultDiscountPercent: { type: Number, required: true },
        colorCode: { type: String, default: '#F59E0B' }
      }
    ],
    elasticityDefaults: {
      Dairy: { type: Number, default: -1.8 },
      Bakery: { type: Number, default: -2.4 },
      Produce: { type: Number, default: -2.1 },
      Meat: { type: Number, default: -1.6 },
      Seafood: { type: Number, default: -1.9 },
      Frozen: { type: Number, default: -1.2 },
      Deli: { type: Number, default: -1.7 }
    },
    defaultFloorPercent: {
      type: Number,
      default: 30 // Minimum price allowed is 30% of basePrice (70% max discount)
    },
    targetSellThroughPercent: {
      type: Number,
      default: 99.0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

const RuleConfig = mongoose.model('RuleConfig', ruleConfigSchema);
export default RuleConfig;

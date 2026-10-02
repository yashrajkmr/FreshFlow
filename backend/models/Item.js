// FreshFlow Mongoose Model - Perishable Inventory Item & Batch Entity
// Enforces schema validation, enum boundaries, numeric limits, compound indexes, and virtual IDs
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      minlength: [2, 'Product name must contain at least 2 characters.'],
      unique: true
    },
    sku: {
      type: String,
      trim: true,
      default: function () {
        const cat = (this && this.category) ? this.category : 'GEN';
        const catCode = cat.slice(0, 3).toUpperCase();
        const rand = Math.floor(100 + Math.random() * 900);
        return `SKU-${catCode}-${rand}`;
      }
    },
    batchId: {
      type: String,
      trim: true,
      default: function () {
        const yr = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `BAT-${yr}-${rand}`;
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      enum: {
        values: ['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen', 'Seafood', 'Deli'],
        message: '{VALUE} is not a supported perishable category.'
      }
    },
    hoursLeft: {
      type: Number,
      required: [true, 'Hours left to expiry is required.'],
      min: [0, 'Hours left must be a non-negative whole number.'],
      validate: {
        validator: Number.isInteger,
        message: 'Hours left must be an integer.'
      }
    },
    totalShelfLifeHours: {
      type: Number,
      default: 72,
      min: [1, 'Total shelf life must be at least 1 hour.']
    },
    initialStock: {
      type: Number,
      default: function () {
        return (this && this.qty) ? this.qty : 25;
      }
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1 unit.'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number.'
      }
    },
    depletionRate: {
      type: Number,
      default: 1.8,
      min: [0.1, 'Depletion rate must be greater than zero.']
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required.'],
      min: [0.01, 'Base price must be greater than 0.']
    },
    floorPrice: {
      type: Number,
      default: function () {
        return (this && this.basePrice) ? Number((this.basePrice * 0.3).toFixed(2)) : 10;
      }
    },
    priceElasticity: {
      type: Number,
      default: -2.0
    },
    discountPrice: {
      type: Number,
      default: null
    },
    markdown: {
      type: Number,
      min: [0, 'Markdown percentage cannot be negative.'],
      max: [90, 'Markdown percentage cannot exceed 90%.'],
      default: null
    },
    dynamicTier: {
      type: String,
      enum: ['FRESH_PAR', 'T-72_EARLY', 'T-24_URGENT', 'T-6_CRITICAL', 'T-0_EXPIRED'],
      default: 'FRESH_PAR'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'critical', 'salvaged'],
      default: 'pending'
    },
    posSyncStatus: {
      type: String,
      enum: ['synced', 'pending', 'error'],
      default: 'synced'
    },
    lastPosSyncAt: {
      type: Date,
      default: Date.now
    },
    projectedSellThroughRate: {
      type: Number,
      default: 98.4
    },
    managerNote: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: '__v',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

// High-performance compound indexes for decay and batch queries
itemSchema.index({ category: 1, hoursLeft: 1, status: 1 });
itemSchema.index({ batchId: 1 });
itemSchema.index({ sku: 1 });
itemSchema.index({ hoursLeft: 1 });

const Item = mongoose.model('Item', itemSchema);

export default Item;

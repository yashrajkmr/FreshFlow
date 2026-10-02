// FreshFlow Mongoose Model - POS Webhook & Sync Event Ledger
// Implements TTL index for transient telemetry events and compound audit indexes
import mongoose from 'mongoose';

const posLogSchema = new mongoose.Schema(
  {
    syncId: {
      type: String,
      required: true,
      index: true
    },
    sku: {
      type: String,
      required: true,
      index: true
    },
    batchId: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    basePrice: {
      type: Number,
      required: true
    },
    newPrice: {
      type: Number,
      required: true
    },
    discountPercent: {
      type: Number,
      required: true
    },
    targetEndpoints: [
      {
        channel: { type: String, enum: ['POS_REGISTER', 'ELECTRONIC_SHELF_LABEL', 'MOBILE_APP_FEED', 'ERP_SAP'], required: true },
        endpointUrl: { type: String, required: true },
        httpStatus: { type: Number, default: 200 },
        latencyMs: { type: Number, default: 42 }
      }
    ],
    status: {
      type: String,
      enum: ['DISPATCHED', 'ACKNOWLEDGED', 'RETRYING', 'FAILED'],
      default: 'ACKNOWLEDGED'
    },
    payloadSummary: {
      type: String,
      default: ''
    },
    // TTL index: automatically expire transient event records after 30 days
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d'
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

// Compound index for fast querying by batch and creation timestamp
posLogSchema.index({ batchId: 1, createdAt: -1 });

const PosLog = mongoose.model('PosLog', posLogSchema);
export default PosLog;

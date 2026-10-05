// FreshFlow Database Layer - MongoDB Connection via Mongoose
// Connects to local or cloud MongoDB and seeds enterprise perishable inventory batches
import mongoose from 'mongoose';
import Item from '../models/Item.js';
import RuleConfig from '../models/RuleConfig.js';
import { seedDefaultUsers } from '../controllers/authController.js';

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshflow';

export const ENTERPRISE_SEED_ITEMS = [
  // ── Critical Decaying Window (< 6 Hours Remaining) ──
  {
    name: 'Artisan Sourdough Boule 650g',
    sku: 'SKU-BAK-101',
    batchId: 'BAT-2026-B101',
    category: 'Bakery',
    hoursLeft: 3,
    totalShelfLifeHours: 36,
    qty: 14,
    initialStock: 40,
    depletionRate: 2.2,
    basePrice: 120,
    floorPrice: 36,
    priceElasticity: -2.4,
    discountPrice: 36,
    markdown: 70,
    status: 'approved',
    dynamicTier: 'T-6_CRITICAL',
    managerNote: '3 hours to expiry. 70% flash markdown applied to ensure total batch clearance before closing.'
  },
  {
    name: 'Farm Fresh Paneer Block 200g',
    sku: 'SKU-DAI-204',
    batchId: 'BAT-2026-D204',
    category: 'Dairy',
    hoursLeft: 4,
    totalShelfLifeHours: 48,
    qty: 22,
    initialStock: 50,
    depletionRate: 2.0,
    basePrice: 95,
    floorPrice: 30,
    priceElasticity: -1.9,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-6_CRITICAL',
    managerNote: ''
  },
  {
    name: 'Fresh Atlantic Salmon Fillet 400g',
    sku: 'SKU-SEA-301',
    batchId: 'BAT-2026-S301',
    category: 'Seafood',
    hoursLeft: 5,
    totalShelfLifeHours: 40,
    qty: 18,
    initialStock: 30,
    depletionRate: 1.4,
    basePrice: 420,
    floorPrice: 150,
    priceElasticity: -1.8,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-6_CRITICAL',
    managerNote: ''
  },
  {
    name: 'Organic Baby Spinach 200g',
    sku: 'SKU-PRO-402',
    batchId: 'BAT-2026-P402',
    category: 'Produce',
    hoursLeft: 5,
    totalShelfLifeHours: 30,
    qty: 35,
    initialStock: 60,
    depletionRate: 3.1,
    basePrice: 65,
    floorPrice: 20,
    priceElasticity: -2.2,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-6_CRITICAL',
    managerNote: ''
  },
  {
    name: 'Roasted Turkey Breast Deli Cut 250g',
    sku: 'SKU-DEL-501',
    batchId: 'BAT-2026-L501',
    category: 'Deli',
    hoursLeft: 6,
    totalShelfLifeHours: 48,
    qty: 16,
    initialStock: 35,
    depletionRate: 1.8,
    basePrice: 190,
    floorPrice: 60,
    priceElasticity: -1.7,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-6_CRITICAL',
    managerNote: ''
  },

  // ── Urgent Liquidation Window (6 to 24 Hours Remaining) ──
  {
    name: 'Organic Whole Milk 1L Bottle',
    sku: 'SKU-DAI-201',
    batchId: 'BAT-2026-D201',
    category: 'Dairy',
    hoursLeft: 9,
    totalShelfLifeHours: 72,
    qty: 48,
    initialStock: 80,
    depletionRate: 3.5,
    basePrice: 78,
    floorPrice: 30,
    priceElasticity: -1.9,
    discountPrice: 46.8,
    markdown: 40,
    status: 'approved',
    dynamicTier: 'T-24_URGENT',
    managerNote: 'Morning batch reaching 9h cutoff. 40% liquidation markdown applied.'
  },
  {
    name: 'Free-Range Chicken Breast Fillets 500g',
    sku: 'SKU-MEA-602',
    batchId: 'BAT-2026-M602',
    category: 'Meat',
    hoursLeft: 11,
    totalShelfLifeHours: 48,
    qty: 24,
    initialStock: 45,
    depletionRate: 1.9,
    basePrice: 240,
    floorPrice: 90,
    priceElasticity: -1.6,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-24_URGENT',
    managerNote: ''
  },
  {
    name: 'Vine-Ripened Cluster Tomatoes 1kg',
    sku: 'SKU-PRO-401',
    batchId: 'BAT-2026-P401',
    category: 'Produce',
    hoursLeft: 12,
    totalShelfLifeHours: 60,
    qty: 55,
    initialStock: 90,
    depletionRate: 3.2,
    basePrice: 52,
    floorPrice: 20,
    priceElasticity: -2.3,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-24_URGENT',
    managerNote: ''
  },
  {
    name: 'Fresh French Baguette 300g',
    sku: 'SKU-BAK-103',
    batchId: 'BAT-2026-B103',
    category: 'Bakery',
    hoursLeft: 13,
    totalShelfLifeHours: 24,
    qty: 20,
    initialStock: 50,
    depletionRate: 2.1,
    basePrice: 60,
    floorPrice: 20,
    priceElasticity: -2.5,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-24_URGENT',
    managerNote: ''
  },
  {
    name: 'Greek Yogurt Vanilla Pots (4x125g)',
    sku: 'SKU-DAI-203',
    batchId: 'BAT-2026-D203',
    category: 'Dairy',
    hoursLeft: 16,
    totalShelfLifeHours: 96,
    qty: 36,
    initialStock: 60,
    depletionRate: 2.0,
    basePrice: 160,
    floorPrice: 60,
    priceElasticity: -1.8,
    discountPrice: 96,
    markdown: 40,
    status: 'approved',
    dynamicTier: 'T-24_URGENT',
    managerNote: 'Promotional display markdown to clear stock depth.'
  },
  {
    name: 'Wild Caught Black Tiger Prawns 300g',
    sku: 'SKU-SEA-302',
    batchId: 'BAT-2026-S302',
    category: 'Seafood',
    hoursLeft: 17,
    totalShelfLifeHours: 36,
    qty: 15,
    initialStock: 25,
    depletionRate: 1.1,
    basePrice: 380,
    floorPrice: 140,
    priceElasticity: -1.7,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-24_URGENT',
    managerNote: ''
  },
  {
    name: 'Wagyu Ribeye Steak MB6+ 350g',
    sku: 'SKU-MEA-601',
    batchId: 'BAT-2026-M601',
    category: 'Meat',
    hoursLeft: 20,
    totalShelfLifeHours: 72,
    qty: 8,
    initialStock: 15,
    depletionRate: 0.7,
    basePrice: 850,
    floorPrice: 350,
    priceElasticity: -1.5,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-24_URGENT',
    managerNote: ''
  },

  // ── Early Decay & Watch Window (24 to 72 Hours Remaining) ──
  {
    name: 'California Strawberries Punnet 400g',
    sku: 'SKU-PRO-403',
    batchId: 'BAT-2026-P403',
    category: 'Produce',
    hoursLeft: 28,
    totalShelfLifeHours: 96,
    qty: 42,
    initialStock: 70,
    depletionRate: 2.8,
    basePrice: 180,
    floorPrice: 70,
    priceElasticity: -2.1,
    discountPrice: 153,
    markdown: 15,
    status: 'approved',
    dynamicTier: 'T-72_EARLY',
    managerNote: 'Early threshold reached. 15% markdown activated to boost volume.'
  },
  {
    name: 'Authentic Italian Burrata 200g',
    sku: 'SKU-DAI-205',
    batchId: 'BAT-2026-D205',
    category: 'Dairy',
    hoursLeft: 32,
    totalShelfLifeHours: 72,
    qty: 20,
    initialStock: 35,
    depletionRate: 1.2,
    basePrice: 260,
    floorPrice: 100,
    priceElasticity: -1.7,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-72_EARLY',
    managerNote: ''
  },
  {
    name: 'Hass Avocados Ripe Pack of 3',
    sku: 'SKU-PRO-404',
    batchId: 'BAT-2026-P404',
    category: 'Produce',
    hoursLeft: 36,
    totalShelfLifeHours: 84,
    qty: 60,
    initialStock: 100,
    depletionRate: 3.4,
    basePrice: 140,
    floorPrice: 50,
    priceElasticity: -2.2,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-72_EARLY',
    managerNote: ''
  },
  {
    name: 'Artisanal Brioche Buns (4-pack)',
    sku: 'SKU-BAK-104',
    batchId: 'BAT-2026-B104',
    category: 'Bakery',
    hoursLeft: 40,
    totalShelfLifeHours: 96,
    qty: 25,
    initialStock: 40,
    depletionRate: 1.6,
    basePrice: 90,
    floorPrice: 35,
    priceElasticity: -2.0,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-72_EARLY',
    managerNote: ''
  },
  {
    name: 'Smoked Salmon Slices 150g',
    sku: 'SKU-SEA-303',
    batchId: 'BAT-2026-S303',
    category: 'Seafood',
    hoursLeft: 46,
    totalShelfLifeHours: 120,
    qty: 22,
    initialStock: 35,
    depletionRate: 1.2,
    basePrice: 310,
    floorPrice: 120,
    priceElasticity: -1.7,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-72_EARLY',
    managerNote: ''
  },
  {
    name: 'Prosciutto di Parma 18-Month Aged 100g',
    sku: 'SKU-DEL-502',
    batchId: 'BAT-2026-L502',
    category: 'Deli',
    hoursLeft: 52,
    totalShelfLifeHours: 140,
    qty: 18,
    initialStock: 30,
    depletionRate: 0.9,
    basePrice: 340,
    floorPrice: 130,
    priceElasticity: -1.6,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'T-72_EARLY',
    managerNote: ''
  },

  // ── Fresh Par Inventory (> 72 Hours Remaining) ──
  {
    name: 'Organic Blueberries 125g',
    sku: 'SKU-PRO-405',
    batchId: 'BAT-2026-P405',
    category: 'Produce',
    hoursLeft: 84,
    totalShelfLifeHours: 144,
    qty: 50,
    initialStock: 60,
    depletionRate: 2.5,
    basePrice: 195,
    floorPrice: 80,
    priceElasticity: -2.1,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  },
  {
    name: 'Grass-Fed Angus Beef Mince 500g',
    sku: 'SKU-MEA-603',
    batchId: 'BAT-2026-M603',
    category: 'Meat',
    hoursLeft: 96,
    totalShelfLifeHours: 144,
    qty: 32,
    initialStock: 45,
    depletionRate: 2.1,
    basePrice: 280,
    floorPrice: 110,
    priceElasticity: -1.8,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  },
  {
    name: 'Artisan Sourdough Croissants (Box of 4)',
    sku: 'SKU-BAK-105',
    batchId: 'BAT-2026-B105',
    category: 'Bakery',
    hoursLeft: 74,
    totalShelfLifeHours: 120,
    qty: 28,
    initialStock: 40,
    depletionRate: 1.8,
    basePrice: 150,
    floorPrice: 60,
    priceElasticity: -2.3,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  },
  {
    name: 'Aged Cheddar Cheese Wedge 250g',
    sku: 'SKU-DAI-206',
    batchId: 'BAT-2026-D206',
    category: 'Dairy',
    hoursLeft: 120,
    totalShelfLifeHours: 240,
    qty: 40,
    initialStock: 50,
    depletionRate: 1.5,
    basePrice: 220,
    floorPrice: 90,
    priceElasticity: -1.7,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  },
  {
    name: 'Wild Alaskan Salmon Fillet Portions (Frozen 500g)',
    sku: 'SKU-FRO-701',
    batchId: 'BAT-2026-F701',
    category: 'Frozen',
    hoursLeft: 340,
    totalShelfLifeHours: 720,
    qty: 30,
    initialStock: 35,
    depletionRate: 1.0,
    basePrice: 480,
    floorPrice: 200,
    priceElasticity: -1.3,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  },
  {
    name: 'Organic Mixed Berry Medley (Frozen 1kg)',
    sku: 'SKU-FRO-702',
    batchId: 'BAT-2026-F702',
    category: 'Frozen',
    hoursLeft: 420,
    totalShelfLifeHours: 900,
    qty: 45,
    initialStock: 50,
    depletionRate: 1.4,
    basePrice: 320,
    floorPrice: 120,
    priceElasticity: -1.4,
    discountPrice: null,
    markdown: null,
    status: 'pending',
    dynamicTier: 'FRESH_PAR',
    managerNote: ''
  }
];

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB at: ${MONGO_URI}`);

    // Seed default staff user accounts if empty
    await seedDefaultUsers();

    // Check or enrich inventory records
    const count = await Item.countDocuments();
    if (count < 12) {
      // Clear out tiny prior seed or initialize full 24 items
      if (count > 0 && count < 8) {
        console.log(`Refreshing inventory collection with full 24 enterprise perishable batches...`);
      }
      for (const item of ENTERPRISE_SEED_ITEMS) {
        await Item.findOneAndUpdate(
          { name: item.name },
          { $set: item },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`🌱 Seeded/Updated 24 enterprise perishable inventory items across all 7 departments.`);
    }

    // Seed rule config if not present
    const ruleCount = await RuleConfig.countDocuments();
    if (ruleCount === 0) {
      await RuleConfig.create({
        name: 'Enterprise Perishable Markdown Policy v2.6',
        tiers: [
          { tierId: 'T-72_EARLY', label: 'Early Watch', maxHoursLeft: 72, decayVelocityThreshold: 0.5, defaultDiscountPercent: 15, colorCode: '#10B981' },
          { tierId: 'T-24_URGENT', label: 'Urgent Liquidation', maxHoursLeft: 24, decayVelocityThreshold: 0.3, defaultDiscountPercent: 40, colorCode: '#F59E0B' },
          { tierId: 'T-6_CRITICAL', label: 'Critical Salvage', maxHoursLeft: 6, decayVelocityThreshold: 0.12, defaultDiscountPercent: 70, colorCode: '#EF4444' }
        ],
        defaultFloorPercent: 30,
        targetSellThroughPercent: 99.0
      });
      console.log('⚙️ Seeded enterprise dynamic pricing rules into MongoDB.');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Ensure MongoDB service is running on mongodb://127.0.0.1:27017');
    throw err;
  }
}

export default mongoose;

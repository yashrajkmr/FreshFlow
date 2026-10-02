// FreshFlow REST API Controller - Perishable Inventory & Markdown Management
import Item from '../models/Item.js';
import mongoose from 'mongoose';
import { appendAuditRecord } from './auditController.js';

// ── GET /api/items — Fetch all items with Query Parameter filtering ──
export const getItems = async (req, res) => {
  try {
    const filter = {};

    // Query parameter: category (e.g. /api/items?category=Produce)
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }

    // Query parameter: status (e.g. /api/items?status=pending or ?status=approved)
    if (req.query.status && req.query.status !== 'all') {
      if (req.query.status === 'critical') {
        filter.hoursLeft = { $lt: 6 };
        filter.status = { $ne: 'approved' };
      } else {
        filter.status = req.query.status;
      }
    }

    // Query parameter: q (Dynamic search by keyword)
    if (req.query.q) {
      filter.name = { $regex: req.query.q.trim(), $options: 'i' };
    }

    const items = await Item.find(filter).sort({ hoursLeft: 1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('Error in getItems:', err);
    return res.status(500).json({ error: 'Failed to retrieve inventory items from database.' });
  }
};

// ── GET /api/items/:id — Fetch single record using Path Parameter ──
export const getItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Item not found (Invalid ID format).' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in inventory collection.' });
    }

    return res.json(item);
  } catch (err) {
    console.error('Error in getItem:', err);
    return res.status(500).json({ error: 'Failed to retrieve inventory record.' });
  }
};

// ── POST /api/items — Create new perishable inventory record ──
export const createItem = async (req, res) => {
  try {
    const { name, category, hoursLeft, qty, basePrice, status } = req.body;

    // Automatic calculation of initial pricing
    const newItem = await Item.create({
      name: name?.trim(),
      category,
      hoursLeft: Number(hoursLeft),
      qty: Number(qty),
      basePrice: Number(basePrice),
      status: status || 'pending'
    });

    // Log to file system audit ledger
    appendAuditRecord({
      manager: req.body.manager || 'Yashraj Kumar',
      staffId: req.body.staffId || 'FF-MGR-01',
      department: `${category} Department`,
      action: `Created Perishable Inventory Item: ${newItem.name}`,
      notes: `Batch logged into system with ${newItem.hoursLeft}h shelf life.`,
      item: newItem
    }).catch(err => console.error('Background audit logging warning:', err.message));

    return res.status(201).json(newItem);
  } catch (err) {
    console.error('Error in createItem:', err.message);

    // Duplicate key error code 11000 in MongoDB
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A perishable item with this product name already exists in the inventory.' });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }

    return res.status(500).json({ error: 'Failed to create perishable inventory item.' });
  }
};

// ── PUT /api/items/:id — Update existing record ──
export const updateItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Item not found (Invalid ID format).' });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('Error in updateItem:', err.message);

    if (err.code === 11000) {
      return res.status(409).json({ error: 'Another item with this name already exists.' });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }

    return res.status(500).json({ error: 'Failed to update item.' });
  }
};

// ── POST /api/items/:id/approve — Dynamic Markdown Approval & Audit Log ──
export const approveMarkdown = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Item not found (Invalid ID format).' });
    }

    const { markdown, managerNote, managerName, staffId, department } = req.body;

    const pct = Number(markdown);
    if (Number.isNaN(pct) || pct < 5 || pct > 90) {
      return res.status(400).json({ error: 'Markdown percentage must be between 5% and 90%.' });
    }

    if (!managerNote || managerNote.trim().length < 5) {
      return res.status(400).json({ error: 'Manager justification note is required (min 5 characters).' });
    }

    const existing = await Item.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const discountPrice = Number((existing.basePrice * (1 - pct / 100)).toFixed(2));

    existing.status = 'approved';
    existing.markdown = pct;
    existing.discountPrice = discountPrice;
    existing.managerNote = managerNote.trim();
    existing.approvedAt = new Date();

    await existing.save();

    // Persist to File System audit log
    await appendAuditRecord({
      manager: managerName || 'Yashraj Kumar',
      staffId: staffId || 'FF-MGR-01',
      department: department || `${existing.category} Section`,
      action: `Approved ${pct}% Markdown (₹${existing.basePrice} -> ₹${discountPrice})`,
      notes: managerNote.trim(),
      item: existing
    });

    return res.json({
      success: true,
      message: `Markdown of ${pct}% approved for "${existing.name}". New price: ₹${discountPrice}`,
      item: existing
    });
  } catch (err) {
    console.error('Error in approveMarkdown:', err);
    return res.status(500).json({ error: 'Failed to process markdown approval.' });
  }
};

// ── DELETE /api/items/:id — Remove record from database ──
export const deleteItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Item not found (Invalid ID format).' });
    }

    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    // Log deletion to audit log
    appendAuditRecord({
      manager: req.query.manager || 'Yashraj Kumar',
      staffId: 'FF-MGR-01',
      department: `${deleted.category} Department`,
      action: `Deleted Perishable Record: ${deleted.name}`,
      notes: 'Item removed from active inventory ledger.',
      item: deleted
    }).catch(err => console.error('Delete audit log warning:', err.message));

    return res.status(204).end();
  } catch (err) {
    console.error('Error in deleteItem:', err);
    return res.status(500).json({ error: 'Failed to delete record from database.' });
  }
};

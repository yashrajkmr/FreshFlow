// FreshFlow - Express + SQLite Backend
// Lab Exercise 5 & 6 - React CRUD with SQLite database

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname doesn't exist in ES modules, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// connect to (or create) the SQLite database file
const db = new Database(path.join(__dirname, 'freshflow.db'));

// create the inventory table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    hoursLeft INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    basePrice INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
  )
`);

// seed initial data only if table is empty
const count = db.prepare('SELECT COUNT(*) AS total FROM inventory').get();
if (count.total === 0) {
  const seed = db.prepare(`
    INSERT INTO inventory (name, category, hoursLeft, qty, basePrice, status)
    VALUES (@name, @category, @hoursLeft, @qty, @basePrice, @status)
  `);

  const initialItems = [
    { name: 'Farm Fresh Paneer 200g',    category: 'Dairy',   hoursLeft: 3,  qty: 18, basePrice: 90,  status: 'pending' },
    { name: 'Whole Wheat Bread Loaf',     category: 'Bakery',  hoursLeft: 5,  qty: 24, basePrice: 55,  status: 'pending' },
    { name: 'Vine Tomatoes 1kg',          category: 'Produce', hoursLeft: 9,  qty: 40, basePrice: 48,  status: 'pending' },
    { name: 'Greek Yogurt Cups (4-pack)', category: 'Dairy',   hoursLeft: 14, qty: 32, basePrice: 160, status: 'pending' },
    { name: 'Chicken Breast Fillet 500g', category: 'Meat',    hoursLeft: 18, qty: 12, basePrice: 210, status: 'pending' },
    { name: 'Mixed Berries Punnet',       category: 'Produce', hoursLeft: 22, qty: 20, basePrice: 130, status: 'pending' },
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) seed.run(item);
  });
  insertMany(initialItems);

  console.log('Seeded initial inventory data into SQLite.');
}

// ── READ — get all inventory items ──────────────────────
app.get('/inventory', (req, res) => {
  const rows = db.prepare('SELECT * FROM inventory').all();
  res.json(rows);
});

// ── CREATE — add a new inventory item ───────────────────
app.post('/inventory', (req, res) => {
  const { name, category, hoursLeft, qty, basePrice, status } = req.body;

  const stmt = db.prepare(`
    INSERT INTO inventory (name, category, hoursLeft, qty, basePrice, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, category, hoursLeft, qty, basePrice, status);

  // return the newly created row, same shape json-server used to return
  const newItem = db.prepare('SELECT * FROM inventory WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newItem);
});

// ── UPDATE — modify an existing item ────────────────────
app.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, hoursLeft, qty, basePrice, status } = req.body;

  db.prepare(`
    UPDATE inventory
    SET name = ?, category = ?, hoursLeft = ?, qty = ?, basePrice = ?, status = ?
    WHERE id = ?
  `).run(name, category, hoursLeft, qty, basePrice, status, id);

  const updated = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
  res.json(updated);
});

// ── DELETE — remove an item ─────────────────────────────
app.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
  res.json({ success: true, id: Number(id) });
});

app.listen(PORT, () => {
  console.log(`FreshFlow SQLite server running at http://localhost:${PORT}`);
});
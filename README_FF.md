# 🛒 FreshFlow — Perishable Inventory & Dynamic Markdown Approval Platform

> **Full Stack Web Application** engineered with React 18, Vite, Node.js, Express.js, MongoDB (Mongoose), and the Node.js File System Module.  
> **Developer:** Yashraj Kumar (Full Stack Developer)  
> **Domain:** Retail Logistics & Supermarket Food-Waste Reduction

---

## 🌟 Executive Summary & Problem Statement

In modern supermarket retail, **perishable inventory** (Dairy, Bakery, Fresh Produce, Meat, Frozen goods) represents a significant vulnerability:
* When items approach their expiration deadline, retailers typically discard unsold stock at a **100% financial and environmental loss**.
* Traditional retail inventory systems lack real-time price degradation mechanisms and automated expiry tracking.

**FreshFlow** solves this problem by providing store managers with an end-to-end, reactive **Markdown Approval Console**:
1. **Real-Time Expiry Monitoring:** Perishable SKUs are continuously tracked with countdown timers and classified into automated urgency tiers (`Critical < 6h`, `Urgent < 12h`, `Watch > 12h`).
2. **Dynamic Markdown Pricing Engine:** Managers can review expiring stock and dynamically apply tiered discount percentages (5% to 70%) with live price decay math calculations.
3. **Gated Approval & Compliance:** Markdowns require validated manager justification notes, instantly calculate salvaged revenue (**Value Protected**), and dispatch browser desktop alerts via the **Web Notifications API**.
4. **Dual Persistence Architecture:**
   * **Transactional Database (MongoDB via Mongoose):** Handles inventory CRUD, querying, indexing, and status updates.
   * **Immutable Disk Audit Ledger (Node.js `fs.promises`):** Records all markdown approvals and compliance checkpoints asynchronously to server disk (`freshflow-audit.txt`).

---

## 🏛️ System Architecture

```
FreshFlow-Master/
│
├── frontend/                        # Client-Side Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation, Store Lead profile dropdown, View toggle, Tab switcher
│   │   │   ├── StatsOverview.jsx    # Live metrics: Stock count, Critical alert, Markdowns active, Value Salvaged ₹
│   │   │   ├── MarkdownModal.jsx    # Dynamic Markdown Approval Drawer (Slider, math pricing, validation)
│   │   │   ├── ShelfTagModal.jsx    # Retail Shelf Markdown Tag & Code128 Barcode generator with thermal print
│   │   │   ├── CategoryAnalyticsModal.jsx # Department-level Risk & Margin Analytics visualizer
│   │   │   ├── AuthModal.jsx        # Enterprise Tabbed Login & Registration with 1-Click Demo Personas
│   │   │   ├── InventoryForm.jsx    # Add / Edit item modal with client-side form validation
│   │   │   ├── InventoryList.jsx    # Perishable Cards Grid (Urgency heartbeat pulses & hover previews)
│   │   │   ├── InventoryItem.jsx    # Card with urgency badge, SKU meta, hover pricing, shelf tag & review action
│   │   │   ├── InventoryTable.jsx   # Dense Tabular Ledger view with sorting, status pills, inline actions & barcode trigger
│   │   │   ├── SearchAndFilter.jsx  # Live keyword search, category select, status pills, Batch Liquidate & CSV Export
│   │   │   ├── NativeAPIDemos.jsx   # HTML5 APIs: Canvas Decay Curve, Geolocation, Drag & Drop, Clipboard
│   │   │   ├── AuditLedger.jsx      # Node.js File System Audit Log viewer & manual checkpoint logger
│   │   │   ├── Toast.jsx            # Dynamic floating notifications
│   │   │   └── Footer.jsx           # Architecture & stack attribution
│   │   ├── App.jsx                  # Main state management, JWT auth persistence, API orchestrator & shortcuts
│   │   ├── App.css                  # Executive supermarket glassmorphism styling (Linear/Stripe benchmark)
│   │   ├── index.css                # Base resets & font definitions
│   │   └── main.jsx                 # React root mount
│   ├── index.html                   # HTML5 shell with Google Fonts (Outfit/Inter) & FontAwesome 6
│   └── vite.config.js               # Dev server with proxy to backend port 3001
│
├── backend/                         # Server-Side Application (Node.js + Express.js + MongoDB)
│   ├── config/
│   │   └── db.js                    # MongoDB connection via Mongoose + auto-seeding initial perishables & demo users
│   ├── controllers/
│   │   ├── inventoryController.js   # Perishable inventory CRUD & markdown approval engine
│   │   ├── auditController.js       # Node.js File System Module (fs.promises.appendFile / readFile)
│   │   └── authController.js        # User Registration, Login (JWT), getProfile, and default user seed logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT Bearer token authentication & role authorization
│   ├── models/
│   │   ├── Item.js                  # Mongoose Schema for inventory with strict validation & virtuals
│   │   └── User.js                  # Mongoose Schema for users with bcrypt password hashing & role enforcement
│   ├── routes/
│   │   ├── inventoryRoutes.js       # RESTful endpoints with Path & Query parameter support
│   │   ├── auditRoutes.js           # File system endpoints (/api/audit/save, /api/audit/view)
│   │   └── authRoutes.js            # Authentication endpoints (/api/auth/register, /login, /profile)
│   ├── storage/
│   │   └── freshflow-audit.txt      # Persistent disk audit ledger written via fs.appendFile
│   ├── tests/
│   │   └── api-test.js              # Automated 15-step backend test suite (CRUD, params, FS, Auth, JWT)
│   └── server.js                    # Express app initialization, middleware, logging & error handlers
│
├── package.json                     # Root orchestrator: 1 command launches both servers!
├── ARCHITECTURE.md                  # Comprehensive folder & file breakdown for technical interviews
└── INTERVIEW-GUIDE.md               # Master interview playbook, VS Code walkthrough & top 25 Q&As
```

---

## 🚀 Quickstart Guide (Run with 1 Command)

### Prerequisites
* **Node.js**: v18+ (tested on Node v22)
* **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` (default MongoDB port)

### 1. Launch Frontend & Backend Simultaneously
From the root directory:
```bash
npm run dev
```
* **Frontend:** http://localhost:5173
* **Backend API:** http://localhost:3001
* *Both servers boot concurrently in your terminal with clear color-coded logs.*

### 2. Alternative: Launch Separately
```bash
# Terminal 1: Start Express API
npm run server

# Terminal 2: Start React Client
npm run client
```

### 3. Run Automated Backend Verification
```bash
npm run test:api
```
*Executes all 11 automated test cases verifying GET, POST, PUT, DELETE, Path params, Query params, Validation error handling, and Node.js File System operations.*

---

## 📡 RESTful API Specification

| HTTP Method | Endpoint | Description | Parameters |
|---|---|---|---|
| `GET` | `/api/items` | Fetch all perishable items | Query: `?category=...&status=...&q=...` |
| `GET` | `/api/items/:id` | Fetch single item by ID | Path: `/:id` (MongoDB ObjectId) |
| `POST` | `/api/items` | Create new perishable inventory record | Body: `{ name, category, hoursLeft, qty, basePrice }` |
| `PUT` | `/api/items/:id` | Update existing record | Path: `/:id`, Body: Updated fields |
| `POST` | `/api/items/:id/approve` | Approve markdown liquidation discount | Path: `/:id`, Body: `{ markdown, managerNote }` |
| `DELETE` | `/api/items/:id` | Remove item from inventory | Path: `/:id` (MongoDB ObjectId) |
| `POST` | `/api/audit/save` | Append audit record using `fs.appendFile` | Body: `{ name, staffId, department, action, notes }` |
| `GET` | `/api/audit/view` | Read disk audit ledger using `fs.readFile` | Returns raw `freshflow-audit.txt` |
| `GET` | `/api/auth/profile` | Get active store lead profile | Returns `{ name, staffId, role, storeLocation }` |

---

## 🌐 HTML5 Native Browser APIs Integrated

1. **HTML5 Canvas 2D API (`<canvas>`):** Renders an interactive, real-time Perishable Price-Decay curve visualizer showing how liquidation pricing correlates with shelf-life degradation.
2. **Geolocation API (`navigator.geolocation`):** Queries device GPS coordinates to localize inventory records to the nearest regional supermarket store hub.
3. **Drag & Drop API (`dragover`, `dragleave`, `drop`):** Interactive dropzone for supplier delivery slips and batch manifests with instant file parsing simulation.
4. **Web Notifications API (`Notification`):** Dispatches system-level desktop notifications when critical markdowns are approved.
5. **Clipboard API (`navigator.clipboard`):** 1-click copying of store POS API authentication tokens and batch summaries.
6. **Keyboard Shortcuts:** Global hotkey navigation (`Alt+W` for Markdown Console, `Alt+S` for Search, `Esc` to clear/close).

---

## 👨‍💻 Developer & Attribution
* **Developer:** Yashraj Kumar
* **Specialization:** Full Stack Web Development (Frontend 1st Priority, Backend 2nd Priority)
* **Institution:** Christ (Deemed to be University)

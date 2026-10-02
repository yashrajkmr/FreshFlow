# 🍃 FreshFlow — Enterprise Dynamic Markdown & Perishable Inventory Engine

> **Production-Ready Enterprise Web Platform** for algorithmic dynamic pricing, shelf-life decay velocity evaluation, and automated POS markdown synchronization.  
> **Target Role:** Adobe Technical Consultant (Domain 2: Backend & Software Engineering)  
> **Architect:** Yashraj Kumar (Full Stack Systems Architect)  
> **Tech Stack:** Node.js, Express.js (Service Repository Pattern), MongoDB 8.3 (Mongoose ODM), OpenAPI 3.0 (Swagger), React 18, Vite, Lucide Icons, Vanilla CSS (Industrial Kinetic FinTech Design System).

---

## 🏛️ System Overview & Problem Statement

Grocery and retail giants lose billions annually to perishable shrinkage (spoilage) because expiration clearance is manual, rigid, and fragmented:
- **Static End-of-Life Stickers:** Clearance items either sell out too quickly at deep discounts (sacrificing gross margin) or fail to move in time (resulting in a 100% loss plus landfill disposal fees).
- **Latency Bottlenecks:** Store managers must manually audit shelves, generate tags, and update POS registers independently.

### The FreshFlow Algorithmic Solution
FreshFlow continuously monitors perishable lots through a four-part mathematical pricing engine:
1. **Shelf-Life Decay Velocity ($\tau$):**  
   $$\tau = \frac{t_{\text{remaining}}}{t_{\text{total}}}$$
2. **Stock Depth & Depletion Run-Out Risk ($\rho$):**  
   $$\rho = \frac{Q_{\text{remaining}} / v_{\text{baseline}}}{t_{\text{remaining}}}$$
   *(If $\rho > 1.0$, stock cannot clear naturally before expiration without an accelerated markdown).*
3. **Price Elasticity Demand Surge:**  
   $$\frac{\Delta Q}{Q} = |\varepsilon| \times \left(\frac{P_{\text{base}} - P_{\text{dynamic}}}{P_{\text{base}}}\right)$$
4. **Margin Floor Protection & Automated Tier Dispatch:**  
   $$P_{\text{dynamic}} = \max\left(P_{\text{base}} \times (1 - \text{markdown}), P_{\text{floor}}\right)$$
   Automatically synchronizing price reductions across POS registers, Electronic Shelf Labels (ESL), and SAP ERP in **< 42ms**.

---

## 📐 System Architecture & Directory Layout

```
FreshFlow-Master/
│
├── backend/                             # Enterprise Express REST API Engine
│   ├── config/
│   │   ├── db.js                        # MongoDB Mongoose connection & 24 enterprise seed items
│   │   └── openapiSpec.js               # Full OpenAPI 3.0.3 specification for API Governance
│   ├── controllers/
│   │   ├── apiV1Controller.js           # REST v1 controller (batch ingest, decaying, pricing, POS sync)
│   │   ├── inventoryController.js       # Core CRUD & legacy compatibility endpoints
│   │   ├── auditController.js           # Node.js asynchronous File System (fs.promises) ledger
│   │   └── authController.js            # JWT session token generator & Bcrypt password hashing
│   ├── middleware/
│   │   ├── authMiddleware.js            # Stateless JWT verification & RBAC authorization
│   │   └── validation.js                # Zod runtime schema validation (HTTP 422 error contracts)
│   ├── models/
│   │   ├── Item.js                      # Item & batch model (compound indexes & decay attributes)
│   │   ├── PosLog.js                    # POS webhook audit ledger with TTL transient expiry
│   │   ├── RuleConfig.js                # Dynamic pricing policy & multi-tier configurations
│   │   └── User.js                      # Staff user schema with salted Bcrypt hashing
│   ├── routes/
│   │   ├── apiV1Routes.js               # /api/v1/... (OpenAPI, pricing, batch, POS sync)
│   │   ├── inventoryRoutes.js           # /api/items CRUD routes
│   │   ├── auditRoutes.js               # /api/audit routes
│   │   └── authRoutes.js                # /api/auth routes
│   ├── services/
│   │   ├── inventoryService.js          # Service Repository Pattern for high-performance queries
│   │   └── pricingEngine.js             # Mathematical dynamic pricing engine & proof formulas
│   ├── storage/
│   │   └── freshflow-audit.txt          # Persistent disk audit ledger written via fs.appendFile
│   ├── tests/
│   │   └── api-test.js                  # Automated 15-step test suite (100% passing)
│   ├── package.json
│   └── server.js                        # Express server with Helmet, Morgan, Rate Limiting & Swagger UI
│
├── frontend/                            # Industrial Kinetic FinTech Client (React 18 + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx          # Top 1% Landing Page (Hero Simulator, Architecture Mesh, Bento, ROI)
│   │   │   ├── OperationsDashboard.jsx  # Mission-Control (Telemetry ticker, Heatmap risk grid, Queue table)
│   │   │   ├── EngineSandbox.jsx        # Algorithmic Demo (SVG Decay Curve, sliders, math proofs, API test)
│   │   │   ├── ApiExplorer.jsx          # Interactive REST API console (curl commands, status codes, latency)
│   │   │   ├── Navbar.jsx               # Top navigation rail with breadcrumbs and user session
│   │   │   ├── MarkdownModal.jsx        # Gated markdown drawer with justification validation
│   │   │   ├── ShelfTagModal.jsx        # E-Ink digital barcode shelf label simulator
│   │   │   ├── InventoryForm.jsx        # SKU batch creation/editing modal
│   │   │   ├── AuthModal.jsx            # Multi-persona JWT authentication modal
│   │   │   ├── AuditLedger.jsx          # Node.js File System live terminal viewer
│   │   │   ├── NativeAPIDemos.jsx       # 5 Native Browser APIs (Canvas 2D, Geolocation, Drag & Drop)
│   │   │   ├── Toast.jsx                # Non-intrusive floating feedback banner
│   │   │   └── Footer.jsx               # Corporate attribution & tech stack details
│   │   ├── utils/
│   │   │   └── pricingMath.js           # Client-side dynamic pricing algorithms matching backend
│   │   ├── App.jsx                      # Main orchestrator, shortcuts, and global state
│   │   ├── App.css                      # Executive glassmorphism & FinTech design tokens
│   │   ├── index.css                    # Root tokens & tabular numeral formatting
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── ARCHITECTURE.md                      # Detailed architectural design document
├── INTERVIEW-GUIDE.md                   # 3-minute executive pitch & technical Q&A playbook
└── package.json                         # Root launcher orchestrating backend & client
```

---

## 💻 4 Distinct Pages Built

### Page 1: Top 1% Landing Page (`/` / Overview Tab)
- **Punchy Headline:** *"Turn Perishable Loss into Margin. Automatically."*
- **Live Interactive Hero Simulator:** Drag the *Hours to Expiry* slider (from 72h down to 1h) and watch the dynamic price reduction, demand surge ($\Delta Q/Q$), and shrinkage avoidance update in real time across preset grocery SKUs (Salmon, Wagyu, Sourdough, Strawberries).
- **System Architecture Visualizer:** Interactive schematic of the event-driven mesh connecting Warehouse ERP (SAP), FreshFlow Brain, POS Terminals, and Electronic Shelf Labels. Includes a *"Simulate Distributed Markdown Broadcast"* trigger.
- **Bento Feature Matrix:**
  1. *Automated Markdown Scheduler* (Multi-tiered decay velocity triggers)
  2. *Batch & SKU Expiry Heatmaps* (Loss surface area isolation)
  3. *POS REST Sync & Webhook Dispatcher* (Sub-50ms distributed broadcast)
  4. *ESG Waste Reduction & Carbon Credit Metrics* (Scope 3 compliance)
- **Enterprise ROI Calculator:** Interactive sliders for store count (1–150 stores) and monthly revenue ($50k–$1M) calculating projected annual margin recovery ($) and landfill waste reduction (tons).

### Page 2: Mission-Control Operations Dashboard (`/dashboard` / Operations Tab)
- **Top Telemetry Ticker:** Real-time counters for Active Monitored SKUs (30 items), Revenue Protected Today ($13,397.40), Critical Risk Items (<12h remaining with pulsing crimson alert), and Average Sell-Through Velocity (98.7%).
- **Batch Expiry Heatmap:** Department risk density matrix (Dairy, Bakery, Produce, Meat, Seafood, Deli, Frozen) with 1-click filtering.
- **Active Markdown Queue Table:** Dense tabular ledger with SKU, Batch ID, Stock Depth, Expiry Countdown with decay progress bar, MSRP, Algorithmic Dynamic Price, Dynamic Tier pill, and POS Sync status.
- **Quick Actions:** Gated markdown approval modal, simulated POS push, digital shelf tag barcode preview, and one-click *Batch Auto-Approve*.

### Page 3: The Algorithmic Engine Sandbox (`/engine-demo` / Sandbox Tab)
- **Dynamic Decay Curve SVG Canvas:** Plots Price ($) vs. Sales Velocity ($u/h$) vs. Time to Expiration ($t_{remaining}$) with crosshairs and tier threshold dividers.
- **Parameter Sliders:** Real-time controls for MSRP, hours remaining, shelf life, stock units ($Q$), sales velocity ($v$), price elasticity ($\varepsilon$), and floor price percentage.
- **Mathematical Proof Box:** Step-by-step breakdown of $\tau$, $\rho$, elasticity demand surge, and dynamic price constraints.
- **Live Backend API Trigger:** *"POST /api/v1/pricing/evaluate-batch"* button sending parameters to the running Node.js server, measuring server latency (ms), and rendering the raw JSON response payload.

### Page 4: Interactive API Explorer / Developer Hub (`/api-docs` / API Hub Tab)
- **Interactive REST Console:** Test live endpoints:
  - `POST /api/v1/inventory/batch` (Batch Ingestion)
  - `GET /api/v1/inventory/decaying` (Query Expiring Stock)
  - `POST /api/v1/pricing/evaluate-batch` (Dynamic Pricing Decay Curve)
  - `GET /api/v1/pricing/markdown-rules` (Markdown Policy Config)
  - `POST /api/v1/pos/sync` (POS Webhook Broadcast)
- **Features:** Live request builder, cURL command generator with 1-click copy, HTTP status code badges (`200 OK`, `422 Unprocessable`, `429 Rate Limited`), latency timers, and formatted JSON output.
- **Direct Links:** Embedded Swagger UI (`http://localhost:3001/api/v1/docs`) and raw OpenAPI JSON (`http://localhost:3001/api/v1/openapi.json`).

---

## ⚡ Quickstart Execution

### Prerequisites
- Node.js v18+ (tested on Node v22)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Launch Platform Concurrently (Root)
```bash
npm run dev
```
- **Frontend Console:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Interactive Swagger UI:** http://localhost:3001/api/v1/docs

### 2. Run Automated Verification Test Suite
```bash
npm run test:api
# Or directly:
node backend/tests/api-test.js
```
*Executes all 15 automated test cases verifying CRUD, query parameters, path parameters, markdown approvals, Zod input rejection (HTTP 400/422), disk audit logging (`fs.promises`), and JWT authentication.*

---

## 🛡️ Enterprise Security & Governance
- **Stateless JWT Sessions:** Generated using HS256 with 7-day expiration and Bearer token verification.
- **Bcrypt Password Hashing:** 10 salt rounds for all employee credentials.
- **Helmet Headers:** Secured HTTP response headers protecting against clickjacking, MIME sniffing, and XSS.
- **Rate Limiting:** Express rate limiter guarding against denial-of-service and brute force API abuse.
- **OpenAPI 3.0 Governance:** Complete schema contracts and status code documentation for Technical Consultant evaluations.

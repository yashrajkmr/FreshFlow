# 🏛️ FreshFlow — Comprehensive Architecture & File Breakdown

This document provides an exhaustive, file-by-file technical reference for the **FreshFlow** platform. Use this guide to answer technical questions from the interview panel with absolute confidence and clarity.

---

## 📂 Root Directory Architecture

| File / Folder | Role & Purpose |
|---|---|
| `frontend/` | **Client-Side SPA**: React 18 application built with Vite. Contains all UI components, custom hooks, state management, CSS styling, and native HTML5 API integrations. |
| `backend/` | **Server-Side REST API**: Node.js & Express.js server. Encapsulates business logic, database models, route handlers, file system storage, and automated tests. |
| `package.json` | **Root Orchestrator**: Uses `concurrently` to launch both the backend (Port 3001) and frontend (Port 5173) simultaneously using a single `npm run dev` command. |
| `DEPLOYMENT.md` | **Enterprise Deployment Guide**: Step-by-step instructions for cloud hosting on Render/Railway with MongoDB Atlas and interview presentation protocol. |
| `.gitignore` | Standard version control exclusions for `node_modules`, build outputs (`dist/`), and temporary logs. |
| `README.md` | Executive project documentation featuring problem statements, system architecture, API specifications, and quickstart commands. |
| `INTERVIEW-GUIDE.md` | 5-minute live demonstration script, elevator pitch, and top interview questions & answers. |

---

## 🎨 Frontend Architecture (`frontend/`)

### 1. Root Configuration & Entry
* **`frontend/package.json`**: Defines client dependencies (`react`, `react-dom`, `axios`) and build scripts (`dev`, `build`, `preview`).
* **`frontend/vite.config.js`**: Vite configuration. Configures the React compiler plugin and establishes an API proxy so calls to `/api` route automatically to `http://localhost:3001`.
* **`frontend/index.html`**: The HTML5 shell. Loads Google Fonts (`Inter`, `Outfit`), FontAwesome 6 icon set, and establishes the `#root` mount point for React.
* **`frontend/src/main.jsx`**: Entry point for React 18. Uses `ReactDOM.createRoot()` to mount `<App />` within `React.StrictMode`.
* **`frontend/src/index.css`**: Design system tokens (CSS Custom Properties), global typography, custom scrollbars, and dark-mode radial gradients.
* **`frontend/src/App.css`**: Executive glassmorphism design system. Implements cards, responsive grid layouts, animations (`@keyframes critical-pulse`, `@keyframes shake`), modals, range sliders, and data tables.
* **`frontend/src/App.jsx`**: The core state manager and API orchestrator:
  - Manages active tab state (`inventory`, `markdowns`, `audit`, `html5`).
  - Manages view mode toggle (`cards` vs `table`).
  - Fetches and filters inventory from MongoDB using `axios`.
  - Dispatches global keyboard event listeners (`Alt+W`, `Alt+S`, `Esc`).
  - Coordinates modal drawer openings and floating toast feedback.

### 2. Component Directory (`frontend/src/components/`)
* **`Navbar.jsx`**:
  - Displays the FreshFlow brand logo and live database connection status badge.
  - Tab navigation between *Perishable Inventory*, *Markdown Approvals*, *Disk Audit Ledger*, and *HTML5 APIs*.
  - View toggle (Card Grid vs Table Ledger).
  - Quick "Add Item" button and active Store Lead manager profile chip.
* **`StatsOverview.jsx`**:
  - Computes and displays live KPIs: Total Perishable SKUs, Critical Expiry Alert (`< 6h`), Pending Markdowns, Active Markdowns.
  - Computes **Value Salvaged / Protected (₹)**: calculates total revenue salvaged by applying liquidation discounts instead of taking a 100% loss.
* **`MarkdownModal.jsx`**: *(Signature Feature)*
  - Slide-in modal drawer triggered when reviewing an expiring item.
  - Shows item metadata and suggested discount tier (`Critical: 40%`, `Urgent: 25%`, `Watch: 15%`).
  - Interactive **Markdown Slider** (5% to 70%) with real-time math calculating new price, unit savings, and total batch value saved.
  - **Manager Justification Note** with client-side validation (minimum 5 characters). Triggers a shake animation and error feedback if submitted empty.
  - Triggers the Web Notifications API on confirmation.
* **`InventoryItem.jsx`**:
  - Perishable product card.
  - Urgency tag with color coding (Rose for Critical, Amber for Urgent, Cyan for Watch).
  - Heartbeat pulse glow animation for critical items nearing expiration.
  - Hover preview displaying projected discounted price.
  - Action buttons: "Review Markdown", "Edit", and "Delete".
* **`InventoryList.jsx`**:
  - Responsive CSS grid container for inventory item cards.
  - Displays an empty state card with a "Reset Filters" action if no items match.
* **`InventoryTable.jsx`**:
  - Dense tabular ledger view for store managers who prefer spreadsheet-style visibility.
  - Sortable layout with expiry countdowns, status badges, and inline action buttons.
* **`InventoryForm.jsx`**:
  - Modal form for creating new items (`POST /api/items`) or editing existing items (`PUT /api/items/:id`).
  - Comprehensive field validation: product name, department category dropdown, hours left integer check, quantity unit constraints, and base price numeric limits.
* **`SearchAndFilter.jsx`**:
  - Dynamic keyword search bar with real-time character counter and 1-click clear button.
  - Department dropdown (Dairy, Bakery, Produce, Meat, Frozen).
  - Urgency & status filter pills (All, Critical `< 6h`, Pending, Approved).
  - Filter summary count and reset button.
* **`AuditLedger.jsx`**:
  - Demonstrates integration with the Node.js File System (`fs`) module.
  - Form to record manual store audit checkpoints (`POST /api/audit/save`).
  - Terminal-style viewer displaying raw contents of `freshflow-audit.txt` fetched via `GET /api/audit/view`.
  - Client-side text file export button using HTML5 Blob URLs.
* **`NativeAPIDemos.jsx`**:
  - Dedicated showcase for 5 native browser APIs:
    1. **Canvas 2D API**: Draws an interactive perishable price-decay curve based on hours to expiration.
    2. **Geolocation API**: Queries device GPS coordinates to localize nearest store hub.
    3. **Drag & Drop API**: Dropzone for supplier delivery slips and batch manifest CSVs.
    4. **Clipboard API**: 1-click copying of store POS API authentication tokens.
    5. **Web Notifications API**: Manager desktop alerts.
* **`Toast.jsx`**:
  - Floating non-blocking feedback notification banner with auto-dismiss timer.
* **`Footer.jsx`**:
  - Clean corporate footer highlighting the tech stack and developer credits.

---

## ⚙️ Backend Architecture (`backend/`)

### 1. Server Core (`backend/server.js`)
* Boots the Express application on Port 3001.
* Implements CORS, JSON body parsing, and request logging middleware.
* Defines the health check endpoint `GET /`.
* Mounts API routes: `/api/items`, `/api/audit`, and `/api/auth`.
* Implements a 404 handler and a global asynchronous error-handling middleware.

### 2. Database & Data Models
* **`backend/config/db.js`**:
  - Establishes a persistent connection to MongoDB using Mongoose.
  - Automatically seeds 8 initial perishable products across all 5 departments if the collection is empty.
* **`backend/models/Item.js`**:
  - Enforces schema rules: unique product names, category enums (`Dairy`, `Bakery`, `Produce`, `Meat`, `Frozen`), positive integer hoursLeft, positive integer quantity, and minimum base price.
  - Implements Mongoose virtuals and `toJSON` transformation to expose standard `id` strings alongside `_id`.

### 3. Business Logic Controllers (`backend/controllers/`)
* **`inventoryController.js`**:
  - `getItems`: Retrieves perishable records with query parameter filtering (`category`, `status`, `q`).
  - `getItem`: Path parameter lookup (`/api/items/:id`) with ObjectId validation.
  - `createItem`: Validates input, prevents duplicate product names (HTTP 409), and logs action to audit file.
  - `updateItem`: Updates record fields with validation (HTTP 200/400/404).
  - `approveMarkdown`: Updates markdown discount percentage, calculates new price, sets status to `approved`, and calls `appendAuditRecord` to persist decision to disk.
  - `deleteItem`: Removes item from collection and logs event to audit file.
* **`auditController.js`**:
  - `appendAuditRecord`: Helper that formats an audit line and invokes `fs.promises.appendFile()` to append records to `backend/storage/freshflow-audit.txt`.
  - `saveLog`: HTTP handler for `POST /api/audit/save`.
  - `viewLog`: HTTP handler for `GET /api/audit/view` using `fs.promises.readFile()`.
* **`authController.js`**:
  - `login`: Verifies manager credentials and returns active role and assigned store branch.
  - `getProfile`: Supplies the default Store Lead session for the frontend.

### 4. REST Routes (`backend/routes/`)
* **`inventoryRoutes.js`**: Routes `/api/items` to `getItems`, `createItem`, `getItem`, `updateItem`, `deleteItem`, and `approveMarkdown`.
* **`auditRoutes.js`**: Routes `/api/audit/save` and `/api/audit/view`.
* **`authRoutes.js`**: Routes `/api/auth/login` and `/api/auth/profile`.

### 5. Storage & Verification
* **`backend/storage/freshflow-audit.txt`**: The server disk file where all markdown approvals and store checkpoints are appended.
* **`backend/tests/api-test.js`**: Automated test suite that executes all 11 backend test cases against live endpoints.

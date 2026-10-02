// FreshFlow Audit Controller - Node.js File System (FS) Module Integration
// Demonstrates asynchronous, non-blocking disk file operations using fs.promises
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.join(__dirname, '..', 'storage');
const AUDIT_FILE = path.join(STORAGE_DIR, 'freshflow-audit.txt');

// Ensure storage directory and base ledger file exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

if (!fs.existsSync(AUDIT_FILE)) {
  const initialAudit = [
    '========================================================================',
    '       🛒 FRESHFLOW SUPERMARKET - MARKDOWN AUDIT LEDGER',
    '       Domain: Perishable Food-Waste Reduction & Expiry Liquidation',
    '       Storage Mechanism: Node.js File System Module (fs.promises)',
    '========================================================================\n',
    `Timestamp: ${new Date().toISOString()}`,
    'Store Lead: Yashraj Kumar',
    'Staff ID: FF-MGR-01',
    'Department: Store Operations',
    'Action Status: System Initialized - Audit Ledger Active',
    'Notes: File system persistence initialized successfully.',
    '------------------------------------------------------------------------\n'
  ].join('\n');
  fs.writeFileSync(AUDIT_FILE, initialAudit, 'utf8');
}

/**
 * Append an entry to the disk audit log (can be called internally or via HTTP POST)
 */
export async function appendAuditRecord({ manager = 'Yashraj Kumar', staffId = 'FF-MGR-01', department = 'Store Operations', action, notes, item = null }) {
  try {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const lines = [
      `Timestamp: ${timestamp}`,
      `Store Lead: ${manager.trim()}`,
      `Staff ID: ${staffId.trim()}`,
      `Department: ${department.trim()}`,
      `Action: ${action.trim()}`,
      item ? `Item Affected: ${item.name} (Qty: ${item.qty}, Base: ₹${item.basePrice}${item.discountPrice ? `, Markdown Price: ₹${item.discountPrice}` : ''})` : null,
      notes ? `Manager Justification / Notes: ${notes.trim()}` : null,
      '------------------------------------------------------------------------\n'
    ].filter(Boolean);

    await fs.promises.appendFile(AUDIT_FILE, lines.join('\n'), 'utf8');
    console.log(`[FS.appendFile] Logged audit action: "${action}" for ${manager}`);
    return true;
  } catch (err) {
    console.error('[FS.appendFile] Failed to append audit log:', err);
    throw err;
  }
}

// ── POST /api/audit/save — Appends markdown audit record using fs.appendFile ──
export const saveLog = async (req, res) => {
  try {
    const { name, manager, staffId, department, status, action, notes, item } = req.body;

    const mgrName = name || manager || 'Yashraj Kumar';
    const sId = staffId || 'FF-MGR-01';
    const dept = department || 'Store Operations';
    const act = action || status || 'Markdown Approved';

    if (!mgrName || !sId) {
      return res.status(400).json({ error: 'Manager Name and Staff ID are required.' });
    }

    await appendAuditRecord({
      manager: mgrName,
      staffId: sId,
      department: dept,
      action: act,
      notes: notes || '',
      item: item || null
    });

    return res.status(201).json({
      success: true,
      message: 'Markdown audit record successfully appended to freshflow-audit.txt on server disk!',
      file: 'freshflow-audit.txt'
    });
  } catch (err) {
    console.error('Error in saveLog (FS module):', err);
    return res.status(500).json({ error: 'Failed to write to file system.' });
  }
};

// ── GET /api/audit/view — Reads audit ledger using fs.readFile ──
export const viewLog = async (_req, res) => {
  try {
    if (!fs.existsSync(AUDIT_FILE)) {
      return res.send('No audit ledger found on disk.\n');
    }

    const data = await fs.promises.readFile(AUDIT_FILE, 'utf8');
    console.log(`[FS.readFile] Read ${data.length} bytes from freshflow-audit.txt`);
    return res.send(data);
  } catch (err) {
    console.error('Error in viewLog (FS module):', err);
    return res.status(500).json({ error: 'Failed to read audit log from file system.' });
  }
};

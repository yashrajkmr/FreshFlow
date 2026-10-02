// FreshFlow Audit Ledger Component (Node.js File System Module Showcase)
// Demonstrates disk file persistence using fs.promises.appendFile and fs.promises.readFile
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditLedger({ showToast, manager }) {
  const [logText, setLogText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Manual checkpoint form state
  const [staffName, setStaffName] = useState(manager.name);
  const [staffId, setStaffId] = useState(manager.staffId);
  const [department, setDepartment] = useState('Dairy Section');
  const [actionStatus, setActionStatus] = useState('Audit Verified - Markdown Implemented');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAuditLog(false);
  }, []);

  async function fetchAuditLog(notify = true) {
    try {
      setLoading(true);
      const res = await axios.get('/api/audit/view');
      setLogText(res.data);
      if (notify) {
        showToast('Audit ledger reloaded directly from server disk via fs.readFile()', 'info');
      }
    } catch (err) {
      console.error('Audit view error:', err);
      if (notify) {
        showToast('Could not fetch audit log from server disk.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleManualLog(e) {
    e.preventDefault();
    if (!staffName.trim() || !staffId.trim()) {
      showToast('Staff Name and Staff ID are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: staffName.trim(),
        staffId: staffId.trim(),
        department,
        action: actionStatus,
        notes: notes.trim()
      };

      const res = await axios.post('/api/audit/save', payload);
      showToast(res.data.message || 'Audit entry appended to disk file!', 'success');
      setNotes('');
      await fetchAuditLog(false);
    } catch (err) {
      console.error('Audit save error:', err);
      showToast(err.response?.data?.error || 'Failed to append to disk file.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadLog() {
    const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freshflow-audit-ledger-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded audit ledger to local machine.', 'success');
  }

  return (
    <div className="audit-ledger-container">
      {/* Top Banner */}
      <div className="audit-banner-card">
        <div className="banner-left">
          <div className="banner-icon">
            <i className="fa-solid fa-file-shield"></i>
          </div>
          <div>
            <h3>Enterprise Markdown Compliance & Audit Ledger</h3>
            <p>
              Persistent store compliance logging powered by the <strong>Node.js File System (<code>fs.promises</code>) Module</strong>.
              Every markdown discount, approval, and checkpoint is recorded asynchronously to <code>backend/storage/freshflow-audit.txt</code> without blocking the Node.js event loop.
            </p>
          </div>
        </div>
        <div className="banner-badge">
          <i className="fa-brands fa-node-js"></i> Node.js <code>fs</code> I/O
        </div>
      </div>

      <div className="audit-two-column-layout">
        {/* Left: Manual Audit Checkpoint Form */}
        <div className="audit-form-panel">
          <div className="panel-title-row">
            <h4><i className="fa-solid fa-pen-nib"></i> Record Store Checkpoint</h4>
            <span className="api-tag">POST /api/audit/save</span>
          </div>

          <form onSubmit={handleManualLog} className="manual-audit-form">
            <div className="form-group">
              <label>Auditing Manager / Store Lead *</label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Manager Name"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Staff ID *</label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="e.g. FF-MGR-01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department / Section *</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="Dairy Section">Dairy Section</option>
                  <option value="Bakery Section">Bakery Section</option>
                  <option value="Produce Section">Produce Section</option>
                  <option value="Meat Section">Meat Section</option>
                  <option value="Frozen Section">Frozen Section</option>
                  <option value="Store Operations">Store Operations</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Audit Action Status *</label>
              <select value={actionStatus} onChange={(e) => setActionStatus(e.target.value)}>
                <option value="Audit Verified - Markdown Implemented">Audit Verified - Markdown Implemented</option>
                <option value="Cold Room Temperature & Expiry Verified">Cold Room Temperature & Expiry Verified</option>
                <option value="Perishable Display Restocked & Re-priced">Perishable Display Restocked & Re-priced</option>
                <option value="Manager Shift Change Inventory Handover">Manager Shift Change Inventory Handover</option>
              </select>
            </div>

            <div className="form-group">
              <label>Verification Notes / Observations</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Verified cold chain intact; items tagged with promotional price labels."
              />
            </div>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <span><i className="fa-solid fa-spinner fa-spin"></i> Writing to Disk...</span>
              ) : (
                <span><i className="fa-solid fa-floppy-disk"></i> Append to Disk Ledger</span>
              )}
            </button>
          </form>

          {/* Technical Explainer Box for Interview Panel */}
          <div className="interview-tech-box">
            <h5><i className="fa-solid fa-lightbulb"></i> Panel Explainer: Why Node.js File System?</h5>
            <p>
              In enterprise retail compliance, having an immutable, append-only disk ledger guarantees that audit logs remain intact even if network databases encounter downtime. Using <code>fs.promises.appendFile</code> ensures asynchronous, non-blocking I/O, maintaining high throughput on Node.js single-threaded event loop.
            </p>
          </div>
        </div>

        {/* Right: Live Disk File Viewer */}
        <div className="audit-viewer-panel">
          <div className="viewer-top-bar">
            <div className="file-info">
              <i className="fa-solid fa-file-code"></i>
              <span>File: <code>backend/storage/freshflow-audit.txt</code></span>
            </div>
            <div className="viewer-btn-group">
              <button
                type="button"
                className="btn-viewer-action"
                onClick={() => fetchAuditLog(true)}
                disabled={loading}
                title="Reload from server disk"
              >
                <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i> Refresh
              </button>
              <button
                type="button"
                className="btn-viewer-action"
                onClick={handleDownloadLog}
                title="Download audit file"
              >
                <i className="fa-solid fa-download"></i> Export .txt
              </button>
            </div>
          </div>

          <pre className="audit-terminal-screen">
            {logText || 'Loading disk audit records from server...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default AuditLedger;

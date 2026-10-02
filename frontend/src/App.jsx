// FreshFlow Main Console (Linear, Stripe & Attio Operational Standard)
// Enterprise React 18 state management, REST API orchestration, JWT authentication, and retail markdown operations
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Component imports
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import OperationsDashboard from './components/OperationsDashboard.jsx';
import EngineSandbox from './components/EngineSandbox.jsx';
import ApiExplorer from './components/ApiExplorer.jsx';
import AuthPage from './components/AuthPage.jsx';
import AuditLedger from './components/AuditLedger.jsx';
import NativeAPIDemos from './components/NativeAPIDemos.jsx';

// Modal imports
import MarkdownModal from './components/MarkdownModal.jsx';
import InventoryForm from './components/InventoryForm.jsx';
import AuthModal from './components/AuthModal.jsx';
import ShelfTagModal from './components/ShelfTagModal.jsx';
import CategoryAnalyticsModal from './components/CategoryAnalyticsModal.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';

import './App.css';

const API_BASE = '/api/items';

function App() {
  // Navigation & View Mode: Default to Landing Page overview, can switch to Operations Console, Engine, etc.
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'dashboard' | 'engine-demo' | 'api-docs' | 'audit' | 'html5'
  const [viewMode, setViewMode] = useState('table');

  // Data & Filtering
  const [items, setItems] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  // Modals & Drawers
  const [markdownItem, setMarkdownItem] = useState(null);
  const [shelfTagItem, setShelfTagItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  // Store Manager / Staff Session (Persisted in localStorage)
  const [manager, setManager] = useState(() => {
    try {
      const savedUser = localStorage.getItem('freshflow_user');
      return savedUser
        ? JSON.parse(savedUser)
        : {
            name: 'Yashraj Kumar',
            staffId: 'FF-MGR-01',
            role: 'Store Operations Lead',
            department: 'Dairy & Perishables',
            storeLocation: 'FreshFlow Flagship Store #104, Bangalore'
          };
    } catch (_e) {
      return {
        name: 'Yashraj Kumar',
        staffId: 'FF-MGR-01',
        role: 'Store Operations Lead',
        storeLocation: 'FreshFlow Flagship Store #104, Bangalore'
      };
    }
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Configure global Axios Authorization header if token exists
  useEffect(() => {
    const token = localStorage.getItem('freshflow_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  // Fetch Perishable SKUs
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (activeStatus !== 'all') params.status = activeStatus;
      if (searchTerm.trim()) params.q = searchTerm.trim();

      const [itemsRes, telemetryRes] = await Promise.allSettled([
        axios.get(API_BASE, { params }),
        axios.get('/api/v1/telemetry')
      ]);

      if (itemsRes.status === 'fulfilled') {
        setItems(itemsRes.value.data);
      }
      if (telemetryRes.status === 'fulfilled') {
        setTelemetry(telemetryRes.value.data);
      }
    } catch (err) {
      console.error('Fetch items error:', err);
      const errMsg = err.response?.data?.error || 'Could not connect to FreshFlow API server on port 3001.';
      setLoadError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, activeStatus, searchTerm, showToast]);

  // Check Profile Session from Backend on boot
  useEffect(() => {
    const token = localStorage.getItem('freshflow_token');
    axios
      .get('/api/auth/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      .then((res) => {
        if (res.data) {
          setManager(res.data);
          localStorage.setItem('freshflow_user', JSON.stringify(res.data));
        }
      })
      .catch((err) => console.log('Using local operator profile:', err.message));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
          showToast('Alt+S: Search input focused', 'info');
        }
      } else if (e.altKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        setActiveTab('dashboard');
        setActiveStatus('critical');
        showToast('Alt+W: Switched to Critical (< 6h) SKUs', 'info');
      } else if (e.key === 'Escape') {
        if (markdownItem) setMarkdownItem(null);
        else if (shelfTagItem) setShelfTagItem(null);
        else if (isAnalyticsOpen) setIsAnalyticsOpen(false);
        else if (isAuthOpen) setIsAuthOpen(false);
        else if (isFormOpen) setIsFormOpen(false);
        else if (searchTerm) {
          setSearchTerm('');
          showToast('Search cleared', 'info');
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markdownItem, shelfTagItem, isAnalyticsOpen, isAuthOpen, isFormOpen, searchTerm, showToast]);

  // Auth Success Handler
  function handleAuthSuccess({ token, user }) {
    if (token) {
      localStorage.setItem('freshflow_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (user) {
      localStorage.setItem('freshflow_user', JSON.stringify(user));
      setManager(user);
    }
  }

  // Logout Handler
  function handleLogout() {
    localStorage.removeItem('freshflow_token');
    localStorage.removeItem('freshflow_user');
    delete axios.defaults.headers.common['Authorization'];
    setManager({
      name: 'Store Associate',
      staffId: 'FF-GUEST',
      role: 'Guest / Demo Mode',
      department: 'Store Operations',
      storeLocation: 'Bangalore Central Hub'
    });
    showToast('Signed out of FreshFlow console.', 'info');
  }

  // Create or Update SKU
  async function handleFormSubmit(itemData, editId) {
    try {
      setIsSubmitting(true);
      if (editId) {
        const res = await axios.put(`${API_BASE}/${editId}`, itemData);
        showToast(`SKU "${res.data.name}" updated successfully.`, 'success');
      } else {
        const res = await axios.post(API_BASE, {
          ...itemData,
          manager: manager.name,
          staffId: manager.staffId
        });
        showToast(`SKU "${res.data.name}" registered to inventory.`, 'success');
      }
      setIsFormOpen(false);
      setEditingItem(null);
      await fetchItems();
    } catch (err) {
      console.error('Save item error:', err);
      showToast(err.response?.data?.error || 'Failed to save SKU.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Confirm Markdown Recommendation
  async function handleConfirmMarkdown(item, markdownPct, justificationNote) {
    const itemId = item._id || item.id;
    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_BASE}/${itemId}/approve`, {
        markdown: markdownPct,
        managerNote: justificationNote,
        managerName: manager.name,
        staffId: manager.staffId,
        department: `${item.category} Section`
      });

      const updated = res.data.item;
      showToast(
        `✓ ${item.name} discounted -${markdownPct}% ($${updated.discountPrice}) — Logged to Audit Ledger.`,
        'success'
      );

      // Trigger POS sync automatically
      axios.post('/api/v1/pos/sync', {
        itemId,
        targetPrice: updated.discountPrice,
        markdownPercent: markdownPct
      }).catch(e => console.warn('Background POS sync note:', e.message));

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FreshFlow Markdown Approved', {
          body: `${item.name} now $${updated.discountPrice} (-${markdownPct}%). Synced to POS.`
        });
      }

      setMarkdownItem(null);
      await fetchItems();
    } catch (err) {
      console.error('Markdown approval error:', err);
      showToast(err.response?.data?.error || 'Failed to apply markdown.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Simulate Instant POS & ESL Webhook Broadcast
  async function handleSimulatePosSync(item) {
    try {
      const itemId = item._id || item.id;
      const targetPrice = item.discountPrice || item.basePrice;
      const res = await axios.post('/api/v1/pos/sync', {
        itemId,
        targetPrice,
        markdownPercent: item.markdown || 0,
        storeId: 'STR-BLR-01'
      });

      showToast(
        `📡 Dispatched POS webhook for "${item.name}" ($${targetPrice}) across ${res.data.channelsDispatched?.length || 4} endpoints!`,
        'success'
      );
      await fetchItems();
    } catch (err) {
      console.error('POS sync error:', err);
      showToast(err.response?.data?.error || 'Failed to dispatch POS sync.', 'error');
    }
  }

  // One-Click Batch Auto-Approve Suggested Markdowns (<24h)
  async function handleBatchAutoApprove() {
    const candidateItems = items.filter((i) => i.hoursLeft <= 24 && i.status !== 'approved');
    if (candidateItems.length === 0) {
      showToast('No pending items under 24 hours require markdown.', 'info');
      return;
    }

    if (
      !window.confirm(
        `Auto-approve algorithmic markdowns for all ${candidateItems.length} decaying items (<24h)?\nDiscounts will be synchronized to POS and logged to the audit ledger.`
      )
    ) {
      return;
    }

    try {
      setIsBatchProcessing(true);
      let successCount = 0;
      for (const item of candidateItems) {
        const itemId = item._id || item.id;
        const isCrit = item.hoursLeft <= 6;
        const pct = isCrit ? 70 : 40;
        await axios.post(`${API_BASE}/${itemId}/approve`, {
          markdown: pct,
          managerNote: `Algorithmic auto-markdown (${pct}%) applied to prevent perishable spoilage.`,
          managerName: manager.name,
          staffId: manager.staffId,
          department: `${item.category} Section`
        });
        successCount++;
      }

      showToast(`⚡ Algorithmic Engine batch-approved ${successCount} markdowns! Dispatched to POS.`, 'success');
      await fetchItems();
    } catch (err) {
      console.error('Batch auto-approval error:', err);
      showToast('Encountered an issue during batch markdown auto-approval.', 'error');
    } finally {
      setIsBatchProcessing(false);
    }
  }

  // Delete Record
  async function handleDeleteItem(item) {
    const id = item._id || item.id;
    if (!window.confirm(`Permanently remove SKU "${item.name}" from inventory?`)) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      showToast(`SKU "${item.name}" removed from database.`, 'delete');
      await fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.response?.data?.error || 'Failed to delete SKU.', 'error');
    }
  }

  // Open Edit SKU modal
  async function handleOpenEdit(item) {
    const itemId = item._id || item.id;
    try {
      const res = await axios.get(`${API_BASE}/${itemId}`);
      setEditingItem(res.data);
      setIsFormOpen(true);
    } catch (_err) {
      setEditingItem(item);
      setIsFormOpen(true);
    }
  }

  function handleOpenAddItem() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  const criticalCount = items.filter((i) => i.hoursLeft < 6 && i.status !== 'approved').length;

  return (
    <div className="freshflow-app">
      {/* Non-intrusive floating feedback */}
      <Toast toast={toast} />

      {/* Global Navigation Rail */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAddItem={handleOpenAddItem}
        criticalCount={criticalCount}
        manager={manager}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Main Operational Canvas */}
      <main className="main-content-layout">
        {/* PAGE 1: TOP 1% LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToEngine={() => setActiveTab('engine-demo')}
            onNavigateToApi={() => setActiveTab('api-docs')}
            onNavigateToAuth={() => setActiveTab('auth')}
          />
        )}

        {/* AUTHENTICATION & STAFF PORTAL */}
        {activeTab === 'auth' && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            showToast={showToast}
            currentManager={manager}
          />
        )}

        {/* PAGE 2: MISSION-CONTROL OPERATIONS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <OperationsDashboard
            items={items}
            telemetry={telemetry}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            onReviewMarkdown={(item) => setMarkdownItem(item)}
            onSimulatePosSync={handleSimulatePosSync}
            onViewShelfTag={(item) => setShelfTagItem(item)}
            onEditItem={handleOpenEdit}
            onDeleteItem={handleDeleteItem}
            onAddNewItem={handleOpenAddItem}
            onBatchAutoApprove={handleBatchAutoApprove}
            isBatchProcessing={isBatchProcessing}
            refreshData={fetchItems}
          />
        )}

        {/* PAGE 3: THE ALGORITHMIC ENGINE SANDBOX */}
        {activeTab === 'engine-demo' && (
          <EngineSandbox />
        )}

        {/* PAGE 4: INTERACTIVE API EXPLORER / DEVELOPER HUB */}
        {activeTab === 'api-docs' && (
          <ApiExplorer />
        )}

        {/* TAB 5: DISK AUDIT LEDGER (NODE.JS FS MODULE) */}
        {activeTab === 'audit' && (
          <AuditLedger showToast={showToast} manager={manager} />
        )}

        {/* TAB 6: SYSTEM BROWSER APIS */}
        {activeTab === 'html5' && (
          <NativeAPIDemos showToast={showToast} />
        )}
      </main>

      {/* Markdown Approval Modal Drawer */}
      <MarkdownModal
        item={markdownItem}
        isOpen={Boolean(markdownItem)}
        onClose={() => setMarkdownItem(null)}
        onConfirmApproval={handleConfirmMarkdown}
        isSubmitting={isSubmitting}
      />

      {/* Retail Shelf Markdown Tag & Barcode Preview Modal */}
      <ShelfTagModal
        item={shelfTagItem}
        isOpen={Boolean(shelfTagItem)}
        onClose={() => setShelfTagItem(null)}
        manager={manager}
      />

      {/* Department-Level Perishable Risk Analytics Modal */}
      <CategoryAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        items={items}
      />

      {/* SKU Creation / Edit Modal */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        isSubmitting={isSubmitting}
      />

      {/* Enterprise Staff Authentication & Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      {/* Quiet Corporate Footer */}
      <Footer />
    </div>
  );
}

export default App;

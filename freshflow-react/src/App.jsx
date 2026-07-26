import { useState, useEffect } from 'react';
import InventoryForm from './components/InventoryForm.jsx';
import InventoryList from './components/InventoryList.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import './App.css';

// base URL of our JSON Server backend (simulated REST API)
const API_URL = 'http://localhost:3001/inventory';

function App() {
  // state management using useState hook
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // READ - fetch all inventory items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  // CREATE / UPDATE - handled by the same form submit
  async function handleFormSubmit(itemData, editId) {
    try {
      if (editId) {
        // UPDATE - PUT request to existing record
        const res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editId ? updated : i)));
        setEditingItem(null);
      } else {
        // CREATE - POST request for new record
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const created = await res.json();
        setItems([...items, created]);
      }
    } catch (err) {
      console.error('Failed to save item:', err);
      alert('Something went wrong. Make sure json-server is running on port 3001.');
    }
  }

  // DELETE - remove a record
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  }

  // triggered when Edit button clicked on an item
  function handleEditClick(item) {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <i className="fa-solid fa-bolt"></i> FreshFlow
        </div>
        <p className="header-subtitle">React Inventory Console — CRUD Operations</p>
      </header>

      <main className="app-main">

        {/* Create / Update form */}
        <InventoryForm
          onSubmit={handleFormSubmit}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        {/* stats bar */}
        <div className="stats-bar">
          <div className="stat-box">
            <span className="stat-number">{items.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{items.filter(i => i.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{items.filter(i => i.status === 'approved').length}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{items.filter(i => i.hoursLeft < 6).length}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>

        {/* search - bonus feature */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* filter buttons */}
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Read - display list */}
        {loading ? (
          <p className="loading-text">Loading inventory...</p>
        ) : (
          <InventoryList
            items={items}
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

      </main>
    </div>
  );
}

export default App;

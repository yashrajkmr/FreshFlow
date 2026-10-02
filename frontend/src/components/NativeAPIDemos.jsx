// FreshFlow HTML5 Native Browser APIs Showcase Component
// Integrates Canvas 2D, Geolocation, Drag & Drop, Clipboard, Web Notifications, and Event Handling
import React, { useState, useEffect, useRef } from 'react';

function NativeAPIDemos({ showToast }) {
  // Geolocation State
  const [geoStatus, setGeoStatus] = useState('Idle');
  const [coords, setCoords] = useState(null);

  // Drag and Drop State
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);

  // Clipboard State
  const [isCopied, setIsCopied] = useState(false);
  const apiKey = 'FF-STORE-BANGALORE-CENTRAL-PROD-2026-KEY';

  // Canvas State & Ref
  const canvasRef = useRef(null);
  const [curveFactor, setCurveFactor] = useState(40);

  // Draw Canvas Decay Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 50; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw Price Decay Quadratic Curve
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.quadraticCurveTo(
      width / 2,
      40 + (height - 70) * (curveFactor / 100),
      width - 30,
      height - 40
    );
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Glowing dot at critical liquidation threshold
    ctx.beginPath();
    ctx.arc(width - 30, height - 40, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Base Price (₹)', 42, 28);
    ctx.fillText('Hours to Expiration →', width - 140, height - 12);
    ctx.fillText('0h (Liquidation)', width - 90, height - 44);
  }, [curveFactor]);

  // Geolocation Handler
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.');
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setGeoStatus('Locating nearest store hub...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude.toFixed(4), lon: longitude.toFixed(4) });
        setGeoStatus('Located');
        showToast(`Store GPS verified: Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`, 'success');
      },
      (err) => {
        setGeoStatus('Location access denied or unavailable.');
        showToast('Location permission denied or unavailable.', 'error');
      },
      { timeout: 10000 }
    );
  }

  // Web Notifications Handler
  function handleEnableNotifications() {
    if (!('Notification' in window)) {
      showToast('Web Notifications not supported in this browser.', 'error');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('🛒 FreshFlow System Ready', {
          body: 'Store manager desktop notifications enabled for critical perishable items!',
          icon: '/favicon.ico'
        });
        showToast('Web Notifications permission granted!', 'success');
      } else {
        showToast('Notification permission was not granted.', 'info');
      }
    });
  }

  // Clipboard Handler
  function handleCopyApiKey() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiKey).then(() => {
        setIsCopied(true);
        showToast('Store API Key copied to clipboard!', 'success');
        setTimeout(() => setIsCopied(false), 2500);
      });
    }
  }

  // Drag and Drop Handlers
  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setDroppedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Manifest File'
      });
      showToast(`Batch manifest "${file.name}" ingested successfully via Drag & Drop!`, 'success');
    }
  }

  return (
    <div className="html5-showcase-container">
      {/* Banner */}
      <div className="showcase-banner-card">
        <div>
          <h3><i className="fa-solid fa-code"></i> HTML5 Native Browser APIs Showcase</h3>
          <p>
            Demonstrating native modern browser APIs directly integrated into the FreshFlow platform: Canvas 2D graphic rendering, Geolocation GPS positioning, Drag & Drop file ingestion, Clipboard API, and Web Notifications.
          </p>
        </div>
        <span className="badge-tag">W3C HTML5 Standard</span>
      </div>

      <div className="apis-grid">
        {/* API 1: Canvas 2D Price Decay Curve */}
        <div className="api-card">
          <div className="api-card-header">
            <h4><i className="fa-solid fa-chart-line text-emerald"></i> HTML5 Canvas 2D API</h4>
            <span className="api-badge">Perishable Price Decay</span>
          </div>
          <p className="api-desc">
            Renders an interactive price degradation curve as perishable shelf-life approaches zero.
          </p>

          <div className="canvas-wrapper">
            <canvas ref={canvasRef} width="460" height="200" className="decay-canvas"></canvas>
          </div>

          <div className="canvas-controls">
            <label>Liquidation Aggressiveness Factor: <strong>{curveFactor}%</strong></label>
            <input
              type="range"
              min="10"
              max="90"
              value={curveFactor}
              onChange={(e) => setCurveFactor(Number(e.target.value))}
              className="modern-range-slider"
            />
          </div>
        </div>

        {/* API 2: Geolocation API */}
        <div className="api-card">
          <div className="api-card-header">
            <h4><i className="fa-solid fa-location-dot text-rose"></i> Geolocation API</h4>
            <span className="api-badge">Store Branch Locator</span>
          </div>
          <p className="api-desc">
            Queries device coordinates via <code>navigator.geolocation</code> to localize inventory to the nearest supermarket hub.
          </p>

          <div className="api-display-box">
            {coords ? (
              <div className="geo-success-box">
                <i className="fa-solid fa-circle-check text-emerald"></i>
                <div>
                  <strong>Store Branch: Bangalore Central Hub</strong>
                  <p>GPS: Latitude {coords.lat}°, Longitude {coords.lon}°</p>
                </div>
              </div>
            ) : (
              <div className="geo-idle-box">
                <i className="fa-solid fa-compass"></i>
                <span>Status: {geoStatus}</span>
              </div>
            )}
          </div>

          <button type="button" className="btn-secondary w-full" onClick={handleGetLocation}>
            <i className="fa-solid fa-crosshairs"></i> Get Current Store Coordinates
          </button>
        </div>

        {/* API 3: Drag & Drop API */}
        <div className="api-card">
          <div className="api-card-header">
            <h4><i className="fa-solid fa-hand-holding-hand text-cyan"></i> Drag & Drop API</h4>
            <span className="api-badge">Batch Manifest Ingestion</span>
          </div>
          <p className="api-desc">
            Native drag-and-drop zone using <code>onDragOver</code>, <code>onDragLeave</code>, and <code>onDrop</code> for supplier delivery slips.
          </p>

          <div
            className={`dropzone-card ${isDragOver ? 'dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {droppedFile ? (
              <div className="dropped-file-info">
                <i className="fa-solid fa-file-invoice text-emerald"></i>
                <strong>{droppedFile.name}</strong>
                <small>{droppedFile.size} · {droppedFile.type}</small>
                <span className="file-processed-tag">✓ Processed</span>
              </div>
            ) : (
              <div className="dropzone-placeholder">
                <i className={`fa-solid ${isDragOver ? 'fa-download text-emerald' : 'fa-cloud-arrow-up'}`}></i>
                <p>Drag & Drop supplier manifest or invoice here</p>
                <small>Supports .csv, .txt, or delivery PDF slips</small>
              </div>
            )}
          </div>
        </div>

        {/* API 4: Web Notifications & Clipboard */}
        <div className="api-card">
          <div className="api-card-header">
            <h4><i className="fa-solid fa-bell text-amber"></i> Notifications & Clipboard</h4>
            <span className="api-badge">Manager Productivity</span>
          </div>
          <p className="api-desc">
            Desktop system alerts for markdown deadlines alongside 1-click clipboard SKU export.
          </p>

          <div className="clipboard-widget">
            <span className="clip-label">Store POS API Auth Token:</span>
            <div className="clip-row">
              <code>{apiKey}</code>
              <button
                type="button"
                className={`btn-copy ${isCopied ? 'copied' : ''}`}
                onClick={handleCopyApiKey}
              >
                <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary w-full mt-3"
            onClick={handleEnableNotifications}
          >
            <i className="fa-solid fa-bell"></i> Request Web Notification Permission
          </button>
        </div>
      </div>
    </div>
  );
}

export default NativeAPIDemos;

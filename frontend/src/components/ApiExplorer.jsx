// FreshFlow Interactive API Explorer / Developer Hub
// Built-in REST API Console, Live Request Execution, Copyable cURL commands, and Status Telemetry
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Terminal,
  Send,
  Copy,
  CheckCircle2,
  ExternalLink,
  Code2,
  Zap,
  Clock,
  Layers,
  FileJson,
  Shield,
  Server
} from 'lucide-react';

export default function ApiExplorer() {
  const [selectedEndpointKey, setSelectedEndpointKey] = useState('evaluatePricing');
  const [requestBodyText, setRequestBodyText] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [responseLatency, setResponseLatency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedRes, setCopiedRes] = useState(false);

  const endpoints = {
    evaluatePricing: {
      method: 'POST',
      path: '/api/v1/pricing/evaluate-batch',
      title: 'Evaluate Batch Dynamic Pricing',
      description: 'Executes mathematical decay velocity and price elasticity calculations for a perishable batch.',
      defaultBody: {
        basePrice: 240,
        hoursLeft: 11,
        totalShelfLifeHours: 48,
        qty: 24,
        depletionRate: 1.9,
        priceElasticity: -1.6,
        floorPrice: 90,
        category: 'Meat'
      },
      hasQuery: false
    },
    decayingStock: {
      method: 'GET',
      path: '/api/v1/inventory/decaying',
      title: 'Query Decaying Inventory',
      description: 'Retrieves perishable items filtered by urgency, department, and remaining shelf life with compound index performance.',
      defaultQuery: 'urgency=urgent&limit=5',
      hasQuery: true
    },
    posSync: {
      method: 'POST',
      path: '/api/v1/pos/sync',
      title: 'Trigger POS & ESL Webhook Sync',
      description: 'Dispatches real-time markdown prices simultaneously to POS Cashier Registers, Digital Shelf Labels (ESL), Mobile Apps, and SAP ERP.',
      defaultBody: {
        itemId: '6abfeeae582f14055e1cfb91',
        targetPrice: 144,
        markdownPercent: 40,
        storeId: 'STR-BLR-01'
      },
      hasQuery: false
    },
    batchIngest: {
      method: 'POST',
      path: '/api/v1/inventory/batch',
      title: 'Batch Inventory Ingestion',
      description: 'Ingests multiple perishable lots received from warehouse suppliers into MongoDB with schema validation.',
      defaultBody: {
        items: [
          {
            name: `Imported Hass Avocados Box ${Math.floor(100 + Math.random() * 900)}`,
            category: 'Produce',
            hoursLeft: 36,
            totalShelfLifeHours: 72,
            qty: 50,
            basePrice: 150,
            floorPrice: 50
          }
        ]
      },
      hasQuery: false
    },
    rules: {
      method: 'GET',
      path: '/api/v1/pricing/markdown-rules',
      title: 'Fetch Markdown Rules Configuration',
      description: 'Retrieves current active multi-tiered decay velocity thresholds and floor protection settings.',
      hasQuery: false
    }
  };

  const activeEndpoint = endpoints[selectedEndpointKey];

  // Initialize editor text on endpoint change
  useEffect(() => {
    if (activeEndpoint.defaultBody) {
      setRequestBodyText(JSON.stringify(activeEndpoint.defaultBody, null, 2));
    } else {
      setRequestBodyText('');
    }

    if (activeEndpoint.defaultQuery) {
      setQueryParams(activeEndpoint.defaultQuery);
    } else {
      setQueryParams('');
    }

    // Reset previous response
    setResponseStatus(null);
    setResponseData(null);
    setResponseLatency(null);
  }, [selectedEndpointKey]);

  // Execute Live HTTP Request
  const handleExecute = async () => {
    try {
      setLoading(true);
      setResponseStatus(null);
      setResponseData(null);
      const start = performance.now();

      const url = queryParams
        ? `${activeEndpoint.path}?${queryParams}`
        : activeEndpoint.path;

      let payload = null;
      if (activeEndpoint.method === 'POST') {
        try {
          payload = JSON.parse(requestBodyText);
        } catch (_jsonErr) {
          setResponseStatus(400);
          setResponseData({ error: 'Malformed JSON payload in request body.' });
          setLoading(false);
          return;
        }
      }

      const res = await axios({
        method: activeEndpoint.method.toLowerCase(),
        url,
        data: payload
      });

      const end = performance.now();
      setResponseLatency(Math.round(end - start));
      setResponseStatus(res.status);
      setResponseHeaders(res.headers);
      setResponseData(res.data);
    } catch (err) {
      const end = performance.now();
      setResponseLatency(Math.round(end - performance.now()));
      if (err.response) {
        setResponseStatus(err.response.status);
        setResponseHeaders(err.response.headers);
        setResponseData(err.response.data);
      } else {
        setResponseStatus(500);
        setResponseData({ error: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate copyable cURL string
  const curlCommand = `curl -X ${activeEndpoint.method} "http://localhost:3001${activeEndpoint.path}${queryParams ? '?' + queryParams : ''}" \\
  -H "Content-Type: application/json" ${activeEndpoint.method === 'POST' ? `\\\n  -d '${requestBodyText.replace(/\n\s*/g, ' ')}'` : ''}`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setCopiedRes(true);
    setTimeout(() => setCopiedRes(false), 2000);
  };

  return (
    <div className="api-explorer-container">
      {/* ── TOP HEADER ── */}
      <div className="explorer-header">
        <div className="explorer-title-box">
          <div className="section-eyebrow">
            <Terminal size={14} className="text-emerald" />
            ENTERPRISE API GOVERNANCE & DEVELOPER HUB
          </div>
          <h1 className="explorer-title">REST API Testing & Documentation Console</h1>
          <p className="explorer-subtitle">
            Demonstrates idempotent RESTful API architecture, OpenAPI 3.0 governance, and rigorous request-response validation across FreshFlow endpoints.
          </p>
        </div>

        <div className="explorer-actions">
          <a
            href="http://localhost:3001/api/v1/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-swagger-link"
          >
            <ExternalLink size={15} />
            Full Swagger UI Spec
          </a>
          <a
            href="http://localhost:3001/api/v1/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-json-spec"
          >
            <FileJson size={15} />
            Raw OpenAPI JSON
          </a>
        </div>
      </div>

      {/* ── ENDPOINT TABS ── */}
      <div className="endpoint-selector-tabs">
        {Object.entries(endpoints).map(([key, ep]) => (
          <button
            key={key}
            onClick={() => setSelectedEndpointKey(key)}
            className={`endpoint-tab-btn ${selectedEndpointKey === key ? 'active' : ''}`}
          >
            <span className={`method-badge method-${ep.method.toLowerCase()}`}>
              {ep.method}
            </span>
            <span className="ep-path">{ep.path}</span>
          </button>
        ))}
      </div>

      {/* ── WORKSPACE SPLIT (REQUEST BUILDER & RESPONSE VIEWER) ── */}
      <div className="explorer-split-workspace">
        {/* Left Pane: Request Builder */}
        <div className="explorer-pane">
          <div className="pane-header">
            <div className="pane-title-group">
              <span className={`method-badge method-${activeEndpoint.method.toLowerCase()}`}>
                {activeEndpoint.method}
              </span>
              <span className="pane-path-title">{activeEndpoint.path}</span>
            </div>
            <button onClick={handleExecute} disabled={loading} className="btn-send-request">
              <Send size={14} />
              {loading ? 'Sending...' : 'Send Live Request'}
            </button>
          </div>

          <div className="endpoint-meta-info">
            <strong>{activeEndpoint.title}</strong>
            <p>{activeEndpoint.description}</p>
          </div>

          {/* Query Params if applicable */}
          {activeEndpoint.hasQuery && (
            <div className="query-param-block">
              <label className="param-input-label">Query Parameters (?key=value):</label>
              <input
                type="text"
                value={queryParams}
                onChange={(e) => setQueryParams(e.target.value)}
                placeholder="e.g. urgency=critical&limit=10"
                className="param-text-input tnum"
              />
            </div>
          )}

          {/* Request Body Editor if POST */}
          {activeEndpoint.method === 'POST' && (
            <div className="body-editor-block">
              <div className="editor-top-bar">
                <span>Request Body (JSON):</span>
                <span className="text-dim">Content-Type: application/json</span>
              </div>
              <textarea
                value={requestBodyText}
                onChange={(e) => setRequestBodyText(e.target.value)}
                rows={12}
                className="code-textarea tnum"
                spellCheck={false}
              />
            </div>
          )}

          {/* Copyable cURL Block */}
          <div className="curl-display-block">
            <div className="curl-top-bar">
              <span className="curl-label">
                <Code2 size={13} /> Copyable cURL Command:
              </span>
              <button onClick={handleCopyCurl} className="btn-copy-curl">
                {copiedCurl ? <CheckCircle2 size={12} className="text-emerald" /> : <Copy size={12} />}
                {copiedCurl ? 'Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="curl-pre">
              <code>{curlCommand}</code>
            </pre>
          </div>
        </div>

        {/* Right Pane: Live Response Telemetry */}
        <div className="explorer-pane response-pane">
          <div className="pane-header">
            <div className="pane-title-group">
              <Server size={15} className="text-dim" />
              <span>SERVER RESPONSE</span>
            </div>
            {responseStatus && (
              <div className="response-telemetry-chips">
                <span
                  className={`status-chip ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'status-2xx'
                      : responseStatus === 422
                      ? 'status-422'
                      : 'status-err'
                  }`}
                >
                  HTTP {responseStatus}
                </span>
                {responseLatency && (
                  <span className="latency-chip tnum">
                    <Clock size={12} />
                    {responseLatency}ms
                  </span>
                )}
                <button onClick={handleCopyResponse} className="btn-copy-json">
                  {copiedRes ? <CheckCircle2 size={12} className="text-emerald" /> : <Copy size={12} />}
                  {copiedRes ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div className="response-body-container">
            {loading ? (
              <div className="response-loading-state">
                <Zap size={24} className="spin text-emerald" />
                <span>Dispatching HTTP request to FreshFlow Engine...</span>
              </div>
            ) : responseData ? (
              <pre className="response-json-pre">
                <code>{JSON.stringify(responseData, null, 2)}</code>
              </pre>
            ) : (
              <div className="response-idle-state">
                <Terminal size={32} className="text-dim" />
                <p>Click &ldquo;Send Live Request&rdquo; to execute this endpoint against the active Node.js server.</p>
                <div className="idle-hints">
                  <span>Supported Response Codes: <code>200 OK</code> • <code>201 Created</code> • <code>422 Unprocessable</code> • <code>429 Rate Limited</code></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

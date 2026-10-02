// FreshFlow OpenAPI 3.0 / Swagger Specification
// Industry-grade API Governance definition for enterprise retail operations

export const openapiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'FreshFlow Enterprise Algorithmic Dynamic Markdown & Inventory Decay Engine API',
    version: '2.6.0',
    description: `Production-ready RESTful API for automated perishable decay monitoring, dynamic markdown evaluation, POS price synchronization, and shrinkage elimination in high-throughput retail grocery chains.
    
**Architecture Principles:**
- Idempotent and stateless REST operations
- Algorithmic decay velocity ($t_{remaining} / t_{total}$) and price elasticity modeling
- Real-time POS webhook dispatching with latency telemetry
- Role-based Access Control (Store Associate, Store Manager, System Administrator)`,
    contact: {
      name: 'FreshFlow Systems Architecture Team',
      email: 'architecture@freshflow.internal'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local Development & Telemetry Server'
    },
    {
      url: 'https://api.freshflow.internal',
      description: 'Production Edge Gateway'
    }
  ],
  tags: [
    { name: 'Inventory', description: 'Batch ingestion and decay queries for perishable items' },
    { name: 'Pricing Engine', description: 'Dynamic algorithmic markdown calculations and decay curves' },
    { name: 'POS Sync', description: 'Real-time price broadcast to POS terminals and electronic shelf tags' },
    { name: 'Telemetry', description: 'Executive store KPIs, salvage totals, and department heatmaps' },
    { name: 'Auth & RBAC', description: 'Store staff authentication and session management' }
  ],
  paths: {
    '/api/v1/inventory/batch': {
      post: {
        tags: ['Inventory'],
        summary: 'Ingest a batch of perishable items into inventory',
        description: 'Receives an array of SKU batch items from warehouse ERP or supplier manifests, validates schema constraints, and initializes decay timers.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ItemIngestionInput'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Batch successfully ingested',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    successfulCount: { type: 'integer', example: 5 },
                    failedCount: { type: 'integer', example: 0 },
                    items: { type: 'array', items: { $ref: '#/components/schemas/Item' } }
                  }
                }
              }
            }
          },
          '422': {
            description: 'Validation failed on submitted items',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      }
    },
    '/api/v1/inventory/decaying': {
      get: {
        tags: ['Inventory'],
        summary: 'Query expiring perishable stock with algorithmic evaluations',
        description: 'Returns decaying inventory items matching filters (category, urgency, max hours) enriched with real-time algorithmic price recommendations.',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category (Dairy, Bakery, Produce, Meat, etc.)' },
          { name: 'urgency', in: 'query', schema: { type: 'string', enum: ['all', 'critical', 'urgent', 'watch', 'fresh'] }, description: 'Urgency tier filter' },
          { name: 'maxHours', in: 'query', schema: { type: 'number' }, description: 'Maximum hours remaining until expiration' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term by SKU, name, or batch ID' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } }
        ],
        responses: {
          '200': {
            description: 'List of decaying perishable items',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/ItemWithEvaluation' } },
                    pagination: { $ref: '#/components/schemas/Pagination' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/pricing/evaluate-batch': {
      post: {
        tags: ['Pricing Engine'],
        summary: 'Evaluate dynamic pricing decay curve for a perishable batch',
        description: 'Executes the FreshFlow dynamic pricing algorithm evaluating decay velocity, stock run-out risk, price elasticity surge, and margin floor protection.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PricingEvaluationInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Algorithmic evaluation report with mathematical proof and financial projections',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PricingEvaluationOutput' }
              }
            }
          },
          '422': {
            description: 'Unprocessable Entity - invalid input parameters',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        }
      }
    },
    '/api/v1/pricing/markdown-rules': {
      get: {
        tags: ['Pricing Engine'],
        summary: 'Get active markdown rules and threshold configuration',
        responses: {
          '200': {
            description: 'Active dynamic pricing rule configuration',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RuleConfig' } } }
          }
        }
      },
      post: {
        tags: ['Pricing Engine'],
        summary: 'Update dynamic pricing rule configuration',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RuleConfig' } } }
        },
        responses: {
          '200': { description: 'Rules updated successfully' }
        }
      }
    },
    '/api/v1/pos/sync': {
      post: {
        tags: ['POS Sync'],
        summary: 'Trigger simulated real-time POS & Electronic Shelf Label webhook broadcast',
        description: 'Dispatches approved markdown prices simultaneously to POS Cashier Registers, Digital Shelf Labels (ESL), Mobile App Catalogs, and SAP ERP.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['itemId'],
                properties: {
                  itemId: { type: 'string', example: '65b2f8a4e1d90c0018a1a3bc' },
                  targetPrice: { type: 'number', example: 72.0 },
                  markdownPercent: { type: 'number', example: 40 },
                  storeId: { type: 'string', example: 'STR-BLR-01' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Price successfully synchronized across all registered endpoints',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    syncId: { type: 'string', example: 'SYNC-1727876123-452' },
                    sku: { type: 'string', example: 'SKU-BAK-102' },
                    batchId: { type: 'string', example: 'BAT-2026-8941' },
                    newPrice: { type: 'number', example: 72.0 },
                    channelsDispatched: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/telemetry': {
      get: {
        tags: ['Telemetry'],
        summary: 'Fetch live store operations telemetry and department heatmaps',
        responses: {
          '200': {
            description: 'Telemetry dashboard metrics and risk scores',
            content: { 'application/json': { schema: { type: 'object' } } }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ItemIngestionInput: {
        type: 'object',
        required: ['name', 'category', 'hoursLeft', 'qty', 'basePrice'],
        properties: {
          name: { type: 'string', example: 'Artisan Sourdough Boule' },
          sku: { type: 'string', example: 'SKU-BAK-001' },
          batchId: { type: 'string', example: 'BAT-2026-4412' },
          category: { type: 'string', enum: ['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen', 'Seafood', 'Deli'], example: 'Bakery' },
          hoursLeft: { type: 'integer', example: 5 },
          totalShelfLifeHours: { type: 'integer', example: 48 },
          qty: { type: 'integer', example: 24 },
          basePrice: { type: 'number', example: 120.0 },
          floorPrice: { type: 'number', example: 40.0 },
          depletionRate: { type: 'number', example: 1.5 },
          priceElasticity: { type: 'number', example: -2.4 }
        }
      },
      PricingEvaluationInput: {
        type: 'object',
        required: ['basePrice', 'hoursLeft', 'qty'],
        properties: {
          basePrice: { type: 'number', example: 160.0 },
          hoursLeft: { type: 'number', example: 14.0 },
          totalShelfLifeHours: { type: 'number', example: 72.0 },
          qty: { type: 'number', example: 32 },
          depletionRate: { type: 'number', example: 1.6 },
          priceElasticity: { type: 'number', example: -2.0 },
          floorPrice: { type: 'number', example: 50.0 },
          category: { type: 'string', example: 'Dairy' }
        }
      },
      PricingEvaluationOutput: {
        type: 'object',
        properties: {
          meta: { type: 'object' },
          inputs: { type: 'object' },
          decayAnalysis: {
            type: 'object',
            properties: {
              decayVelocityRatio: { type: 'number', example: 0.1944 },
              hoursToNaturalDepletion: { type: 'number', example: 20.0 },
              runOutRiskRatio: { type: 'number', example: 1.43 }
            }
          },
          pricingRecommendation: {
            type: 'object',
            properties: {
              tier: { type: 'string', example: 'T-24_URGENT' },
              recommendedMarkdownPct: { type: 'number', example: 40 },
              dynamicPrice: { type: 'number', example: 96.0 },
              floorHit: { type: 'boolean', example: false }
            }
          },
          financialAndEsgImpact: {
            type: 'object',
            properties: {
              grossRevenueSalvaged: { type: 'number', example: 3072.0 },
              projectedSellThroughPercent: { type: 'number', example: 98.4 },
              carbonOffsetKgCo2: { type: 'number', example: 59.2 }
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          details: { type: 'array', items: { type: 'object' } }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 24 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 50 },
          totalPages: { type: 'integer', example: 1 }
        }
      }
    }
  }
};

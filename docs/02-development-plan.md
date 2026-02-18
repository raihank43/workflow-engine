# Development Plan: Workflow Builder MVP

**Document:** Development Plan & Technical Specification  
**Related Tasks:**  
- #8522 — Plan React-Based Workflow Builder UI  
- #8527 — Develop React MVP Workflow Builder UI  
**Author:** Raden Raihan Kusuma  
**Date:** February 16, 2026  
**Sprint:** Q1 2026 – Sprint 3

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Decisions](#2-technical-decisions)
3. [Project Structure](#3-project-structure)
4. [Development Phases](#4-development-phases)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [Mock Data Design](#7-mock-data-design)
8. [Design System](#8-design-system)
9. [Future Considerations](#9-future-considerations)

---

## 1. Project Overview

### 1.1 Goal

Build a **React MVP** of a visual workflow automation builder, similar to n8n and Zapier. The prototype will be a frontend-only application using mock data and local state — no backend integration.

### 1.2 Scope

**In Scope (MVP):**
- Interactive workflow canvas with pan/zoom
- Draggable nodes (Trigger, Action, Condition/IF)
- Visual connections (edges) between nodes
- Right-sidebar configuration panel (3-step: Setup → Config → Test)
- 2 demo workflows pre-loaded
- Dark mode theme (matching Stitch mockups)
- Floating toolbar for adding nodes
- Zoom controls
- Workflow dashboard/overview page

**Out of Scope (MVP):**
- Backend API / Node.js server
- Real integrations (Slack, Google Sheets, etc.)
- User authentication
- Workflow execution engine
- Database persistence
- Undo/redo
- Collaborative editing
- Export/import workflows

### 1.3 Target Users

Internal team members evaluating the workflow builder concept. This is a **proof-of-concept** to validate UI/UX patterns before full development.

---

## 2. Technical Decisions

### 2.1 Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | React 18+ | Team expertise, component ecosystem |
| **Build Tool** | Vite | Fast HMR, minimal config, modern defaults |
| **Language** | TypeScript | Type safety, better DX, self-documenting code |
| **Canvas** | React Flow v12 (`@xyflow/react`) | Best React-native node editor, built-in pan/zoom/minimap |
| **Styling** | Tailwind CSS v3 | Matches mockup implementation, utility-first, dark mode support |
| **Components** | shadcn/ui (Radix + Tailwind) | Accessible, customizable, pre-styled to match our design |
| **State** | Zustand | Lightweight, React Flow uses it internally, clean API |
| **Icons** | Material Icons (Google Fonts) | Matches mockup icons exactly |
| **Router** | React Router v6 | Dashboard ↔ Canvas navigation |
| **Package Manager** | npm | Standard, widely supported |

### 2.2 Key Technical Rationale

**Why React Flow over custom canvas?**
- Handles complex canvas math (pan, zoom, viewport transforms)
- Built-in node positioning, edge routing, and collision detection
- Custom nodes are just React components (full control over rendering)
- Minimap, controls, and background are included as components
- Active community, 24K+ GitHub stars, MIT license
- Would take months to build equivalent functionality from scratch

**Why Zustand over Redux?**
- React Flow uses Zustand internally — consistent state pattern
- ~1KB bundle vs ~11KB for Redux Toolkit
- Simpler API: no action types, reducers, or dispatch ceremony
- Perfect for MVP scope, can migrate to Redux later if needed

**Why Tailwind over CSS-in-JS?**
- Mockups are already built with Tailwind classes
- Direct 1:1 mapping from mockup HTML to React components
- Dark mode via `dark:` prefix already configured in mockups
- No runtime CSS overhead

**Why shadcn/ui?**
- Copy-paste model — components live in our codebase, fully customizable
- Built on Radix UI primitives (accessible, keyboard-navigable)
- Pre-styled with Tailwind, matches our design approach
- Pick only what we need (select, dialog, tooltip, dropdown)

---

## 3. Project Structure

```
workflow-engine/
├── docs/                          # Documentation (this folder)
│   ├── 01-research-notes.md
│   ├── 02-development-plan.md
│   └── 03-component-conversion-plan.md
├── task/                          # Task descriptions
├── ui-mockup/                     # Stitch HTML mockups (reference)
│   ├── download.htm               # Dashboard Overview
│   ├── canvas-setup-step.html     # Canvas - Setup Step
│   ├── canvas-config-step.html    # Canvas - Config Step
│   └── canvas-test-step.html      # Canvas - Test Step
└── src/                           # React application (to be created)
    ├── index.html
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── main.tsx               # App entry point
        ├── App.tsx                 # Router setup
        ├── index.css              # Tailwind imports + global styles
        │
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.tsx              # App navigation sidebar
        │   │   ├── Header.tsx               # Top header bar
        │   │   └── AppLayout.tsx            # Layout wrapper
        │   │
        │   ├── dashboard/
        │   │   ├── DashboardPage.tsx         # Main dashboard view
        │   │   ├── StatsOverview.tsx         # Stats cards grid
        │   │   ├── WorkflowGrid.tsx          # Workflow cards grid
        │   │   ├── WorkflowCard.tsx          # Individual workflow card
        │   │   └── CreateWorkflowCard.tsx    # "New Automation" CTA card
        │   │
        │   ├── canvas/
        │   │   ├── WorkflowCanvas.tsx        # React Flow canvas wrapper
        │   │   ├── CanvasToolbar.tsx          # Floating add-node toolbar
        │   │   ├── CanvasControls.tsx         # Zoom +/- and fit controls
        │   │   └── CanvasHeader.tsx           # Workflow name + publish bar
        │   │
        │   ├── nodes/
        │   │   ├── TriggerNode.tsx           # Trigger node component
        │   │   ├── ActionNode.tsx            # Action node component
        │   │   ├── ConditionNode.tsx         # IF/Condition branching node
        │   │   ├── FilterNode.tsx            # Data filter node
        │   │   └── BaseNode.tsx             # Shared node wrapper/shell
        │   │
        │   ├── edges/
        │   │   └── CustomEdge.tsx           # Styled bézier edge
        │   │
        │   ├── sidebar/
        │   │   ├── ConfigSidebar.tsx         # Right configuration panel
        │   │   ├── StepIndicator.tsx         # 3-step progress indicator
        │   │   ├── SetupStep.tsx             # Step 1: Setup form
        │   │   ├── ConfigStep.tsx            # Step 2: Config/mapping form
        │   │   ├── TestStep.tsx              # Step 3: Test runner + results
        │   │   └── SidebarFooter.tsx         # Cancel/Continue buttons
        │   │
        │   └── ui/                          # shadcn/ui components
        │       ├── button.tsx
        │       ├── input.tsx
        │       ├── select.tsx
        │       ├── badge.tsx
        │       └── ...
        │
        ├── stores/
        │   ├── workflowStore.ts             # Zustand: nodes, edges, workflow
        │   └── uiStore.ts                   # Zustand: sidebar, selected node
        │
        ├── data/
        │   ├── mockWorkflows.ts             # Pre-built demo workflows
        │   ├── mockNodes.ts                 # Node type definitions + defaults
        │   └── mockTestResults.ts           # Simulated test execution results
        │
        ├── types/
        │   ├── workflow.ts                  # TypeScript interfaces
        │   └── node.ts                      # Node type definitions
        │
        ├── hooks/
        │   ├── useWorkflow.ts               # Workflow manipulation hooks
        │   └── useNodeConfig.ts             # Node configuration hooks
        │
        ├── lib/
        │   └── utils.ts                     # Utility functions (cn, etc.)
        │
        └── constants/
            └── theme.ts                     # Design tokens, colors
```

---

## 4. Development Phases

### Phase 1: Project Setup (Day 1)

**Tasks:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies: `@xyflow/react`, `tailwindcss`, `zustand`, `react-router-dom`
3. Configure Tailwind with design tokens from mockups
4. Set up shadcn/ui (init + install needed components)
5. Create base layout components (AppLayout, Sidebar, Header)
6. Set up routing (Dashboard, Canvas Editor)
7. Verify dev server runs with dark mode theme

**Deliverable:** Running app with navigation between empty dashboard and canvas pages.

---

### Phase 2: Dashboard Page (Day 2)

**Tasks:**
1. Build `StatsOverview` component (4 stat cards)
2. Build `WorkflowCard` component (with status badges: Active, Draft, Paused)
3. Build `CreateWorkflowCard` (dashed border, hover effect)
4. Build `WorkflowGrid` with responsive grid layout
5. Build `DashboardPage` composing all sub-components
6. Wire up mock workflow data
7. Add search bar (visual only, no filtering for MVP)

**Deliverable:** Fully styled dashboard matching the "Workflow Dashboard Overview" mockup.

---

### Phase 3: Canvas Foundation (Day 3–4)

**Tasks:**
1. Set up React Flow instance with dot-grid background
2. Create `CanvasHeader` (workflow name, save status, Publish button)
3. Create `CanvasControls` (zoom +/-, fit view)
4. Define custom node types (Trigger, Action, Condition, Filter)
5. Build `BaseNode` wrapper component (shared styling, handles, status badge)
6. Build `TriggerNode` component
7. Build `ActionNode` component
8. Build `ConditionNode` with TRUE/FALSE output handles
9. Build `CustomEdge` (solid + dashed variants)
10. Load pre-built demo workflow with positioned nodes
11. Implement node selection (click to select, visual ring)

**Deliverable:** Interactive canvas with draggable nodes and Bézier connections.

---

### Phase 4: Configuration Sidebar (Day 5–6)

**Tasks:**
1. Build `ConfigSidebar` container (slide-in panel)
2. Build `StepIndicator` (3-step: Setup → Config → Test)
3. Build `SetupStep` form (node name, account select, service ID)
4. Build `ConfigStep` form (source node ref, column select, transformation logic, value mapping with `{{ }}` tags)
5. Build `TestStep` (Run Test button, JSON result viewer, success/error badge)
6. Build `SidebarFooter` (Cancel, Back, Save & Continue / Finish & Save)
7. Wire step navigation (step 1 → 2 → 3)
8. Connect sidebar to selected node via Zustand store
9. Implement sidebar open/close on node click

**Deliverable:** Full 3-step node configuration experience.

---

### Phase 5: Floating Toolbar & Interactions (Day 7)

**Tasks:**
1. Build `CanvasToolbar` (floating top-center toolbar with node type buttons)
2. Implement add-node-to-canvas from toolbar click
3. Add auto-connect when adding node after selected node
4. Implement node deletion
5. Implement edge deletion
6. Add connection validation (e.g., no self-connections)
7. Add canvas legend/status bar (bottom center, from Config mockup)

**Deliverable:** Complete workflow editing flow.

---

### Phase 6: Polish & Demo (Day 8)

**Tasks:**
1. Load 2 complete demo workflows:
   - E-commerce Fulfillment Flow
   - Slack Notification Pipeline
2. Navigation from dashboard card → canvas editor
3. Add transitions/animations (sidebar slide, node hover effects)
4. Responsive adjustments
5. Final styling pass (match mockup colors, spacing, typography)
6. Write README with setup instructions
7. Create demo walkthrough

**Deliverable:** Complete MVP ready for demo.

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
App
├── AppLayout
│   ├── Sidebar (left nav)
│   └── Router
│       ├── DashboardPage
│       │   ├── Header (search + actions)
│       │   ├── StatsOverview
│       │   └── WorkflowGrid
│       │       ├── CreateWorkflowCard
│       │       └── WorkflowCard (× N)
│       │
│       └── CanvasEditorPage
│           ├── CanvasHeader (workflow title + publish)
│           └── CanvasLayout (flex)
│               ├── WorkflowCanvas (React Flow)
│               │   ├── TriggerNode (custom)
│               │   ├── ActionNode (custom)
│               │   ├── ConditionNode (custom)
│               │   ├── FilterNode (custom)
│               │   ├── CustomEdge (custom)
│               │   ├── CanvasToolbar (floating)
│               │   └── CanvasControls (floating)
│               │
│               └── ConfigSidebar (conditional)
│                   ├── StepIndicator
│                   ├── SetupStep | ConfigStep | TestStep
│                   └── SidebarFooter
```

### 5.2 Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `DashboardPage` | Workflow list overview |
| `/workflow/:id` | `CanvasEditorPage` | Visual workflow editor |

---

## 6. State Management

### 6.1 Zustand Stores

**`workflowStore.ts`** — Core workflow data:

```typescript
interface WorkflowStore {
  // Workflow metadata
  workflow: {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'paused';
    lastSaved: Date;
  };
  
  // React Flow state
  nodes: Node[];
  edges: Edge[];
  
  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: string, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  loadWorkflow: (id: string) => void;
}
```

**`uiStore.ts`** — UI state:

```typescript
interface UIStore {
  // Sidebar
  selectedNodeId: string | null;
  sidebarOpen: boolean;
  currentStep: 1 | 2 | 3;
  
  // Actions
  selectNode: (id: string) => void;
  deselectNode: () => void;
  setStep: (step: 1 | 2 | 3) => void;
  closeSidebar: () => void;
}
```

### 6.2 Data Flow

```
User clicks node → uiStore.selectNode(id) → ConfigSidebar opens
                                           → workflowStore provides node data
                                           → SetupStep/ConfigStep/TestStep renders

User edits field → workflowStore.updateNodeData(id, data)
                → React Flow re-renders node on canvas
                → Sidebar form reflects current data

User clicks "Save & Continue" → uiStore.setStep(next)
                              → Sidebar transitions to next step
```

---

## 7. Mock Data Design

### 7.1 Demo Workflow 1: E-commerce Fulfillment

```json
{
  "id": "wf-ecommerce-fulfillment",
  "name": "E-commerce Fulfillment Flow",
  "status": "active",
  "nodes": [
    { "id": "trigger-1", "type": "trigger", "label": "Incoming Webhook", "subLabel": "Order Created" },
    { "id": "condition-1", "type": "condition", "label": "Total Amount > $100" },
    { "id": "action-1", "type": "action", "label": "Log High-Value Order", "service": "Google Sheets" },
    { "id": "action-2", "type": "action", "label": "Notify Customer", "service": "SendGrid" }
  ],
  "edges": [
    { "source": "trigger-1", "target": "condition-1" },
    { "source": "condition-1", "target": "action-1", "sourceHandle": "true" },
    { "source": "condition-1", "target": "action-2", "sourceHandle": "false" }
  ]
}
```

### 7.2 Demo Workflow 2: Slack Notification Pipeline

```json
{
  "id": "wf-slack-pipeline",
  "name": "Slack Notification Pipeline",
  "status": "draft",
  "nodes": [
    { "id": "trigger-1", "type": "trigger", "label": "New Form Entry", "service": "Typeform" },
    { "id": "filter-1", "type": "filter", "label": "Filter Responses", "subLabel": "Score > 80" },
    { "id": "action-1", "type": "action", "label": "Send Slack Message", "service": "Slack", "channel": "#sales-leads" }
  ],
  "edges": [
    { "source": "trigger-1", "target": "filter-1" },
    { "source": "filter-1", "target": "action-1" }
  ]
}
```

### 7.3 Dashboard Mock Data

Pre-load 6 workflow cards matching the dashboard mockup:
1. **Customer Onboarding** — Active, last run 2m ago (API, CRM, ML integrations)
2. **Social Auto-Post** — Draft, configuring 2/3, updated 4h ago
3. **Invoice Auto-Sync** — Paused, auth required, updated 2d ago
4. **Inventory Alerts** — Active, last run 15m ago (SQL, SLC integrations)
5. **PDF Report Gen** — Draft, configuring 1/3, updated 10h ago
6. **Slack Notification Pipeline** — Draft (links to demo workflow 2)

---

## 8. Design System

### 8.1 Design Tokens

Extracted from Stitch mockups and standardized:

```typescript
const theme = {
  colors: {
    primary: '#5b13ec',
    primaryHover: 'rgba(91, 19, 236, 0.9)',
    primaryGlow: 'rgba(91, 19, 236, 0.2)',
    
    background: {
      light: '#f6f6f8',
      dark: '#161022',
      darkDeep: '#0c0816',
    },
    surface: {
      light: '#ffffff',
      dark: '#1a1a1e',
      darkAlt: 'rgba(255, 255, 255, 0.03)',
    },
    border: {
      light: '#e2e8f0',
      dark: '#2d2d35',
      primarySubtle: 'rgba(91, 19, 236, 0.2)',
    },
    
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    
    nodeColors: {
      trigger: '#22c55e',
      action: '#5b13ec',
      condition: '#5b13ec',
      filter: '#3b82f6',
      email: '#f97316',
    }
  },
  
  typography: {
    fontFamily: "'Inter', sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  canvas: {
    gridSize: 30,
    gridColor: '#2d243d',
    gridDotSize: 1,
  }
};
```

### 8.2 Component Styling Rules

1. **Always dark mode first** — Mockups are dark mode; light mode is secondary
2. **Use Tailwind utilities** — Direct mapping from mockup HTML
3. **Glass panel effect** — `backdrop-blur-md` + semi-transparent bg for toolbars/headers
4. **Node shadows** — `shadow-xl` + `shadow-primary/20` for glowing effects
5. **Consistent spacing** — p-4/p-6 for panels, gap-2/gap-3 for flex items
6. **Text hierarchy** — `text-lg font-bold` for titles, `text-sm` for body, `text-xs` for labels

---

## 9. Future Considerations

### 9.1 Backend Integration (Post-MVP)

When a Node.js backend is introduced:
- Replace Zustand mock data with API calls
- Add workflow CRUD endpoints
- Implement real workflow execution engine
- Add WebSocket for real-time execution status
- Database: PostgreSQL for workflows, Redis for execution queue

### 9.2 Scalability

- React Flow handles 100s of nodes efficiently
- Consider virtualization for dashboard with many workflow cards
- Lazy-load node configuration components per type
- Code-split canvas editor page

### 9.3 Testing Strategy

- **Unit tests:** Vitest for store logic and utility functions
- **Component tests:** React Testing Library for component rendering
- **E2E tests:** Playwright for critical flows (create workflow, configure node)

---

## Appendix: Dependencies

```json
{
  "dependencies": {
    "@xyflow/react": "^12.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "zustand": "^4.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

# Research Notes: Workflow Automation Engine UI

**Document:** Research & Competitive Analysis  
**Related Task:** #8522 — Plan React-Based Workflow Builder UI  
**Author:** Raden Raihan Kusuma  
**Date:** February 16, 2026  
**Sprint:** Q1 2026 – Sprint 3

---

## Table of Contents

1. [Competitive Analysis](#1-competitive-analysis)
2. [React Canvas Libraries](#2-react-canvas-libraries)
3. [Supporting UI Libraries](#3-supporting-ui-libraries)
4. [UI/UX Patterns](#4-uiux-patterns-for-workflow-builders)
5. [Architecture Considerations](#5-architecture-considerations)

---

## 1. Competitive Analysis

### 1.1 n8n

**Tech Stack:** Vue.js (frontend), Node.js (backend), TypeScript, custom canvas built on HTML5 Canvas / SVG  
**Architecture:** Self-hosted & cloud, node-based visual workflow editor

**Key UI Patterns:**
- **Canvas:** Infinite pan/zoom canvas with dot-grid background
- **Nodes:** Rectangular cards with input/output handles (ports), color-coded by type
- **Node Types:** Triggers (green), Actions, IF/Switch (branching), Merge, Code, Webhook
- **Connections:** Bézier curves between node handles, animated data flow indicators
- **Sidebar:** Right-side panel for node configuration, opens on node click
- **Node Config Flow:** Select operation → Configure parameters → Test execution
- **Toolbar:** Top bar with search, undo/redo, zoom controls, execution button
- **Mini-map:** Bottom-right corner for canvas navigation
- **Status:** Visual indicators for execution state (success/error/running)

**Strengths:**
- Open-source, highly extensible
- 400+ integrations
- Expression editor with autocomplete
- Real-time execution visualization

**Weaknesses:**
- Complex UI can overwhelm new users
- Custom canvas = harder to maintain

---

### 1.2 Zapier

**Tech Stack:** React (frontend), Python (backend)  
**Architecture:** Cloud-only, linear multi-step "Zap" editor

**Key UI Patterns:**
- **Linear Flow:** Vertical step-by-step layout (not a free-form canvas)
- **Zap Editor:** Each step is a collapsible card in a vertical list
- **Step Configuration:** Each step opens into a panel with: App selection → Trigger/Action selection → Account connection → Field mapping → Test
- **Trigger-Action Model:** Always starts with one trigger, followed by sequential actions
- **Branching:** Paths feature (paid) for conditional logic
- **Sidebar:** Inline configuration within each step card, no separate sidebar
- **Status:** Test results shown inline with green/red indicators

**Strengths:**
- Extremely simple and intuitive for non-technical users
- Guided step-by-step setup
- Massive integration ecosystem (6,000+ apps)

**Weaknesses:**
- Limited visual flexibility (no canvas)
- Complex workflows get very long vertically
- Branching is a paid feature and less visual than n8n

---

### 1.3 Make (formerly Integromat)

**Tech Stack:** React (frontend), custom SVG rendering engine  
**Architecture:** Cloud-only, circular "scenario builder"

**Key UI Patterns:**
- **Canvas:** Free-form canvas with unique circular/bubble node representation
- **Nodes:** Round bubbles with app icons, connected by lines
- **Flow Direction:** Left-to-right data flow
- **Router:** Special node for conditional branching (splits into multiple paths)
- **Module Config:** Right-side panel with tabs (Settings, Mapping, Filter)
- **Data Mapping:** Visual drag-and-drop field mapping with expression support
- **Status:** Color-coded execution status per node

**Strengths:**
- Visually distinctive and memorable
- Powerful data transformation capabilities
- Good visual representation of complex branching

**Weaknesses:**
- Steep learning curve for beginners
- Circular nodes waste visual space
- Custom rendering engine is complex to replicate

---

### 1.4 Cross-Platform Pattern Comparison

| Feature | n8n | Zapier | Make | **Our App** |
|---------|-----|--------|------|-------------|
| Layout | Free-form canvas | Linear vertical | Free-form canvas | Free-form canvas |
| Node Shape | Rectangular cards | Collapsible cards | Circular bubbles | Rectangular cards |
| Config Panel | Right sidebar | Inline | Right sidebar | Right sidebar |
| Config Flow | Select → Config → Test | App → Event → Fields → Test | Settings tabs | Setup → Config → Test |
| Connections | Bézier SVG curves | Vertical lines | Straight/curved lines | Bézier SVG curves |
| Branching | IF/Switch nodes | Paths (paid) | Router module | IF/Condition nodes |
| Canvas Controls | Pan, Zoom, Minimap | N/A (linear) | Pan, Zoom | Pan, Zoom, Minimap |
| Dot Grid | Yes | No | Yes | Yes |
| Dark Mode | Yes | Yes | Yes | Yes (primary) |
| Toolbar | Top floating | Step controls | Bottom bar | Top floating |

---

## 2. React Canvas Libraries

### 2.1 React Flow (Recommended)

**Website:** [reactflow.dev](https://reactflow.dev)  
**License:** MIT  
**npm:** `@xyflow/react` (v12+)  
**GitHub Stars:** ~24,000+  
**Bundle Size:** ~45KB gzipped  
**Maintained by:** xyflow (formerly wbkd)

**What It Provides:**
- Fully featured node-based graph editor
- Custom node and edge components (full React control)
- Built-in: zoom/pan, minimap, controls, background patterns
- Handles (input/output ports) with connection validation
- Keyboard shortcuts, touch support
- Sub-flows (nested groups)
- Uses Zustand internally for state management

**Pros:**
- ✅ Purpose-built for exactly this use case
- ✅ Excellent TypeScript support
- ✅ Highly customizable (nodes are just React components)
- ✅ Large community, active maintenance
- ✅ Built-in minimap, controls, background
- ✅ Great documentation and examples
- ✅ Performant with large graphs (virtualization)

**Cons:**
- ⚠️ Pro features (sub-flows, helpers) require paid license for commercial use
- ⚠️ Learning curve for advanced customization
- ⚠️ Opinionated state model

**Verdict:** **Best choice for our project.** React Flow handles canvas rendering, node positioning, edge drawing, zoom/pan, and interaction — letting us focus on building the workflow-specific UI.

---

### 2.2 React DnD

**Website:** [react-dnd.github.io](https://react-dnd.github.io/react-dnd/)  
**License:** MIT  
**npm:** `react-dnd`  
**GitHub Stars:** ~21,000+  
**Bundle Size:** ~10KB gzipped

**What It Provides:**
- Drag-and-drop primitives for React (DragSource, DropTarget)
- HTML5 backend and Touch backend
- No visual components — just interaction logic

**Pros:**
- ✅ Lightweight, composable
- ✅ Well-established, battle-tested
- ✅ Can complement React Flow for toolbar → canvas drag

**Cons:**
- ⚠️ Does NOT provide canvas, nodes, edges, or any visual layer
- ⚠️ Not a workflow builder — just a DnD library
- ⚠️ Requires significant custom work for workflow use cases

**Verdict:** **Complementary tool.** Useful for implementing drag-from-toolbar-to-canvas. React Flow v12 also has its own drag support, so React DnD may be optional.

---

### 2.3 react-diagrams

**Website:** [projectstorm.io](https://projectstorm.io/react-diagrams)  
**License:** MIT  
**npm:** `@projectstorm/react-diagrams`  
**GitHub Stars:** ~8,500+  
**Bundle Size:** ~60KB gzipped

**What It Provides:**
- Diagramming framework with nodes, ports, links
- Customizable rendering
- Pan/zoom canvas

**Pros:**
- ✅ Purpose-built for diagrams
- ✅ Supports custom node/port rendering

**Cons:**
- ❌ Less active development than React Flow
- ❌ Smaller community
- ❌ Documentation is lacking
- ❌ More complex API

**Verdict:** **Not recommended.** React Flow is better maintained, better documented, and has a larger ecosystem.

---

### 2.4 Other Alternatives

| Library | Stars | Notes |
|---------|-------|-------|
| **Rete.js** | ~10,000 | Visual programming framework. More complex, better for data-flow programming IDEs. Overkill for our MVP. |
| **JointJS** | ~4,500 | Commercial (Rappid). Powerful but expensive. jQuery dependency. Not React-native. |
| **Litegraph.js** | ~5,000 | Lightweight, canvas-based. No React integration. |
| **Flume** | ~1,500 | React node editor, simpler but limited customization. |

---

### 2.5 Library Comparison Table

| Criteria | React Flow | React DnD | react-diagrams | Rete.js |
|----------|-----------|-----------|---------------|---------|
| **License** | MIT | MIT | MIT | MIT |
| **GitHub Stars** | ~24K | ~21K | ~8.5K | ~10K |
| **Bundle Size** | ~45KB | ~10KB | ~60KB | ~50KB |
| **Learning Curve** | Medium | Low | High | High |
| **Customization** | High | N/A (primitives) | Medium | High |
| **Canvas Built-in** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Minimap** | ✅ Built-in | ❌ | ❌ | Plugin |
| **Edge Drawing** | ✅ Bézier/Step/Smooth | ❌ | ✅ | ✅ |
| **TypeScript** | ✅ Full | ✅ Full | ✅ Partial | ✅ Full |
| **React Native** | ✅ React-first | ✅ React-first | ✅ React-first | ⚠️ Framework |
| **Active Maint.** | ✅ Very active | ✅ Active | ⚠️ Moderate | ✅ Active |

**Recommendation:** Use **React Flow** as the primary canvas library, optionally augmented with **React DnD** for toolbar drag interactions.

---

## 3. Supporting UI Libraries

### 3.1 Tailwind CSS

**Why Tailwind:**
- Our Stitch mockups already use Tailwind CSS classes extensively
- Utility-first approach matches rapid prototyping needs
- Dark mode support via `dark:` prefix (already configured in mockups)
- The design system from mockups uses Tailwind config with custom colors:
  - Primary: `#5b13ec`
  - Background Light: `#f6f6f8`
  - Background Dark: `#161022`
- Consistent with Inter font family already chosen

**Integration:** Use `tailwindcss` with PostCSS in Vite, not the CDN.

---

### 3.2 Component Libraries

| Library | Type | Why Consider |
|---------|------|-------------|
| **Radix UI** | Headless (unstyled) | Accessible primitives for dropdowns, modals, tooltips, dialogs. Pairs well with Tailwind. |
| **Headless UI** | Headless (unstyled) | From Tailwind Labs. Fewer components but tighter Tailwind integration. |
| **shadcn/ui** | Copy-paste components | Built on Radix + Tailwind. Pre-styled but customizable. Best of both worlds. |

**Recommendation:** Use **shadcn/ui** — it provides pre-built Tailwind + Radix components that can be customized to match our design tokens. Using the CLI, we can pick only the components we need.

---

### 3.3 State Management

| Library | Size | Pattern | Why |
|---------|------|---------|-----|
| **Zustand** | ~1KB | Flux-like store | Simple API, React Flow uses it internally. Consistent choice. |
| **Jotai** | ~3KB | Atomic | Good for fine-grained reactivity but different pattern than React Flow. |
| **Redux Toolkit** | ~11KB | Flux | Mature, but heavy for an MVP. |

**Recommendation:** Use **Zustand** — minimal API, same pattern React Flow uses internally, excellent TypeScript support.

---

### 3.4 Icons

The mockups use **Material Icons** and **Material Symbols Outlined**. For consistency:
- Use `@mui/icons-material` or import from Google Fonts CDN
- Alternative: **Lucide Icons** (cleaner, tree-shakeable, React components)

**Recommendation:** Use **Material Icons** via Google Fonts (matches mockup exactly), with **Lucide** as fallback for custom icons.

---

## 4. UI/UX Patterns for Workflow Builders

### 4.1 Canvas Interaction Patterns

| Pattern | Implementation | Priority |
|---------|---------------|----------|
| **Pan** | Click + drag on empty canvas | P0 (MVP) |
| **Zoom** | Scroll wheel + zoom controls | P0 (MVP) |
| **Minimap** | React Flow `<MiniMap>` component | P1 |
| **Fit View** | Center/fit all nodes button | P0 (MVP) |
| **Grid Background** | Dot grid pattern (matches mockups) | P0 (MVP) |
| **Snap to Grid** | Node positioning snaps to grid | P1 |
| **Multi-select** | Shift+click or selection box | P2 |
| **Undo/Redo** | Ctrl+Z / Ctrl+Y | P2 |

### 4.2 Node Configuration Sidebar — 3-Step Pattern

Extracted from our Stitch mockups, the node configuration follows a consistent **3-step pattern**:

```
┌──────────────────────────────────┐
│         Step Indicator           │
│   [1] Setup ─── [2] Config ─── [3] Test │
├──────────────────────────────────┤
│                                  │
│         Step Content             │
│   (form changes per step)        │
│                                  │
├──────────────────────────────────┤
│  [ Cancel ]    [ Save & Continue ]│
└──────────────────────────────────┘
```

**Step 1 — Setup:**
- Node name
- Select account/service
- Service-specific identifier (e.g., Spreadsheet ID)
- Prerequisite info box

**Step 2 — Config (Data Mapping):**
- Source data node reference
- Column/field selection
- Transformation logic (supports JSON/expressions)
- Dynamic value mapping with `{{ }}` template variables
- Pro tip callout

**Step 3 — Test:**
- Test data input/preview
- "Run Test" button
- JSON result viewer (syntax-highlighted)
- Success/error status indicator
- Connection verification summary

### 4.3 Node Types & Visual States

From analyzing all mockups, these node types and visual states are needed:

**Node Types:**
| Type | Icon | Color | Shape |
|------|------|-------|-------|
| Trigger | `bolt` | Green (#22c55e) | Card with rounded corners |
| Action | `table_view`, `mail`, etc. | Varies by service | Card with rounded corners |
| Condition/IF | `call_split` | Primary (#5b13ec) | Card with TRUE/FALSE outputs |
| Filter | `filter_alt` | Blue (#3b82f6) | Card with rounded corners |

**Node Visual States:**
| State | Border | Opacity | Badge | Description |
|-------|--------|---------|-------|-------------|
| Default | 1px border-dark | 100% | — | Idle node |
| Selected | 2px primary + ring | 100% | — | Currently selected |
| Configuring | 2px primary + glow | 100% | "CONFIGURING..." | Being set up |
| Testing | 2px primary + pulse | 100% | "TESTING" | Running test |
| Active/Live | 1px primary/30 | 100% | Green "Active" | Successfully running |
| Draft | 1px border-dark | 100% | Gray "Draft" | Not yet configured |
| Paused/Error | 1px border-dark | 100% | Amber "Paused" | Needs attention |
| Inactive | 1px border-dark | 60% + grayscale | — | Disabled/unreachable |

### 4.4 Connection/Edge Patterns

From mockups:
- **Bézier curves** for connections (`<path d="M... C...">`)
- **Solid lines** for active/configured connections
- **Dashed lines** (`stroke-dasharray="4 4"`) for pending/unfinished paths
- **Primary color** (`#5b13ec`) for active edges
- **Gray** (`#2d2d35`) for inactive edges
- **Animated flow** for data flowing through edges (stretch goal)
- **Drop shadow/glow** on edges: `filter: drop-shadow(0 0 8px rgba(91, 19, 236, 0.2))`

### 4.5 Dark Mode Design Tokens

Extracted from Stitch mockups' Tailwind configuration:

```
Primary:           #5b13ec
Background Dark:   #161022 (main), #0f0f12 (variant), #0c0816 (deep)
Surface Dark:      #1a1a1e
Border Dark:       #2d2d35
Background Light:  #f6f6f8
Font:              Inter, sans-serif
Mono Font:         JetBrains Mono (for code/JSON)
Border Radius:     0.25rem (default), 0.5rem (lg), 0.75rem (xl)
```

---

## 5. Architecture Considerations

### 5.1 Use Cases for MVP

Based on the task requirements and mockup analysis, the MVP should support **2 primary use cases:**

1. **E-commerce Fulfillment Flow** (from Setup mockup)
   - Trigger: Incoming Webhook (Order Created)
   - Condition: Total Amount > $100
   - TRUE path: Log High-Value Order (Google Sheets)
   - FALSE path: Notify Customer (SendGrid)

2. **Slack Notification Pipeline** (from Test mockup)
   - Trigger: New Form Entry (Typeform)
   - Filter: Score > 80
   - Action: Send Slack Message (#sales-leads)

### 5.2 State Model

Key state objects to manage:

```
WorkflowState
├── workflow: { id, name, status, lastSaved }
├── nodes: Node[]
│   ├── id, type, position, data
│   ├── configStep: 'setup' | 'config' | 'test'
│   └── status: 'draft' | 'configuring' | 'active' | 'error'
├── edges: Edge[]
│   ├── id, source, target, sourceHandle, targetHandle
│   └── animated, style
├── selectedNodeId: string | null
├── sidebarOpen: boolean
└── viewport: { x, y, zoom }
```

### 5.3 Mock Data Strategy

Since this is a frontend-only MVP (no backend):
- All workflow data stored in Zustand (in-memory)
- Pre-loaded demo workflows matching the mockup scenarios
- Simulated test execution (delay + mock JSON response)
- LocalStorage persistence as stretch goal
- Mock API responses for node test results

---

## References

- [React Flow Documentation](https://reactflow.dev/docs)
- [n8n GitHub](https://github.com/n8n-io/n8n)
- [Zapier Developer Platform](https://developer.zapier.com/)
- [Make Help Center](https://www.make.com/en/help)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v3](https://tailwindcss.com/)

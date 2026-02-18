# Workflow Builder UI — Research Notes

**Project:** ADW Workflow Engine  
**Prepared for:** Planning Document (Task #8522)  
**Date:** February 16, 2026  
**Author:** Raden Raihan Kusuma

---

## Table of Contents

1. [Existing Workflow Builder Analysis](#1-existing-workflow-builder-analysis)
2. [React Libraries for Workflow Canvas](#2-react-libraries-for-workflow-canvas)
3. [Supporting UI Libraries](#3-supporting-ui-libraries)
4. [UI/UX Patterns for Workflow Builders](#4-uiux-patterns-for-workflow-builders)
5. [Architecture Considerations](#5-architecture-considerations)

---

## 1. Existing Workflow Builder Analysis

### 1.1 n8n

**Overview:** n8n is an open-source, self-hostable workflow automation tool (often called "fair-code" licensed). It provides a visual node-based editor for building complex automations.

**Architecture & Tech Stack:**
- **Frontend:** Built with Vue.js 3 (migrated from Vue 2), TypeScript
- **Canvas:** Custom-built canvas implementation; historically used a library called JSPlumb for node connections, then migrated to a proprietary canvas in later versions. As of 2024-2025, n8n uses its own `@n8n/workflow-canvas` package built on top of HTML5 Canvas/SVG rendering
- **Backend:** Node.js with TypeScript, uses Express, TypeORM for database abstraction
- **Database:** SQLite (default), PostgreSQL supported
- **State management:** Pinia (Vue's recommended state manager)
- **Deployment:** Docker, npm, self-hosted or n8n Cloud

**Key UI Patterns:**
- **Node-based canvas:** Free-form canvas where nodes are placed and connected with curved edges (bezier curves). Nodes can be arranged anywhere on an infinite canvas
- **Trigger nodes:** Visually distinct — they appear as the first node in a workflow with a unique icon (bolt/lightning icon), colored differently (typically green accent)
- **Action nodes:** Standard rectangular cards with an icon representing the integration (Slack, Google Sheets, etc.) and the operation name
- **Branching (IF/Switch):** Uses dedicated IF nodes and Switch nodes. The IF node has two outputs: "true" and "false", each connecting to different downstream paths. Switch nodes can have multiple outputs
- **Node configuration:** When a node is clicked, a **modal panel/sidebar** opens on the right side. The panel includes:
  - Node name and integration type at the top
  - Parameter fields (dropdowns, text inputs, expression editors)
  - An "Execute Node" button to test just that node
  - Input/output data tabs showing JSON data flowing through
- **Expression editor:** Inline expression support using `{{ }}` syntax, allowing users to reference data from previous nodes
- **Execution view:** After running a workflow, each node shows green (success) or red (error) indicators with execution time. Users can click any node to see the input/output data for that specific execution
- **Mini-map:** Available in the bottom corner for navigating large workflows
- **Sticky notes:** Allows users to add text annotations on the canvas for documentation
- **Workflow templates:** A library of pre-built workflow templates users can import

**Strengths:**
- Open-source with active community (~50k+ GitHub stars)
- Powerful expression editor with JavaScript execution
- Self-hostable for data privacy
- 400+ integrations available
- Code node allows running arbitrary JavaScript

**Weaknesses:**
- Complex UI can be overwhelming for non-technical users
- Performance can degrade with very large workflows (100+ nodes)
- Vue.js ecosystem (not React)

---

### 1.2 Zapier

**Overview:** Zapier is the market leader in no-code workflow automation, serving over 2 million businesses. It uses a simplified linear flow model called "Zaps."

**Architecture & Tech Stack:**
- **Frontend:** React (migrated from Backbone.js), TypeScript
- **Backend:** Python (Django), microservices architecture
- **Proprietary/closed-source** — no public repo

**Key UI Patterns:**
- **Linear multi-step flow (Zap Editor):** The core UI is a **vertical linear sequence** of steps — no free-form canvas. Each step is a card stacked vertically, connected by a thin line/arrow. This makes it very intuitive for beginners
- **Trigger-Action model:** Every Zap starts with exactly one trigger, followed by one or more action steps. This is strictly enforced
  - Step 1 is always a **Trigger** (e.g., "New Row in Google Sheets")
  - Steps 2..N are **Actions** (e.g., "Send Slack Message")
- **Step configuration panel:** Each step card expands inline (not a sidebar) to reveal configuration. It follows a multi-tab/section approach:
  1. **App & Event selection:** Choose the app (e.g., Slack) and the event type (e.g., "Send Channel Message")
  2. **Account connection:** Connect/select the account to use via OAuth
  3. **Set up action/trigger:** Configure parameters — field mapping with dropdown data pickers that show output fields from previous steps
  4. **Test step:** Run a test of the individual step and see the output data
- **Data picker (field mapping):** When configuring a field, a dropdown shows all available data from previous steps. This uses a tree structure: `Step 1 > Output Field > Nested Field`. Users click to insert data references
- **Paths (branching):** Zapier added "Paths" for conditional branching. It shows a visual fork in the linear flow — each path has its own condition and subsequent steps. Limited to specific plan tiers
- **Filters:** A filter step can be inserted between actions to conditionally stop execution
- **Formatter steps:** Built-in data transformation steps (text, numbers, dates)
- **Version history:** Zaps have version history, users can revert

**Strengths:**
- Extremely simple UI — lowest learning curve among all platforms
- 7,000+ app integrations (largest ecosystem)
- Reliable infrastructure with high uptime
- Great for non-technical users
- Excellent onboarding UX

**Weaknesses:**
- Linear model limits complex workflow designs
- No free-form canvas — can't visualize branching well
- Expensive at scale (pricing based on task volume)
- Limited customization of the flow layout
- No self-hosting option

---

### 1.3 Make (formerly Integromat)

**Overview:** Make is a visual automation platform known for its distinctive circular/bubble-based scenario builder. It's positioned between Zapier's simplicity and n8n's power.

**Architecture & Tech Stack:**
- **Frontend:** React, custom SVG-based canvas renderer
- **Backend:** Proprietary (cloud-only, with on-premises option for enterprise)
- **Canvas:** Custom SVG-based rendering engine — not using any open-source canvas library

**Key UI Patterns:**
- **Circular/bubble visual builder:** Nodes are rendered as **circles (bubbles)** with the integration's icon inside. This is Make's signature visual style — very distinct from the rectangular node approach of n8n and Zapier
- **Scenario builder:** Workflows are called "Scenarios." The canvas is free-form but nodes are typically arranged left-to-right
- **Module types:**
  - **Triggers** (clock icon): Always the leftmost node
  - **Actions** (wrench icon): Standard operations
  - **Searches** (magnifying glass): Query/lookup operations
  - **Aggregators/Iterators**: Special modules for handling arrays
  - **Routers**: For branching — creates multiple paths from a single node
  - **Filters**: Placed on connection lines (not as separate nodes) — a funnel icon appears on the edge between two modules
- **Connection lines:** Animated dotted lines between bubbles showing data flow direction. When a scenario runs, the data visually "flows" along these lines with an animation
- **Module configuration:** Clicking a module opens a **full overlay panel** (modal-like, centered on screen) with:
  - Connection/account setup
  - Module-specific fields
  - Data mapping with a visual data tree from upstream modules
  - Advanced settings
- **Scheduling:** Built-in cron/interval scheduling UI directly in the scenario editor
- **Error handling routes:** Dedicated error handling paths that branch off from modules — shown as a special red connection
- **Data flow visualization:** During execution, data bundles are shown flowing between modules with bundle counts displayed on connections
- **Execution history:** Detailed execution logs with input/output for each module, shown in a bottom panel

**Strengths:**
- Powerful visual builder with great data flow visualization
- Better handling of complex data transformations than Zapier
- Error handling routes are a powerful pattern
- More affordable than Zapier for high-volume use
- Good balance of power and usability

**Weaknesses:**
- Circular UI can be confusing for users coming from other platforms
- Steeper learning curve than Zapier
- Some users find the bubble metaphor limiting for very large scenarios
- Proprietary/closed-source

---

### 1.4 Common UI Patterns Across All Three

| Pattern | n8n | Zapier | Make |
|---------|-----|--------|------|
| **Canvas type** | Free-form infinite canvas | Linear vertical flow | Free-form circular/bubble canvas |
| **Node shape** | Rectangular cards | Stacked cards (inline) | Circles/bubbles |
| **Trigger indication** | Different color + bolt icon | First step, labeled "Trigger" | Clock icon, leftmost position |
| **Action indication** | Standard card with app icon | Standard card with app icon | Circle with app icon |
| **Condition/Branch** | IF node with true/false outputs | Paths (visual fork) | Router module with filters on edges |
| **Configuration panel** | Right sidebar/modal | Inline expansion of step card | Centered overlay modal |
| **3-step node setup** | Partially (params → test) | Yes (App → Config → Test) | Partially (connection → config) |
| **Connection lines** | Bezier curves (SVG) | Simple vertical lines | Animated dotted lines (SVG) |
| **Data mapping** | Expression editor `{{ }}` | Visual data picker (dropdown tree) | Visual data tree in modal |
| **Test/execute per node** | Yes — "Execute Node" button | Yes — "Test step" button | Yes — "Run once" button |
| **Mini-map** | Yes | No (linear, not needed) | Yes |
| **Zoom controls** | Yes | No | Yes |
| **Status indicators** | Green/red per node after execution | Green checkmark / red X per step | Green/red per module + data counts |
| **Dark mode** | Yes (default dark) | No (light only) | No (light only, dark in development) |
| **Drag-and-drop** | Drag from node panel to canvas | No (click to add) | Drag from module sidebar to canvas |

**Universal patterns identified for our builder:**
1. **Sidebar/panel configuration** — All platforms use a dedicated configuration space (sidebar, modal, or inline) that appears when a node is clicked
2. **3-step node setup flow** — Setup (choose app/account) → Config (map data/parameters) → Test (run and verify). This is most explicit in Zapier but present in all three
3. **Visual node type differentiation** — Triggers, actions, and conditions are visually distinct via color, icon, or shape
4. **Connection/edge drawing** — All use some form of SVG-based connection lines between nodes
5. **Per-node testing** — All allow testing individual nodes before running the full workflow
6. **Data reference system** — All provide a way to reference output data from previous nodes when configuring downstream nodes
7. **Status indicators** — All show node execution status (success, error, pending) with color coding

---

## 2. React Libraries for Workflow Canvas

### 2.1 React Flow (reactflow.dev)

**Overview:** React Flow is the most popular React library for building node-based UIs, interactive diagrams, and workflow editors. Maintained by the xyflow team. As of 2025, it was rebranded under the xyflow organization but the npm package remains `reactflow` (v11) and `@xyflow/react` (v12+).

**Key Features:**
- **Nodes:** Fully customizable React components. Supports custom node types with any JSX inside. Default, input, output, and group node types built-in
- **Edges:** Multiple edge types — straight, step, smoothstep, bezier. Custom edge components supported. Edge labels, animated edges, and edge markers (arrows) built-in
- **Handles:** Connection points on nodes (source/target). Can be placed anywhere on the node. Custom handle components supported. Multiple handles per node
- **Interaction:** Built-in pan, zoom (mouse wheel), node dragging, multi-selection (Shift+click or selection rectangle), keyboard shortcuts
- **Controls:** Built-in `<Controls />` component with zoom in/out/fit buttons
- **Mini-map:** Built-in `<MiniMap />` component showing an overview of the entire graph
- **Background:** Built-in `<Background />` component with dots or lines pattern
- **Connection drawing:** Users can draw connections by clicking and dragging from one handle to another. Custom connection line components supported
- **Drag-and-drop:** Not built-in, but well-documented pattern using HTML5 drag events or React DnD
- **Sub-flows:** Supports grouping nodes inside parent nodes
- **Touch support:** Works on touch devices
- **TypeScript:** Fully typed

**Pros:**
- Largest community and ecosystem for React node-based UIs
- Excellent documentation with many examples
- Highly customizable — nodes and edges are React components
- Active development and maintenance
- Performance optimized — uses `useCallback`, `useMemo`, and only re-renders changed nodes
- Built-in controls, minimap, and background components
- Works with any state management library
- Large number of examples and community projects
- v12 (`@xyflow/react`) improved performance with better rendering pipeline
- Accessibility features (keyboard navigation, ARIA labels)

**Cons:**
- The Pro tier features (dark mode support utility, auto-layout helpers) require a paid subscription — but core library is MIT licensed and fully functional
- For very large graphs (1000+ nodes), performance tuning is needed — may need virtualization
- No built-in auto-layout algorithm — need to use external libraries like `dagre`, `elkjs`, or `d3-hierarchy` for automatic node positioning
- Learning curve for advanced customization (custom edges, connection validation)
- Bundle size is moderate (~150-180KB gzipped for core + dependencies)

**Community & Adoption:**
- ~25,000+ GitHub stars (as of early 2026)
- npm downloads: ~500k-700k/week
- Used by companies like Stripe, Typeform, and various AI/ML platforms
- Active Discord community

**How It Handles Core Concepts:**
- **Nodes state:** Array of node objects `{ id, type, position: {x, y}, data: {...} }`
- **Edges state:** Array of edge objects `{ id, source, target, sourceHandle, targetHandle, type, animated }`
- **State management:** Provides `useNodesState()` and `useEdgesState()` hooks, or you can use external state management (Zustand, Redux, etc.). React Flow v12 internally uses Zustand
- **Events:** `onNodesChange`, `onEdgesChange`, `onConnect`, `onNodeClick`, `onEdgeClick`, `onDrop`, `onDragOver`, etc.
- **Programmatic control:** `useReactFlow()` hook provides methods: `fitView()`, `zoomIn()`, `setCenter()`, `addNodes()`, `addEdges()`, etc.

---

### 2.2 React DnD

**Overview:** React DnD is a set of higher-order components for building complex drag-and-drop interfaces. It's a general-purpose drag-and-drop library, not specifically for workflow builders.

**What It Provides:**
- Drag-and-drop primitives: `useDrag()` and `useDrop()` hooks
- Backend system: HTML5 backend (default), touch backend, test backend
- Drag preview customization
- Monitor objects for tracking drag state
- Multi-backend support for cross-device compatibility

**Pros:**
- Mature and battle-tested (created by Dan Abramov, original React team member)
- Very flexible — not opinionated about visual presentation
- Works well for dragging items *from a toolbar/sidebar onto a canvas*
- Good TypeScript support
- Small bundle size (~25KB gzipped)

**Cons:**
- Only handles drag-and-drop — no canvas, no nodes, no edges, no connections
- Requires significant additional code to be useful in a workflow builder context
- HTML5 drag backend has limitations (no custom drag previews in some browsers without workarounds)
- More complex API than alternatives like dnd-kit

**How It Complements React Flow:**
React DnD is typically used **alongside** React Flow, not as a replacement. The common pattern is:
1. Use React DnD to enable dragging node types from a toolbar/sidebar
2. Use React Flow's `onDrop` handler to receive the dropped item and create a new node at the drop position
3. React Flow handles everything after the node is on the canvas (moving, connecting, etc.)

**Alternative: dnd-kit** — A newer, more modern React drag-and-drop library with better performance, touch support, and cleaner API. Many projects are migrating from React DnD to dnd-kit. Worth considering as a lighter-weight option.

---

### 2.3 react-diagrams (projectstorm/react-diagrams)

**Overview:** react-diagrams is a fully customizable diagramming library built in React. It's part of the Storm platform by Dylan Vorster.

**Key Features:**
- Node-based diagram editor
- Custom node/port/link widgets
- Serialization/deserialization of diagrams
- Smart routing for links
- Zoom, pan, grid snapping
- Built-in engine with event system

**Pros:**
- Highly customizable with a widget-based architecture
- Smart link routing (avoids overlapping nodes)
- Good serialization support — easy to save/load diagrams
- Supports complex port configurations

**Cons:**
- Smaller community (~8,500 GitHub stars)
- Less active development compared to React Flow (fewer recent commits)
- Documentation is sparse and sometimes outdated
- More complex architecture — steeper learning curve
- Heavier abstraction layer — harder to debug
- Fewer examples and community resources
- Bundle size is larger (~200KB+)

**Comparison with React Flow:**
react-diagrams was an early leader in React diagramming libraries but has been largely surpassed by React Flow in terms of community, documentation, and active development. React Flow's simpler API and better docs make it the preferred choice for most new projects.

---

### 2.4 Alternative Options

**Rete.js (v2)**
- Framework-agnostic visual programming editor (supports React, Vue, Angular)
- Plugin-based architecture — pick only what you need
- Built-in features: connections, node editor, minimap, auto-arrange
- ~10,000 GitHub stars
- More opinionated than React Flow — provides a "visual programming" paradigm rather than generic node-based UI
- Heavier learning curve due to plugin system
- License: MIT
- Good for visual scripting/programming editors, but more complex than needed for a workflow builder

**JointJS / Rappid**
- JointJS is the open-source core, Rappid is the commercial product
- Very powerful diagramming library with extensive shape libraries
- Not React-specific — uses plain JavaScript with optional React wrappers
- JointJS: ~4,500 GitHub stars, MPL 2.0 license
- Rappid (commercial): Adds features like keyboard shortcuts, clipboard, selection, undo/redo, tree layout, navigator
- Overkill for a React workflow builder — better suited for enterprise diagramming applications (BPMN, UML, network diagrams)
- Significant bundle size

**XYFlow**
- XYFlow is the **organization** behind React Flow (and Svelte Flow). It's not a separate library — `@xyflow/react` is the v12 rebranding of `reactflow`
- So "XYFlow for React" = React Flow v12+

**Diagram (formerly Beautiful DnD alternatives)**
- `@projectstorm/react-diagrams` — see section 2.3 above
- `butterfly-dag` — Alibaba's DAG diagramming library; primarily for the Chinese market, less documentation in English
- `flume` — A React library specifically for node-based editors with a focus on business logic builders; small community (~1,400 stars), less active

---

### 2.5 Library Comparison Table

| Criteria | React Flow | React DnD | react-diagrams | Rete.js v2 | JointJS |
|----------|-----------|-----------|---------------|------------|---------|
| **License** | MIT | MIT | MIT | MIT | MPL 2.0 (open) / Commercial (Rappid) |
| **GitHub Stars** | ~25,000 | ~21,000 | ~8,500 | ~10,000 | ~4,500 |
| **Bundle Size** | ~150-180KB | ~25KB | ~200KB+ | ~120KB (core) | ~300KB+ |
| **Learning Curve** | Low–Medium | Low | High | Medium–High | High |
| **Customization** | Excellent (React components) | N/A (DnD only) | Good (widget system) | Good (plugin system) | Excellent (shapes/elements) |
| **Built-in Features** | Nodes, edges, controls, minimap, background, connection drawing | Drag-and-drop only | Nodes, links, engine, smart routing | Nodes, connections, minimap, dock | Full diagramming toolkit |
| **Canvas (pan/zoom)** | Yes | No | Yes | Yes | Yes |
| **TypeScript** | Yes | Yes | Yes | Yes | Yes (v4+) |
| **React-specific** | Yes | Yes | Yes | No (framework-agnostic) | No (wrappers available) |
| **Active Development** | Very active | Moderate | Low–Moderate | Active | Active (commercial) |
| **Documentation** | Excellent | Good | Poor–Fair | Fair | Good (paid tier) |
| **Best For** | Workflow builders, node editors | Adding DnD to existing UIs | Complex diagramming | Visual programming editors | Enterprise diagramming |

**Recommendation:** React Flow (`@xyflow/react` v12) is the clear winner for this project. It has the largest React-specific community, best documentation, most active development, and provides exactly the features needed for a workflow builder (nodes, edges, controls, minimap). Supplement with React DnD or dnd-kit for toolbar-to-canvas drag-and-drop.

---

## 3. Supporting UI Libraries

### 3.1 Tailwind CSS

**Why It's Suitable for This Project:**
- **Utility-first approach:** Enables rapid UI prototyping without writing custom CSS files. Since this is an MVP, speed of development is critical
- **Dark mode support:** Built-in `dark:` variant makes implementing dark mode trivial — matches the project's mockup design (dark theme is default in the mockups)
- **Consistency:** Utility classes enforce a design system (spacing, colors, typography) without a separate design token file
- **Customization via `tailwind.config`:** The mockups already use custom colors (`primary: #5b13ec`, `background-dark: #161022`) which can be defined in the Tailwind config
- **No CSS conflicts:** Utility classes don't collide with React Flow's internal styles
- **JIT (Just-In-Time) mode:** Only generates CSS for classes actually used — small production bundle
- **Already used in mockups:** All three HTML mockups use Tailwind CSS via CDN, so the design language is already established

**Key Config from Mockups:**
```
Colors: primary (#5b13ec), background-dark (#161022 or #0f0f12), surface-dark (#1a1a1e)
Font: Inter (300-700 weights)
Border radius: 0.25rem (default), 0.5rem (lg), 0.75rem (xl)
```

**Version:** Tailwind CSS v3.x (stable) or v4.x (if released stable by project start). v3.4+ recommended for current stability.

---

### 3.2 Radix UI / Headless UI

**Radix UI (@radix-ui/react-*)**
- **What it is:** A collection of unstyled, accessible React component primitives
- **Key components useful for this project:**
  - `Dialog` — for modals (node deletion confirmation, workflow settings)
  - `DropdownMenu` — for context menus on nodes, canvas right-click menus
  - `Select` — for dropdowns in the configuration sidebar (e.g., account selection, column picker)
  - `Tooltip` — for hover tooltips on toolbar buttons, node status indicators
  - `Popover` — for inline popovers (data picker, expression helper)
  - `Tabs` — for sidebar sections
  - `Toast` — for notification toasts (save success, test results)
  - `Switch` / `Checkbox` — for toggle settings
  - `ScrollArea` — for styled scrollable areas (sidebar content)
- **Why Radix:** Fully unstyled (works perfectly with Tailwind), WAI-ARIA compliant, composable, tree-shakeable (import only what you use)
- **Bundle impact:** Each component is a separate package (~5-15KB per component)
- **Community:** Very popular, used by Vercel, Linear, and many modern React apps

**Headless UI (@headlessui/react)**
- **What it is:** By the Tailwind Labs team — unstyled, accessible components for React
- **Components:** `Menu` (dropdown), `Listbox` (select), `Combobox`, `Switch`, `Dialog`, `Disclosure`, `Popover`, `Tabs`, `RadioGroup`, `Transition`
- **Pros:** Designed specifically to work with Tailwind CSS; simpler API than Radix
- **Cons:** Fewer components than Radix; less granular control over rendering
- **Comparison:** Radix has more components and more fine-grained composability. Headless UI is simpler but more limited. For this project, Radix is recommended because we need `Tooltip`, `Popover`, and `ScrollArea` which Headless UI lacks

**Recommendation:** Use **Radix UI** for the component primitives. It has better coverage of the components needed (tooltips, popovers, scroll areas) and pairs well with Tailwind.

**shadcn/ui** — Worth mentioning: shadcn/ui is a popular component collection that combines Radix UI + Tailwind CSS into copy-paste-able, customizable components. Instead of installing a library, you copy component source code into your project and own it. This gives maximum flexibility. It includes pre-styled (but customizable) versions of Dialog, Dropdown, Select, Tooltip, etc. using Radix underneath. This could accelerate sidebar UI development significantly.

---

### 3.3 State Management: Zustand vs. Jotai

**Zustand**
- **What it is:** Small, fast, scalable state management for React using a simplified flux pattern
- **Bundle size:** ~2KB gzipped
- **API style:** Store-based — create stores with `create()`, access state with hooks
- **Key features:**
  - No providers needed — stores work outside the React tree
  - Built-in middleware: `persist` (localStorage), `devtools` (Redux DevTools), `immer` (immutable updates)
  - Selective re-renders via selector functions
  - Can hold complex nested state (like nodes, edges, workflow metadata)
  - Works well with React Flow (React Flow v12 uses Zustand internally)
- **Why it fits this project:**
  - Workflow state (nodes, edges, selected node, sidebar state, zoom level) is a complex, interconnected object — Zustand handles this well with a single store or multiple stores
  - No boilerplate — less code than Redux
  - Easy to integrate with React Flow's state hooks

**Jotai**
- **What it is:** Primitive and flexible state management for React using atomic state
- **Bundle size:** ~3KB gzipped  
- **API style:** Atom-based — each piece of state is an independent atom, composed with derived atoms
- **Key features:**
  - Bottom-up approach (atoms → derived state)
  - No providers needed (optional Provider for scoping)
  - Excellent for derived/computed state
  - Integrates with React Suspense
  - Good DevTools support
- **Why it could work:** If the workflow state is decomposed into independent pieces (selected node atom, sidebar open atom, zoom level atom), Jotai's atomic model is elegant
- **Why it might not be ideal:** Workflow state is inherently interconnected (changing a node may affect edges, sidebar, undo history) — managing many atoms with dependencies can become complex

**Comparison:**

| Criteria | Zustand | Jotai |
|----------|---------|-------|
| Mental model | Centralized store(s) | Distributed atoms |
| Boilerplate | Very low | Very low |
| Bundle size | ~2KB | ~3KB |
| Complex nested state | Excellent | Good (but verbose for deep nesting) |
| Derived state | Manual selectors | First-class derived atoms |
| DevTools | Redux DevTools via middleware | Jotai DevTools extension |
| Learning curve | Very low | Low |
| Ecosystem | Larger | Growing |
| React Flow compatibility | Excellent (same internal model) | Good |

**Recommendation:** **Zustand** — better fit for this project because:
1. React Flow already uses Zustand internally, reducing conceptual overhead
2. Workflow state is naturally a centralized, interconnected object graph
3. Middleware (persist, devtools) is useful for an MVP (persist workflow to localStorage for no-backend mode)
4. Simpler mental model for the team

---

### 3.4 Icon Libraries

**Material Icons / Material Symbols**
- **Already used in mockups:** All three HTML mockups use Material Icons (`material-icons` and `material-symbols-outlined` fonts)
- **Variants:** Material Icons (filled, outlined, rounded, sharp, two-tone) and Material Symbols (variable font with weight/fill/grade/size axes)
- **Usage:** Font-based (load via Google Fonts CDN) or SVG-based via `@mui/icons-material` (React components)
- **For React:** Use `@mui/icons-material` for tree-shakeable SVG icon components, OR use `react-icons` which includes Material icons among others
- **Pros:** Huge icon set (2,500+ icons), consistent design, well-known
- **Cons:** Font-based loading adds latency; `@mui/icons-material` brings in MUI as dependency (heavy)

**Lucide Icons (lucide.dev)**
- **What it is:** A fork and continuation of Feather Icons, with 1,500+ icons
- **React package:** `lucide-react` — each icon is a separate, tree-shakeable React component
- **Bundle size:** ~0.5KB per icon (SVG-based)
- **Style:** Clean, consistent stroke-based icons (1.5px stroke default)
- **Pros:** Very lightweight, tree-shakeable, beautiful consistent design, active development, no font loading needed
- **Cons:** Fewer icons than Material (1,500 vs 2,500+), may not have all specific integration icons needed

**Recommendation for this project:**
- Use **Lucide React** as the primary icon library for UI chrome (toolbar, sidebar, controls) — it's lighter and more modern
- For integration-specific icons (Slack, Google Sheets, etc.), use the services' own logos/SVGs (stored locally or loaded from a CDN)
- Avoid Material Icons font loading overhead since this is an SPA where performance matters on the canvas

**Alternative bundled approach:** `react-icons` packages multiple icon sets (Material, Lucide/Feather, Heroicons, etc.) into one library with tree-shaking. This gives flexibility to pick the best icon from any set.

---

## 4. UI/UX Patterns for Workflow Builders

### 4.1 Canvas Interaction Patterns

**Pan (Move Canvas):**
- **Mouse:** Click and drag on empty canvas space (middle-mouse button or left-click on background). React Flow supports this natively
- **Touch:** Two-finger drag on touch devices
- **Keyboard:** Arrow keys to pan (with focus on the canvas)
- **Best practice:** Show a grab cursor when hovering over empty canvas, grabbing cursor while panning

**Zoom:**
- **Mouse wheel:** Scroll up to zoom in, scroll down to zoom out. React Flow handles this natively with configurable min/max zoom (typically 0.1x to 4x)
- **Pinch gesture:** Two-finger pinch on trackpad/touch screens
- **Zoom controls widget:** Fixed-position UI element (bottom-left corner per mockup design) with:
  - `+` button (zoom in)
  - `-` button (zoom out)
  - Current zoom level display (e.g., "85%")
  - "Fit view" button (zoom to fit all nodes in viewport)
- **Zoom to selection:** Double-click a node to zoom and center on it

**Minimap:**
- Position: Bottom-left or bottom-right corner (our mockup doesn't show one, but it's recommended for complex workflows)
- Shows a thumbnail view of the entire workflow graph
- Current viewport is indicated by a highlighted rectangle
- Clickable — clicking on the minimap pans to that area
- React Flow provides `<MiniMap />` component with customizable node colors

**Canvas Background:**
- **Dot grid pattern:** The mockups use a radial gradient dot grid (`background-image: radial-gradient(...)` with 30-40px spacing)
- **Purpose:** Provides visual reference for node alignment and spatial orientation during pan/zoom
- React Flow's `<Background />` component supports `dots`, `lines`, and `cross` patterns

---

### 4.2 Node Configuration Sidebar Pattern (3-Step: Setup → Config → Test)

This is the core UX pattern established in the mockups. Analysis of each step:

**Step 1 — Setup:**
- **Purpose:** Initialize the node — name it, select the integration/app, and connect the account
- **UI Elements (from mockup):**
  - Node name text input
  - Account selector dropdown (with "Add New Account" option)
  - Integration-specific identifier (e.g., Spreadsheet ID for Google Sheets)
  - Prerequisite info box (callout with helpful instructions)
  - "Save & Continue" primary action button
- **UX notes:** This step should be fast — just enough to establish what the node does and authenticate

**Step 2 — Config (Configure/Map Data):**
- **Purpose:** Set up the detailed parameters, map data from upstream nodes, define transformation logic
- **UI Elements (from mockup):**
  - Source data node reference (showing which upstream node provides data)
  - Data mapping section:
    - Column/field selector dropdown
    - Transformation logic textarea (with JSON badge indicator)
    - Output value mapper with draggable tokens/pills (e.g., `{{node_1.user_id}}`, `{{node_1.payload.url}}`)
  - Pro tip info box
  - "Back" and "Continue to Test" buttons
- **UX notes:** This is the most complex step. The token/pill-based data mapping UI is critical — users need to see available data from previous nodes and insert references easily

**Step 3 — Test:**
- **Purpose:** Validate the node's configuration by running a real test
- **UI Elements (from mockup):**
  - "Run Test" primary action button with test data explanation
  - Test results section:
    - Success/failure badge
    - JSON viewer with syntax highlighting (monospace font, color-coded)
    - Copy button on hover
  - Connection verification message
  - "Retest" and "Finish & Save" buttons
- **UX notes:** The test step builds user confidence. Showing formatted, color-coded JSON output helps users verify the data shape

**Step Indicator UI:**
- A horizontal stepper with numbered circles (1, 2, 3)
- Active step: Primary color fill, bold label
- Completed step: Primary color fill with checkmark icon
- Pending step: Gray/muted fill, muted label
- Progress line between steps: Filled with primary color up to the current step

---

### 4.3 Connection/Edge Drawing Patterns

**Edge Types:**
- **Bezier curves:** The default and most visually appealing. Used in the mockups (`C` command in SVG paths). Creates smooth S-curves between nodes
- **Smoothstep edges:** Right-angle connections with rounded corners — commonly used in flowchart-style builders
- **Straight lines:** Direct lines between nodes — used for simple, short connections
- **Animated edges:** Dashed lines with CSS animation (dash offset) to show data flow direction. The mockups use `stroke-dasharray="4 4"` for conditional/pending connections

**Drawing Interaction:**
- User hovers over a node's output handle (small circle on the right side of the node)
- Cursor changes to crosshair/pointer
- User clicks and drags from the handle — a temporary edge follows the cursor
- When the cursor is near a valid input handle on another node, the handle highlights (snap-to-target)
- Releasing the mouse on a valid target creates the connection
- Releasing on empty canvas cancels the connection

**Edge Styling in Context:**
- **Active/confirmed edge:** Solid line in primary color
- **Conditional/false path edge:** Dashed line (lower opacity) — visible in the setup mockup for the "FALSE" branch
- **Pending/unconfigured edge:** Gray, low opacity, dashed
- **Selected edge:** Thicker stroke or glow effect

**Handle Positioning:**
- **Output handles:** Right side of the node (source)
- **Input handles:** Left side of the node (target)
- **Branching nodes (IF/Condition):** Multiple output handles — one for "true" (top-right), one for "false" (bottom-right), as shown in the setup mockup
- **Visual:** Small circles (6px diameter) with the primary color, expanding on hover

---

### 4.4 Drag-and-Drop from Toolbar to Canvas

**Toolbar Design (from mockups):**
- **Position:** Floating horizontal toolbar at the top of the canvas (centered)
- **Content:** Node type buttons (Webhook, Filter, Sheets, Email) with icons and labels
- **Additional items:** "More" button with overflow menu for additional node types
- **Style:** Glassmorphism (semi-transparent background with backdrop blur)

**DnD Interaction Flow:**
1. User sees the toolbar with available node types
2. User clicks and drags a node type from the toolbar
3. A drag preview (ghost image or custom preview) follows the cursor
4. The canvas area highlights as a valid drop target
5. On drop, a new node is created at the drop position with default configuration
6. The configuration sidebar opens automatically to Step 1 (Setup)

**Implementation Approach:**
- Use HTML5 Drag & Drop API (simplest) or React DnD / dnd-kit for the toolbar
- React Flow provides `onDragOver` and `onDrop` event handlers
- On drop, calculate the canvas position using `reactFlowInstance.screenToFlowPosition()`
- Create a new node object with a unique ID, the dropped type, and the calculated position

**Alternative: Click-to-Add:**
- Instead of drag-and-drop, clicking a toolbar button adds a node at a default position (center of viewport or next to the last node)
- Simpler to implement, recommended as a fallback
- The mockups seem to support both patterns

---

### 4.5 Dark Mode Theming

**Observations from Mockups:**
- All three mockups use `class="dark"` on the `<html>` element — Tailwind's class-based dark mode strategy
- Dark mode is the **default/primary** design — the mockups are all in dark mode
- Color palette:
  - Background: `#161022` (deep purple-black) or `#0f0f12` (near black)
  - Surface/cards: `#1a1a1e` or `slate-900`
  - Borders: `#2d243d` (purple-tinted) or `#2d2d35` (neutral dark gray)
  - Primary accent: `#5b13ec` (vivid purple)
  - Text primary: `slate-100` (near white)
  - Text secondary: `slate-400` or `slate-500`
  - Success: `green-500`
  - Warning/action: `orange-500`
  - Info: `blue-400`

**Implementation Strategy:**
- Use Tailwind's `darkMode: "class"` configuration
- Define custom colors in `tailwind.config.js` matching the mockup palette
- Use `dark:` prefix utilities for all color-related classes
- Store user preference in localStorage, default to dark
- For the canvas grid, use CSS `background-image: radial-gradient(...)` with theme-appropriate colors
- Node cards should use elevated surface colors (slightly lighter than background) to create visual hierarchy

**Dark Mode Best Practices for Workflow Builders:**
- Canvas backgrounds should be very dark to make nodes "pop"
- Connection lines need sufficient contrast (use primary color or bright accent)
- Status indicators (green/red/orange) should work on dark backgrounds — use the `/20` opacity variants for backgrounds and full saturation for text/icons
- Glassmorphism effects (backdrop-blur + semi-transparency) work well in dark mode
- Avoid pure black (`#000`) — use very dark purples or grays for richness

---

### 4.6 Status Indicators for Nodes

**States Identified (from mockups and platform analysis):**

| State | Visual Treatment | Icon/Badge | Use Case |
|-------|-----------------|------------|----------|
| **Active/Live** | Green dot indicator, full opacity | Green dot (`bg-green-500`), full progress bar | Node is configured and active in a published workflow |
| **Draft/Pending** | Muted opacity, gray borders | No special badge, standard appearance | Node exists but is not yet configured |
| **Configuring** | Primary color border, glow ring | "CONFIGURING..." label, sync icon with pulse animation | Node's sidebar is currently open and being edited |
| **Testing** | Primary color border, pulse animation ring | "Testing" badge above node, pulse-ring CSS animation | The node is currently executing a test |
| **Success** | Green border or checkmark | Green checkmark icon, "SUCCESS" badge | Test or execution completed successfully |
| **Error** | Red border, red accent | Red X icon, "ERROR" badge, red dot | Test or execution failed |
| **Inactive/Disabled** | 50-60% opacity, grayscale filter | No specific badge | Node is on canvas but disabled/skipped |
| **Selected** | Primary color border (2px), ring effect (`ring-4 ring-primary/20`) | N/A | User has clicked/selected this node |

**Implementation Notes:**
- Use Tailwind's `opacity-60`, `grayscale` utilities for inactive states
- Use CSS `box-shadow` with primary color for glow effects: `box-shadow: 0 0 0 2px #5b13ec, 0 0 20px rgba(91, 19, 236, 0.3)`
- Pulse animation for testing state: CSS keyframe animation on an absolutely-positioned ring element
- Status badges should be positioned as absolute overlays above or below the node card

---

## 5. Architecture Considerations

### 5.1 Component Architecture for a React Workflow Builder

**High-Level Component Tree:**

```
<App>
├── <WorkflowHeader />           — Top nav bar (workflow name, save status, publish button)
├── <WorkflowEditor>             — Main layout container (flex row)
│   ├── <Canvas>                 — React Flow canvas wrapper
│   │   ├── <ReactFlow>          — Library component
│   │   │   ├── <TriggerNode />  — Custom node: trigger type
│   │   │   ├── <ActionNode />   — Custom node: action type
│   │   │   ├── <ConditionNode />— Custom node: if-else branching
│   │   │   ├── <CustomEdge />   — Custom edge component with labels
│   │   │   ├── <Background />   — Dot grid background
│   │   │   ├── <Controls />     — Zoom in/out/fit controls
│   │   │   └── <MiniMap />      — Overview minimap
│   │   └── <CanvasToolbar />    — Floating toolbar (add nodes)
│   └── <ConfigSidebar>          — Right sidebar (conditionally rendered)
│       ├── <SidebarHeader />    — Node icon, name, close button
│       ├── <StepIndicator />    — Setup/Config/Test stepper
│       ├── <SetupStep />        — Step 1 form
│       ├── <ConfigStep />       — Step 2 form (data mapping)
│       ├── <TestStep />         — Step 3 form (run test, view results)
│       └── <SidebarFooter />    — Back/Continue/Save buttons
└── <CanvasLegend />             — Bottom bar (status legend, node count)
```

**Custom Node Components:**
Each node type is a React component registered with React Flow:
- `TriggerNode` — Shows trigger icon (bolt), integration name, event type. Has one output handle
- `ActionNode` — Shows action icon, integration name, operation. Has one input handle and one output handle
- `ConditionNode` — Shows condition icon (call_split), condition expression, TRUE/FALSE labels. Has one input handle and two output handles (true path, false path)

**Shared Components:**
- `NodeCard` — Base wrapper for all node types (border, shadow, status indicators)
- `NodeHandle` — Custom styled handle component (small circle with hover effect)
- `StatusBadge` — Reusable status indicator (active, draft, testing, error)
- `DataToken` — Pill/chip component for data references (`{{node_1.field}}`)
- `JsonViewer` — Syntax-highlighted JSON display for test results

---

### 5.2 State Management Approach

**Recommended: Zustand store(s) with the following structure:**

**Main Workflow Store:**
```
workflowStore:
  ├── workflow
  │   ├── id: string
  │   ├── name: string
  │   ├── status: "draft" | "published"
  │   └── lastSaved: Date
  ├── nodes: Node[]            — React Flow node objects
  │   └── each: { id, type, position, data: { label, integrationType, config, status } }
  ├── edges: Edge[]            — React Flow edge objects
  │   └── each: { id, source, target, sourceHandle, targetHandle, type, animated }
  ├── selectedNodeId: string | null
  ├── sidebarOpen: boolean
  ├── sidebarStep: 1 | 2 | 3   — Setup, Config, Test
  │
  ├── actions:
  │   ├── addNode(type, position)
  │   ├── updateNode(id, data)
  │   ├── removeNode(id)
  │   ├── addEdge(connection)
  │   ├── removeEdge(id)
  │   ├── selectNode(id)
  │   ├── deselectNode()
  │   ├── setSidebarStep(step)
  │   ├── updateWorkflowMeta(name, status)
  │   └── saveWorkflow()       — Serialize to localStorage
```

**Why This Structure:**
- Nodes and edges at the top level — React Flow expects these as flat arrays
- Selected node ID drives the sidebar — when non-null, sidebar opens
- Sidebar step is global (only one node configured at a time)
- Actions are collocated with state (Zustand pattern)
- `persist` middleware can save entire state to localStorage for the frontend-only MVP

**Alternative: Separate Stores**
- `useCanvasStore` — nodes, edges, viewport (zoom/position)
- `useSidebarStore` — selected node, active step, form state
- `useWorkflowStore` — metadata, save status
- This separation prevents unnecessary re-renders but adds complexity for an MVP

---

### 5.3 Mock Data for Frontend-Only MVP

**Strategy:** Since there's no backend, all data is local. Use static JSON fixtures + localStorage.

**What to Mock:**

1. **Workflow definitions** — Pre-built example workflows (e.g., "E-commerce Fulfillment Flow", "Customer Onboarding Flow", "Slack Notification Pipeline" — matching the mockups)

2. **Integration catalog** — A list of available integrations with metadata:
   ```
   { id, name, icon, category, description, availableEvents[], availableActions[] }
   ```
   Examples: Google Sheets, Slack, SendGrid, Webhooks, Filters

3. **Node configuration schemas** — Per integration, define what fields are needed:
   ```
   { integrationType, fields: [{ name, type, label, placeholder, options?, required }] }
   ```

4. **Test results** — Hardcoded JSON responses for the test step:
   ```
   { status: 200, success: true, data: {...}, execution_time: 242 }
   ```

5. **Accounts** — Fake connected accounts:
   ```
   { id, email, provider, connected: true }
   ```

**Mock Data Files:**
- `src/data/workflows.json` — 1-2 example workflows with nodes and edges  
- `src/data/integrations.json` — Catalog of available integrations  
- `src/data/node-schemas.json` — Configuration field definitions per node type  
- `src/data/test-results.json` — Sample test output data  

**Data Flow in MVP:**
1. App loads → reads from localStorage (if exists) or falls back to default mock workflow
2. User edits workflow → Zustand state updates in memory
3. On save → serialize state to localStorage
4. On reload → deserialize from localStorage

---

### 5.4 File/Folder Structure for React + Vite Project

**Recommended structure:**

```
workflow-engine/
├── docs/                        — Research & planning docs
├── ui-mockup/                   — HTML mockup files (existing)
├── src/
│   ├── main.tsx                 — App entry point
│   ├── App.tsx                  — Root component, layout routing
│   ├── index.css                — Global styles, Tailwind directives
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── WorkflowHeader.tsx       — Top navigation bar
│   │   │   └── CanvasLegend.tsx         — Bottom status bar
│   │   │
│   │   ├── canvas/
│   │   │   ├── Canvas.tsx               — React Flow wrapper
│   │   │   ├── CanvasToolbar.tsx         — Floating add-node toolbar
│   │   │   ├── nodes/
│   │   │   │   ├── TriggerNode.tsx       — Trigger node type
│   │   │   │   ├── ActionNode.tsx        — Action node type
│   │   │   │   ├── ConditionNode.tsx     — IF/Else branching node
│   │   │   │   └── NodeCard.tsx          — Shared node card wrapper
│   │   │   ├── edges/
│   │   │   │   └── CustomEdge.tsx        — Custom styled edge
│   │   │   └── handles/
│   │   │       └── NodeHandle.tsx        — Custom connection handle
│   │   │
│   │   ├── sidebar/
│   │   │   ├── ConfigSidebar.tsx         — Sidebar container
│   │   │   ├── StepIndicator.tsx         — 3-step progress indicator
│   │   │   ├── SetupStep.tsx             — Step 1: Setup form
│   │   │   ├── ConfigStep.tsx            — Step 2: Data mapping
│   │   │   ├── TestStep.tsx              — Step 3: Test & results
│   │   │   └── SidebarFooter.tsx         — Footer actions
│   │   │
│   │   └── shared/
│   │       ├── StatusBadge.tsx           — Node status indicator
│   │       ├── DataToken.tsx             — Data reference pill/chip
│   │       ├── JsonViewer.tsx            — Syntax-highlighted JSON
│   │       └── IconButton.tsx            — Reusable icon button
│   │
│   ├── stores/
│   │   └── workflowStore.ts             — Zustand store
│   │
│   ├── data/
│   │   ├── workflows.ts                 — Mock workflow definitions
│   │   ├── integrations.ts              — Integration catalog
│   │   ├── node-schemas.ts              — Node config field definitions
│   │   └── test-results.ts              — Mock test responses
│   │
│   ├── types/
│   │   ├── workflow.ts                  — TypeScript types/interfaces
│   │   ├── node.ts                      — Node-specific types
│   │   └── integration.ts              — Integration types
│   │
│   ├── hooks/
│   │   ├── useWorkflow.ts               — Workflow CRUD operations
│   │   └── useDragAndDrop.ts            — DnD toolbar logic
│   │
│   └── utils/
│       ├── id.ts                        — ID generation helpers
│       └── layout.ts                    — Auto-layout helpers (dagre)
│
├── public/
│   └── icons/                           — Integration logo SVGs
│
├── index.html                           — Vite entry HTML
├── vite.config.ts                       — Vite configuration
├── tailwind.config.ts                   — Tailwind configuration
├── postcss.config.js                    — PostCSS config (for Tailwind)
├── tsconfig.json                        — TypeScript config
├── package.json
└── README.md
```

**Vite Setup Notes:**
- Use `npm create vite@latest` with the `react-ts` template
- Vite provides HMR (Hot Module Replacement), fast builds, and native ES module support
- Key Vite plugins: `@vitejs/plugin-react` (React Fast Refresh)
- Path aliases recommended: `@/` → `src/` via `vite.config.ts` and `tsconfig.json`

**Key Dependencies (package.json):**
```
Production:
  @xyflow/react (React Flow v12)
  zustand
  @radix-ui/react-dialog
  @radix-ui/react-dropdown-menu
  @radix-ui/react-select
  @radix-ui/react-tooltip
  @radix-ui/react-popover
  lucide-react
  tailwind-merge (utility for merging Tailwind classes)
  clsx (conditional class names)

Dev:
  vite
  @vitejs/plugin-react
  typescript
  tailwindcss
  postcss
  autoprefixer
  @types/react
  @types/react-dom
  eslint + prettier (optional)
```

---

## Summary & Recommendations

| Decision Area | Recommendation | Rationale |
|---------------|---------------|-----------|
| **Canvas library** | React Flow (`@xyflow/react` v12) | Best React ecosystem, docs, community. Used by industry leaders |
| **Drag-and-drop** | HTML5 API (start simple) or dnd-kit (if more control needed) | React DnD is heavier than needed; HTML5 API is sufficient for toolbar-to-canvas DnD |
| **CSS framework** | Tailwind CSS v3.4+ | Already used in mockups, utility-first matches rapid MVP development |
| **Component primitives** | Radix UI (or shadcn/ui) | Unstyled, accessible, pairs with Tailwind, has all needed components |
| **State management** | Zustand | Lightweight, same model as React Flow internals, persist middleware for localStorage |
| **Icons** | Lucide React (primary) + custom SVGs for integrations | Lightweight, tree-shakeable, modern design |
| **Build tool** | Vite + React + TypeScript | Fastest DX, industry standard for new React projects |
| **Design theme** | Dark mode default | Per mockup designs. Purple primary (#5b13ec), deep dark background |
| **Node setup UX** | 3-step sidebar (Setup → Config → Test) | Validated pattern across all major platforms, already designed in mockups |

---

*End of research notes.*

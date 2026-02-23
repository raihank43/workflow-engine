# Component Conversion Plan: Stitch Mockups → React Components

**Document:** UI Mockup-to-Component Mapping  
**Related Task:** #8522 — Plan React-Based Workflow Builder UI  
**Author:** Raden Raihan Kusuma  
**Date:** February 16, 2026  
**Sprint:** Q1 2026 – Sprint 3

---

## Table of Contents

1. [Overview](#1-overview)
2. [Stitch Screen Inventory](#2-stitch-screen-inventory)
3. [Screen 1: Dashboard Overview](#3-screen-1-workflow-dashboard-overview)
4. [Screen 2: Canvas — Setup Step](#4-screen-2-visual-workflow-canvas--setup-step)
5. [Screen 3: Canvas — Config Step](#5-screen-3-visual-workflow-canvas--config-step)
6. [Screen 4: Canvas — Test Step](#6-screen-4-visual-workflow-canvas--test-step)
7. [Shared/Reusable Components](#7-sharedreusable-components)
8. [Conversion Guidelines](#8-conversion-guidelines)

---

## 1. Overview

This document maps each Stitch mockup screen to its corresponding React components. It serves as a blueprint for developers converting the static HTML mockups into reusable, interactive React components.

**Source Mockup Files (in `/ui-mockup/`):**

| File | Screen Title | Stitch Screen ID |
|------|-------------|-----------------|
| `download.htm` | Workflow Dashboard Overview | `33f874625d2042948aa344bd5cb1ef63` |
| `canvas-setup-step.html` | Visual Workflow Canvas – Setup Step | `0b51d0253af54e5f979ef535e7773c54` |
| `canvas-config-step.html` | Visual Workflow Canvas – Config Step | `d57bd6d1555e4f8295ec581a00c9d40b` |
| `canvas-test-step.html` | Visual Workflow Canvas – Test Step | `61e59a9f8db04131a5132fac55a5904b` |

**Conversion Approach:**
- Extract HTML structure into React JSX components
- Replace Tailwind CDN with proper PostCSS build
- Replace static content with props and state
- Add interactivity (onClick, onChange, state transitions)
- Connect to Zustand stores

---

## 2. Stitch Screen Inventory

All screens in the Stitch project and their conversion status:

| # | Screen Title | Convert? | Used For |
|---|-------------|----------|----------|
| 1 | **Workflow Dashboard Overview** | ✅ Yes | Dashboard page |
| 2 | **Visual Workflow Canvas – Setup Step** | ✅ Yes | Canvas + Setup sidebar |
| 3 | **Visual Workflow Canvas – Config Step** | ✅ Yes | Config sidebar step |
| 4 | **Visual Workflow Canvas – Test Step** | ✅ Yes | Test sidebar step |
| 5 | Lo-Fi Setup Wireframe | ❌ No | Reference only (wireframe) |
| 6 | Lo-Fi Dashboard Wireframe | ❌ No | Reference only (wireframe) |
| 7 | Lo-Fi Config Wireframe | ❌ No | Reference only (wireframe) |
| 8 | Lo-Fi Test Wireframe | ❌ No | Reference only (wireframe) |
| 9 | PRD Wireframe – Dashboard | ❌ No | Reference only (wireframe) |
| 10 | PRD Wireframe – Workflow Canvas | ❌ No | Reference only (wireframe) |
| 11 | PRD Wireframe – Configuration View | ❌ No | Reference only (wireframe) |
| 12–15 | Generated Screens | ❌ No | Intermediate iterations |

---

## 3. Screen 1: Workflow Dashboard Overview

**Source:** `ui-mockup/download.htm`  
**Route:** `/`

### 3.1 Component Breakdown

```
DashboardPage
├── Sidebar (left, 256px / w-64)
│   ├── Logo + App name ("FlowStream")
│   ├── NavItem × 4 (Workflows*, Connections, History, Settings)
│   └── UserProfile (avatar + name + role)
│
├── MainContent (flex-1)
│   ├── Header (sticky top)
│   │   ├── SearchBar (w-96)
│   │   ├── NotificationButton (with red dot badge)
│   │   └── CreateWorkflowButton (primary CTA)
│   │
│   ├── StatsOverview (grid 4-col)
│   │   ├── StatCard: Total Workflows (24)
│   │   ├── StatCard: Active Tasks (142)
│   │   ├── StatCard: Execution Rate (99.8%, green)
│   │   └── StatCard: System Health (Optimal, green pulse)
│   │
│   └── WorkflowGrid (auto-fill, minmax 320px)
│       ├── CreateWorkflowCard (dashed border, CTA)
│       ├── WorkflowCard: Customer Onboarding (Active)
│       ├── WorkflowCard: Social Auto-Post (Draft, 2/3)
│       ├── WorkflowCard: Invoice Auto-Sync (Paused, auth error)
│       ├── WorkflowCard: Inventory Alerts (Active)
│       └── WorkflowCard: PDF Report Gen (Draft, 1/3)
```

### 3.2 Component Details

#### `Sidebar`
| Mockup Element | React Prop/State | Notes |
|---------------|-----------------|-------|
| App icon + "FlowStream" | Static content | Could be configurable |
| Nav items | `activeItem: string` | Highlight active with `sidebar-item-active` class |
| User avatar | `user: { name, role, avatar }` | Static for MVP |

**Key CSS from mockup:**
```
Sidebar: w-64, bg-white dark:bg-zinc-950, border-r border-zinc-800
Active item: bg-primary/15, border-r-3 border-primary, text-white
```

#### `StatCard`
| Props | Type | Example |
|-------|------|---------|
| `label` | string | "Total Workflows" |
| `value` | string | "24" |
| `valueColor` | string? | "text-green-500" |
| `indicator` | ReactNode? | Pulse dot for health |

**Key CSS from mockup:**
```
Card: bg-white dark:bg-zinc-900, p-6, rounded-xl, border border-zinc-800
Label: text-sm text-slate-500
Value: text-2xl font-bold
```

#### `WorkflowCard`
| Props | Type | Description |
|-------|------|-------------|
| `id` | string | Workflow ID for navigation |
| `title` | string | "Customer Onboarding" |
| `description` | string | Summary text |
| `status` | `'active' \| 'draft' \| 'paused'` | Badge + border styling |
| `icon` | string | Material icon name |
| `iconColor` | string | Tailwind color class |
| `integrations` | string[] | Badge circles (API, CRM, etc.) |
| `progress` | number? | Draft progress (1/3, 2/3) |
| `lastActivity` | string | "Last run 2m ago" |
| `error` | string? | "Auth required" |
| `onClick` | () => void | Navigate to canvas editor |

**Status-specific styling:**
```
Active:  border-l-4 border-l-primary, green badge
Draft:   no left border, gray badge, progress bar
Paused:  no left border, amber badge, error message
```

---

## 4. Screen 2: Visual Workflow Canvas — Setup Step

**Source:** `ui-mockup/canvas-setup-step.html`  
**Route:** `/workflow/:id`

### 4.1 Component Breakdown

```
CanvasEditorPage
├── CanvasHeader (h-16, sticky top)
│   ├── BackButton (arrow_back)
│   ├── Divider
│   ├── WorkflowInfo (title + last saved)
│   ├── DraftButton
│   └── PublishButton (primary CTA)
│
├── CanvasLayout (flex, flex-1)
│   ├── WorkflowCanvas (flex-1, relative)
│   │   ├── ReactFlowProvider
│   │   │   ├── Background (dot-grid)
│   │   │   ├── Nodes
│   │   │   │   ├── TriggerNode (Incoming Webhook)
│   │   │   │   ├── ConditionNode (Total > $100)
│   │   │   │   ├── ActionNode (Log High-Value, selected)
│   │   │   │   └── ActionNode (Notify Customer, dimmed)
│   │   │   └── Edges (Bézier, solid + dashed)
│   │   │
│   │   ├── CanvasToolbar (floating top-center)
│   │   │   ├── Webhook, Filter, Sheets, Email buttons
│   │   │   └── More button
│   │   │
│   │   └── CanvasControls (bottom-left)
│   │       ├── Zoom In/Out
│   │       ├── Zoom Level (85%)
│   │       └── Fit View
│   │
│   └── ConfigSidebar (w-96, right)
│       ├── SidebarHeader
│       │   ├── NodeIcon + "Setup Node" + subtitle
│       │   ├── CloseButton
│       │   └── StepIndicator (Step 1 active)
│       │
│       ├── SetupStep (form content)
│       │   ├── Input: Node Name
│       │   ├── Select: Account
│       │   ├── Input: Spreadsheet ID + search btn
│       │   └── InfoBox: Prerequisite message
│       │
│       └── SidebarFooter
│           ├── CancelButton
│           └── SaveContinueButton
```

### 4.2 Node Components (from Canvas)

#### `TriggerNode`
Extracted from mockup HTML — position: `left-40 top-[260px]`

| Element | Content | CSS |
|---------|---------|-----|
| Icon | `bolt` | `w-8 h-8 rounded-lg bg-primary/20 text-primary` |
| Type label | "TRIGGER" | `text-xs font-bold uppercase tracking-wider text-primary` |
| Title | "Incoming Webhook" | `text-sm font-semibold` |
| Subtitle | "Order Created" | `text-[10px] text-slate-500 uppercase` |

**React Flow Handles:**
- Output: Right side (source)

#### `ConditionNode`
Extracted from mockup HTML — position: `left-[380px] top-[240px]`

| Element | Content | CSS |
|---------|---------|-----|
| Header | `call_split` + "CONDITION" | `bg-primary/10 p-3 border-b border-primary/20` |
| IF label | "IF" | `text-sm font-medium italic text-slate-400` |
| Condition text | "Total Amount > $100" | `text-sm font-semibold` |
| TRUE output | Green badge + green dot | `text-green-500 bg-green-500/10` |
| FALSE output | Gray badge + gray dot | `text-slate-500 bg-slate-500/10` |

**React Flow Handles:**
- Input: Left side (target)
- Output TRUE: Right side, top (sourceHandle: "true")
- Output FALSE: Right side, bottom (sourceHandle: "false")

#### `ActionNode` (Selected State)
Extracted from mockup HTML — position: `left-[760px] top-[140px]`

| Element | Content | CSS |
|---------|---------|-----|
| Icon | `table_view` | `w-8 h-8 rounded-lg bg-green-500/20 text-green-500` |
| Type label | "ACTION" | `text-[10px] font-bold uppercase text-green-500` |
| Title | "Log High-Value Order" | `text-sm font-semibold` |
| Service | "Google Sheets • Active" | `text-[10px] text-slate-500` |
| Status banner | "CONFIGURING..." | `bg-primary text-white text-[10px] font-bold` |
| Selected ring | — | `border-2 border-primary ring-4 ring-primary/20` |

**React Flow Handles:**
- Input: Left side (target)
- Output: Right side (source)

---

## 5. Screen 3: Visual Workflow Canvas — Config Step

**Source:** `ui-mockup/canvas-config-step.html`  
**Route:** Same as Screen 2 (sidebar step changes)

### 5.1 Sidebar — Config Step Content

```
ConfigSidebar (same container as Setup)
├── SidebarHeader
│   ├── "Configure Node" title
│   ├── CloseButton
│   └── StepIndicator (Step 2 active, Step 1 completed ✓)
│
├── ConfigStep (form content, scrollable)
│   ├── SourceDataNode (read-only reference: "Webform Trigger (Node_1)")
│   │
│   ├── DataMapping section
│   │   ├── Select: "Select Column" (with help tooltip)
│   │   │   Options: User Email, Plan Type, Signup Date, Country
│   │   │
│   │   ├── Textarea: "Transformation Logic" (with JSON badge)
│   │   │
│   │   └── TagInput: "Map Output Value" (dashed border container)
│   │       ├── Tag: {{node_1.user_id}} (with data_object icon + close)
│   │       ├── Tag: {{node_1.payload.url}} (with link icon + close)
│   │       └── TextInput: "Type or drop..."
│   │
│   └── ProTip InfoBox
│       "You can use JavaScript expressions inside {{ }} brackets..."
│
└── SidebarFooter
    ├── BackButton
    └── ContinueToTestButton
```

### 5.2 New Components from Config Step

#### `TagInput` (Dynamic Value Mapping)
A custom component for template variable tags:

| Props | Type | Description |
|-------|------|-------------|
| `tags` | `{ icon: string, value: string }[]` | Current template variables |
| `onRemoveTag` | `(index: number) => void` | Remove tag handler |
| `onAddTag` | `(value: string) => void` | Add new tag |
| `placeholder` | string | "Type or drop..." |

**Key CSS:**
```
Container: flex flex-wrap gap-2 p-3 min-h-[100px] 
           bg-slate-50 dark:bg-background-dark 
           border border-dashed border-border-dark rounded-lg
Tag:       bg-primary/10 text-primary border border-primary/20 
           px-2 py-1 rounded text-xs font-medium
```

#### `SourceNodeReference`
Read-only display of the source data node:

**Key CSS:**
```
Container: flex items-center gap-3 p-3 bg-background-dark border border-border-dark rounded-lg
Icon: material-icons text-primary (bolt)
Text: text-sm font-medium italic
```

### 5.3 Canvas Updates (Config Step)

The canvas in the Config step shows slightly different node states:

| Node | State | Visual |
|------|-------|--------|
| Webform Trigger | Completed | Green progress bar (100%), normal border |
| Data Filter | Active/Configuring | `border-2 border-primary`, glow shadow, "Configuring..." badge |
| Auto Response | Inactive | `opacity-60 grayscale`, gray bg |

Also introduces:
- **Canvas Legend Bar** (bottom center, floating):
  ```
  [● Live] | [● Draft] | [3 Nodes Active]
  ```

---

## 6. Screen 4: Visual Workflow Canvas — Test Step

**Source:** `ui-mockup/canvas-test-step.html`  
**Route:** Same as Screen 2 (sidebar step changes)

### 6.1 Key Differences from Config Step

**Header:** Step indicator moves to the top navigation bar (inline, not in sidebar header):
```
CanvasHeader (nav bar)
├── Logo + Workflow title
├── StepIndicator (inline, horizontal)
│   ├── Step 1: Setup (gray, completed)
│   ├── Step 2: Config (gray, completed)
│   └── Step 3: Test (primary, active)
└── Publish/Discard buttons
```

### 6.2 Sidebar — Test Step Content

```
ConfigSidebar (w-[480px] — wider than setup/config)
├── PanelHeader
│   ├── play_circle icon + "Test Step" title
│   ├── CloseButton
│   └── Description text
│
├── TestStep (scrollable content)
│   ├── TestDataSection
│   │   ├── "TEST DATA" label (primary)
│   │   ├── Description text
│   │   └── RunTestButton (full-width, primary, play icon)
│   │
│   ├── TestResultsSection
│   │   ├── "TEST RESULTS" header + SUCCESS badge (green)
│   │   └── JsonViewer (code block)
│   │       {
│   │         "status": 200,
│   │         "success": true,
│   │         "data": {
│   │           "message_id": "TS12938401",
│   │           "channel": "C012AB3CD",
│   │           "ts": "1634567890.123456"
│   │         },
│   │         "integration": "slack_v2",
│   │         "execution_time": 242
│   │       }
│   │       CopyButton (hover reveal)
│   │
│   └── ConnectionSummary
│       ├── check_circle icon (green)
│       └── "Connection to Slack verified successfully."
│
└── SidebarFooter
    ├── RetestButton
    └── FinishSaveButton
```

### 6.3 New Components from Test Step

#### `JsonViewer`
Syntax-highlighted JSON display:

| Props | Type | Description |
|-------|------|-------------|
| `data` | object | JSON data to display |
| `copyable` | boolean | Show copy button on hover |

**Key CSS:**
```
Container: bg-[#0c0816] border border-primary/10 rounded-xl p-4
Font: text-[13px] font-mono leading-relaxed (JetBrains Mono)
Colors: purple for brackets, blue for keys, amber for numbers, green for strings
Copy btn: absolute top-3 right-3, opacity-0 group-hover:opacity-100
```

#### `TestResultBadge`
Success/failure status indicator:

| Props | Type | Description |
|-------|------|-------------|
| `status` | `'success' \| 'error' \| 'pending'` | Result state |

**Key CSS:**
```
Success: bg-green-500/10 text-green-500 border-green-500/20
         + animated pulse dot
Error:   bg-red-500/10 text-red-500 border-red-500/20
```

#### `RunTestButton`
Full-width primary action button:

**Key CSS:**
```
Button: w-full py-3 bg-primary text-white font-semibold rounded-lg
        shadow-lg shadow-primary/30
        active:scale-[0.98] transition-all
Icon: play_arrow text-xl
```

### 6.4 Canvas Updates (Test Step)

| Node | State | Visual |
|------|-------|--------|
| New Form Entry | Default | Normal styling |
| Filter Responses | Default | Normal styling |
| Send Slack Message | Testing | `border-2 border-primary`, glow, pulse animation, "TESTING" label |

**New visual: Pulse Ring Animation**
```css
.pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
/* Scales 0.95 → 1.05 → 0.95, opacity 0.8 → 0.4 → 0.8 */
```

**New visual: Pro Tip Floating Tooltip**
```
Floating card near active node:
- bg-background-dark/90, border border-primary/20, backdrop-blur
- "Pro Tip" header with info icon
- Variable reference example: {{steps.slack_1.output}}
```

---

## 7. Shared/Reusable Components

These components are shared across multiple screens:

| Component | Used In | Description |
|-----------|---------|-------------|
| `StepIndicator` | Setup, Config, Test sidebars | 3-step progress (circle + label + connecting line) |
| `SidebarFooter` | All sidebar steps | Cancel/Back + Continue (text changes per step) |
| `InfoBox` | Setup (prerequisite), Config (pro tip) | Info icon + styled message box |
| `BaseNode` | All canvas views | Shared node wrapper (border, shadow, handles, status badge) |
| `CanvasControls` | All canvas views | Zoom +/-, zoom level %, fit view |
| `CanvasHeader` | All canvas views | Workflow title + save status + publish CTA |
| `StatusBadge` | Dashboard cards, canvas nodes | Active/Draft/Paused/Testing badges |

### 7.1 `StepIndicator` Variants

| Step State | Visual |
|------------|--------|
| Completed | Primary bg, white checkmark icon, primary label |
| Active | Primary bg with glow shadow, step number, bold white label |
| Pending | Dark bg (`bg-slate-800`), gray number, gray label |

### 7.2 `BaseNode` Props

```typescript
interface BaseNodeProps {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'filter';
  icon: string;
  iconBgColor: string;     // e.g., "bg-primary/20"
  iconColor: string;        // e.g., "text-primary"
  typeLabel: string;        // e.g., "TRIGGER"
  typeLabelColor: string;   // e.g., "text-primary"
  title: string;            // e.g., "Incoming Webhook"
  subtitle?: string;        // e.g., "Order Created"
  service?: string;         // e.g., "Google Sheets • Active"
  status?: 'default' | 'selected' | 'configuring' | 'testing' | 'inactive';
  statusBanner?: string;    // e.g., "CONFIGURING..."
  selected?: boolean;
  children?: ReactNode;     // For custom content (e.g., condition branches)
}
```

---

## 8. Conversion Guidelines

### 8.1 HTML → JSX Rules

| HTML (Mockup) | React (Component) |
|--------------|-------------------|
| `class="..."` | `className="..."` |
| `<a href="#">` | `<Link to="/...">` or `<button>` |
| `<img data-alt="..." src="...">` | `<img alt="..." src="...">` |
| Static text | Props or mock data |
| Inline SVG `<path>` | React Flow `<Edge>` components |
| Hardcoded positions (`left-40 top-[260px]`) | React Flow node positions |
| `onclick` | `onClick` event handler |
| `<select>` | shadcn/ui `<Select>` |
| `<input>` | shadcn/ui `<Input>` |

### 8.2 What NOT to Convert Directly

1. **Absolute positioning for nodes** — React Flow handles node layout
2. **SVG connection paths** — React Flow draws edges automatically
3. **Canvas grid background CSS** — Use React Flow `<Background>` component
4. **Zoom controls HTML** — Use React Flow `<Controls>` (customized)
5. **Static workflow data** — Replace with Zustand store data

### 8.3 What TO Convert Directly

1. **Sidebar layout and forms** — Direct HTML → JSX conversion
2. **Node card styling** — Tailwind classes map 1:1 to custom React Flow nodes
3. **Dashboard layout** — Direct HTML → JSX conversion
4. **Design tokens** — Extract to Tailwind config
5. **Status badges** — Direct conversion with dynamic props
6. **Typography and spacing** — All Tailwind utilities transfer directly

### 8.4 Conversion Priority Order

1. **Dashboard Page** — Simplest, no canvas interactions
2. **BaseNode + node types** — Core building block
3. **Canvas with nodes** — React Flow setup + custom nodes
4. **SetupStep sidebar** — First interactive form
5. **ConfigStep sidebar** — More complex (tag input, mapping)
6. **TestStep sidebar** — JSON viewer, test simulation

# Workflow Engine — Node Types Reference

> Complete specification of all available node types in the ADW Workflow Engine.

---

## Table of Contents

1. [Overview](#overview)
2. [Node Architecture](#node-architecture)
3. [Trigger Nodes](#trigger-nodes)
4. [Action Nodes](#action-nodes)
5. [Logic & Branching Nodes](#logic--branching-nodes)
6. [Data Transformation Nodes](#data-transformation-nodes)
7. [Flow Control Nodes](#flow-control-nodes)
8. [Integration Nodes](#integration-nodes)
9. [Error Handling Nodes](#error-handling-nodes)
10. [UI/UX Notes](#uiux-notes)
11. [Adding New Node Types](#adding-new-node-types)

---

## Overview

The workflow engine supports **13 node types** organized into functional categories. Each node renders as a React Flow custom node with:

- **Visual identity**: Unique icon, color scheme, and header label
- **Connection handles**: Input (left) and output (right) handles for wiring
- **Delete button**: Red × button appears on hover (top-right corner)
- **Status system**: Supports `default`, `selected`, `configuring`, `testing`, `active`, `draft`, `paused`, `inactive`

### Node Type Summary

| Type | Category | Icon | Color | Inputs | Outputs |
|------|----------|------|-------|--------|---------|
| `trigger` | Trigger | `bolt` | Purple (primary) | 0 | 1 |
| `schedule` | Trigger | `schedule` | Amber | 0 | 1 |
| `action` | Action | `table_view` | Green | 1 | 1 |
| `condition` | Logic | `call_split` | Purple | 1 | 2 (true/false) |
| `ifelse` | Logic | `call_split` | Purple-500 | 1 | 2 (then/else) |
| `switch` | Logic | `alt_route` | Indigo | 1 | 3 (case1/case2/default) |
| `filter` | Data | `filter_alt` | Blue | 1 | 1 |
| `transform` | Data | `transform` | Teal | 1 | 1 |
| `loop` | Flow | `loop` | Violet | 1 | 2 (next + loop-back) |
| `delay` | Flow | `schedule` | Amber | 1 | 1 |
| `merge` | Flow | `merge` | Sky | 2 | 1 |
| `http_request` | Integration | `http` | Cyan | 1 | 1 |
| `error_handler` | Error | `error_outline` | Red | 1 | 2 (success/error) |

---

## Node Architecture

### File Structure

```
src/
├── types/workflow.ts          # NodeType union type
├── constants/theme.ts         # nodeTypeConfig (visual config per type)
├── components/nodes/
│   └── BaseNode.tsx           # BaseNode wrapper + all node components
├── components/canvas/
│   ├── WorkflowCanvas.tsx     # nodeTypes registry for React Flow
│   └── CanvasToolbar.tsx      # Toolbar buttons to add nodes
└── stores/workflowStore.ts    # addNode() with type→component mapping
```

### Data Schema

Every node's `data` field conforms to `WorkflowNodeData`:

```ts
interface WorkflowNodeData extends Record<string, unknown> {
  label: string;           // Display name
  subLabel?: string;       // Secondary text (e.g., service name)
  nodeType: NodeType;      // The logical type
  icon: string;            // Material Icons name
  iconBgColor: string;     // Tailwind bg class
  iconColor: string;       // Tailwind text class
  typeLabel: string;       // Uppercase badge (e.g., "TRIGGER")
  typeLabelColor: string;  // Badge color class
  service?: string;        // Integration service label
  status: NodeStatus;      // Visual state
  statusBanner?: string;   // Floating banner text
  conditionText?: string;  // For condition/ifelse nodes
  configStep?: ConfigStep; // Config sidebar step
  config?: Record<string, unknown>;
}
```

---

## Trigger Nodes

### Webhook Trigger (`trigger`)

Starts a workflow when an external event is received via HTTP webhook.

- **Handles**: 1 output (right)
- **Use cases**: Form submissions, payment events, CRM updates, CI/CD hooks
- **Example**: "Incoming Webhook — Order Created"

### Scheduled Trigger (`schedule`)

Starts a workflow on a time-based schedule (cron-like).

- **Handles**: 1 output (right)
- **Use cases**: Daily reports, hourly monitoring, weekly cleanup
- **Example**: "Weekly Schedule — Every Monday 8 AM"

---

## Action Nodes

### Action (`action`)

General-purpose execution node. Performs a task like sending data, writing to a database, or calling an API.

- **Handles**: 1 input (left), 1 output (right)
- **Use cases**: Send email, write to Google Sheets, post to Slack, update CRM
- **Example**: "Send Slack Message — #sales-leads"

---

## Logic & Branching Nodes

### Condition (`condition`)

Evaluates a boolean expression and branches into TRUE or FALSE paths.

- **Handles**: 1 input (left), 2 outputs (right: `true` at 40%, `false` at 70%)
- **Custom rendering**: Header bar with purple background, IF label, TRUE/FALSE branch indicators
- **Use cases**: Check order value, validate data, compare fields
- **Example**: "Check Order Value — Total Amount > $100"

### If/Else (`ifelse`)

Similar to Condition but uses THEN/ELSE semantics. Designed for more readable workflow logic.

- **Handles**: 1 input (left), 2 outputs (right: `then` at 40%, `else` at 70%)
- **Custom rendering**: Purple-500 header, THEN (green) / ELSE (red) branch indicators
- **Use cases**: User role check, feature flag evaluation, A/B branching
- **Example**: "If user.role === 'admin' — Then / Else"

### Switch (`switch`)

Routes data to one of multiple outputs based on a value match. Supports up to 3 cases with a default fallback.

- **Handles**: 1 input (left), 3 outputs (right: `case1` at 35%, `case2` at 55%, `default` at 75%)
- **Custom rendering**: Indigo header, CASE 1 / CASE 2 / DEFAULT branch indicators
- **Use cases**: Route by status, dispatch by event type, region-based routing
- **Example**: "Switch on order.region — US / EU / Default"

---

## Data Transformation Nodes

### Filter (`filter`)

Filters items in a data stream based on criteria. Items that don't match are dropped.

- **Handles**: 1 input (left), 1 output (right)
- **Use cases**: Filter form responses by score, remove duplicates, exclude test data
- **Example**: "Filter Responses — Score > 80"

### Transform (`transform`)

Maps, reformats, or transforms data structure between nodes.

- **Handles**: 1 input (left), 1 output (right)
- **Use cases**: Field mapping, data normalization, PDF generation, format conversion
- **Example**: "Format Invoice Data — Map fields"

---

## Flow Control Nodes

### Loop (`loop`)

Iterates over a collection, executing downstream nodes for each item.

- **Handles**: 1 input (left), 1 output (right), 1 loop-back output (bottom)
- **Use cases**: Process each row, iterate API results, batch operations
- **Example**: "For Each Post — Iterate items"

### Delay (`delay`)

Pauses workflow execution for a specified duration before continuing.

- **Handles**: 1 input (left), 1 output (right)
- **Use cases**: Wait before follow-up, rate limiting, staged notifications
- **Example**: "Wait 2 Days — 48h delay"

### Merge (`merge`)

Combines two parallel execution paths back into a single flow.

- **Handles**: 2 inputs (left: `input-1` at 35%, `input-2` at 65%), 1 output (right)
- **Use cases**: Join parallel API calls, combine data from multiple sources
- **Example**: "Merge Results — Combine API responses"

---

## Integration Nodes

### HTTP Request (`http_request`)

Makes an HTTP request (GET, POST, PUT, DELETE) to an external API.

- **Handles**: 1 input (left), 1 output (right)
- **Use cases**: REST API calls, webhook forwarding, data fetching
- **Example**: "Fetch Report Data — GET /api/reports"

---

## Error Handling Nodes

### Error Handler (`error_handler`)

Catches errors from upstream nodes and routes to success or error recovery paths.

- **Handles**: 1 input (left), 2 outputs (right: `success` at 35%, `error` at 65%)
- **Use cases**: Retry logic, fallback notifications, graceful degradation
- **Example**: "Handle Sync Error — Retry 3x, then alert"

---

## UI/UX Notes

### Delete Button

Every node displays a **red × button** on hover in the top-right corner. This provides:
- Visual discoverability (appears on hover with `group-hover:opacity-100`)
- Click handler calls `workflowStore.deleteNode()` and `uiStore.deselectNode()`
- Keyboard delete (Delete/Backspace) still works when a node is selected

### Toolbar

The canvas toolbar is split into:
- **Primary items** (always visible): Webhook, Schedule, Action, Condition, If/Else
- **More dropdown** (click "..." button): Filter, Switch, Loop, Delay, Merge, Transform, HTTP Request, Error Handler

### Status Indicators

Nodes support visual status:
- `default` — Standard border
- `selected` / `configuring` / `testing` — Primary border + ring glow
- `active` — Ready indicator
- `draft` / `paused` / `inactive` — Subdued styles

### Custom Node Rendering

Branching nodes (`condition`, `ifelse`, `switch`) use **custom rendering** with a colored header bar instead of the standard BaseNode layout. This provides better visual distinction for decision points.

---

## Adding New Node Types

To add a new node type:

1. **Add to `NodeType`** in `src/types/workflow.ts`
2. **Add visual config** in `nodeTypeConfig` in `src/constants/theme.ts`
3. **Create component** in `src/components/nodes/BaseNode.tsx` (or new file)
4. **Register** in `nodeTypes` in `src/components/canvas/WorkflowCanvas.tsx`
5. **Add to toolbar** in `src/components/canvas/CanvasToolbar.tsx`
6. **Add type mapping** in `rfTypeMap` in `src/stores/workflowStore.ts`
7. **Optionally** add demo data in `src/data/mockNodes.ts`

Example for a new "Webhook Response" node:

```ts
// 1. types/workflow.ts — add to NodeType union
| "webhook_response"

// 2. constants/theme.ts — add to nodeTypeConfig
webhook_response: {
  icon: "reply",
  label: "WEBHOOK RESPONSE",
  iconBg: "bg-emerald-500/20",
  iconColor: "text-emerald-500",
  labelColor: "text-emerald-500",
},

// 3. BaseNode.tsx — create component
export function WebhookResponseNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-emerald-500!" />
    </BaseNode>
  );
}
```

---

*Last updated: June 2025*

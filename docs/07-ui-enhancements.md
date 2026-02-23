# UI Enhancements

## Node Options Menu (⋮)

Each node now has a three-dot menu (`more_vert` icon) that replaces the previous direct delete button.

### Actions
- **Duplicate** — Creates an identical copy of the node at +50px offset
- **Copy** — Stores the node in the clipboard (paste with Ctrl+V)
- **Delete** — Removes the node and its connected edges (with red highlight)

### Implementation
- `NodeMenu` component in `BaseNode.tsx` handles the dropdown
- Uses `useRef` + `useEffect` with `pointerdown` event listener in **capture phase** (`{ capture: true }`) for reliable click-outside detection inside React Flow's transformed container
- Available on all node variants: BaseNode, ConditionNode, IfElseNode, SwitchNode
- The `pointerdown` event (not `mousedown`) is used because React Flow internally handles pointer events and may stop propagation of mouse events

### Store Methods (`workflowStore.ts`)
- `copyNode(id)` — Deep clones node to `copiedNode` state
- `duplicateNode(id)` — Creates immediate copy at offset position
- `pasteNode(position?)` — Creates node from clipboard at given position

## Connection Drop Popup

Dragging a connection handle to empty canvas space opens a node picker popup.

### Behavior
1. User drags from a node's output handle
2. Releases on empty canvas (not on another node/handle)
3. `NodePickerPopup` appears at drop position
4. User searches/selects a node type
5. New node is created and auto-connected to the source

### Features
- Search input with real-time filtering
- Categorized node list (Triggers, Logic, Data, Flow, Integration)
- Scale-in animation (`animate-scale-in`)
- Click backdrop to close without creating a node

### Implementation
- `onConnectStart` stores the source node/handle info in a ref
- `onConnectEnd` checks if the drop target is empty space (not a `.react-flow__handle` or `.react-flow__node`)
- A `justOpenedPicker` ref flag prevents `onPaneClick` from immediately closing the popup (race condition fix)
- `screenToFlowPosition()` converts screen coordinates to flow coordinates
- `NodePickerPopup.tsx` manages the UI and selection

## Canvas Toolbar — "More Nodes" Dropdown

The top-center toolbar shows primary node types, with a `more_horiz` button that opens additional nodes.

### Click-Outside Behavior
- Uses `useRef` + `useEffect` with `pointerdown` event in **capture phase** (matching the NodeMenu approach)
- Replaced the previous `fixed inset-0` invisible backdrop, which could conflict with React Flow's event system
- Clicking anywhere outside the dropdown reliably closes it

## Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+V` | Paste copied node | Canvas focused |
| `Delete` / `Backspace` | Delete selected node | Node selected (built-in React Flow) |

## Theme Toggle

The header includes a theme toggle button:
- **Dark mode** (default): `dark_mode` icon, dark navy background with light blue accents
- **Light mode**: `light_mode` icon, white background with blue accents

Toggle persists across sessions via `localStorage`.

## Sidebar

### Navigation Items
The sidebar contains only essential navigation:
- **Workflows** (`/`) — Dashboard with workflow overview
- **Settings** (`/settings`) — Account configuration

Previously included **Connections** and **History** sections have been removed for a cleaner navigation.

### Light Mode Background
In light mode, the sidebar uses `--t-bg-deep: #e2e8f0` (Slate-200) for stronger contrast against the main content area (`--t-bg: #f8fafc`).

## Settings Page

A full settings page at `/settings` with four sections:

| Section | Features |
|---------|----------|
| **Profile** | Name, email, avatar, role, timezone |
| **Password & Security** | Current/new password, 2FA toggle |
| **Notifications** | Toggle switches for workflow success/failure, weekly digest, security alerts |
| **API Keys** | List existing keys, generate new keys, delete keys |

Each section uses theme-aware styling with `bg-surface-dark`, `border-border-dark`, and `text-heading`/`text-muted` tokens.

## Workflow Overview Stats

Dashboard stats are now computed from actual workflow data instead of hardcoded placeholders:
- **Total Workflows** — `mockWorkflows.length`
- **Active Workflows** — filtered by `status === "active"` (with live pulse indicator)
- **Draft** — filtered by `status === "draft"`
- **Paused** — filtered by `status === "paused"` (yellow text)

## Animations

| Animation | CSS Class | Used In |
|-----------|-----------|---------|
| Scale in | `animate-scale-in` | NodePickerPopup |
| Slide in right | `animate-slide-in-right` | ConfigSidebar |
| Fade in + slide up | `animate-in fade-in slide-in-from-bottom-2` | Test results |
| Ping | `animate-ping` | Success indicator dot |

# Node Configuration System

## Overview

Every node type in the workflow engine has a three-stage configuration panel:

1. **Setup** — Basic settings (name, description, type-specific fields)
2. **Config** — Data mapping and advanced configuration
3. **Test** — Run test with sample data, view JSON results

The system is driven by `nodeConfigSpecs` — a declarative specification object that defines the fields for each node type at each stage.

## Architecture

### NodeConfigSpec (`constants/nodeConfigs.ts`)

Each node type has a spec with three step definitions:

```ts
interface NodeConfigSpec {
  setup: StepSpec;
  config: StepSpec;
  test: StepSpec;
}

interface StepSpec {
  title: string;
  subtitle: string;
  icon: string;
  fields: FieldSpec[];
  infoBox?: { type: "tip" | "warning" | "info"; text: string };
}
```

### Field Types

| Type | Description | Renders |
|------|-------------|---------|
| `text` | Single-line text input | `<input type="text">` |
| `number` | Numeric input | `<input type="number">` |
| `select` | Dropdown selection | `<select>` with options |
| `textarea` | Multi-line text | `<textarea>` |
| `json` | JSON editor (monospace) | `<textarea>` with mono font |
| `toggle` | Boolean switch | Toggle switch |
| `tags` | Tag/chip input | Chip list with add/remove |

### DynamicField Component (`sidebar/DynamicField.tsx`)

Renders any `FieldSpec` as the appropriate form control. Handles:
- Labels and help text
- Placeholder text
- Options for select fields
- Tag management (add via Enter key, remove via X button)

### Step Components

- **SetupStep** — Renders `spec.setup.fields` + node name input
- **ConfigStep** — Renders `spec.config.fields` + source data indicator
- **TestStep** — Renders `spec.test.fields` + run button + JSON result viewer

### ConfigSidebar

Pulls step titles, subtitles, and icons from `nodeConfigSpecs[nodeType]` dynamically — no hardcoded step labels.

## Supported Node Types (13)

| Node Type | Setup Fields | Config Fields | Test Fields |
|-----------|-------------|--------------|------------|
| `trigger` | Event Source, Event Type | Payload Filter, Headers | Sample Payload |
| `action` | Action Type, Target Service | Parameters, Retry Policy | Test Input |
| `condition` | Field, Operator, Value | Fallback, Case Sensitive | Test Value |
| `filter` | Filter Field, Operator, Value | Sort By, Limit | Test Dataset |
| `ifelse` | Condition Expression | True/False Branch Labels | Test Input |
| `switch` | Switch Field, Case Values | Default Branch, Break | Test Value |
| `loop` | Iteration Source, Limit | Concurrency, Error Handling | Sample Items |
| `delay` | Duration, Unit | Max Wait, Resume Event | — |
| `merge` | Strategy, Sources | Dedup Key, Conflict Resolution | Sample Sources |
| `transform` | Output Format, Template | Field Mapping, Nulls | Sample Input |
| `http_request` | Method, URL, Headers | Body, Auth Type, Timeout | — |
| `error_handler` | Error Types, Retry Count | Delay, Fallback, Notify | Error Payload |
| `schedule` | Cron Expression, Timezone | Start/End Dates, Active Flag | — |

## Adding a New Node Type

1. Add the type to `NodeType` union in `types/workflow.ts`
2. Create the node component in `BaseNode.tsx`
3. Add a config entry to `nodeTypeConfig` in `constants/theme.ts`
4. Add a full `NodeConfigSpec` to `nodeConfigSpecs` in `constants/nodeConfigs.ts`
5. Register the node type in `WorkflowCanvas.tsx` `nodeTypes` map
6. Add to `NodePickerPopup.tsx` node list

## Data Flow

```
User clicks node → ConfigSidebar opens → reads nodeConfigSpecs[nodeType]
  → SetupStep renders spec.setup.fields via DynamicField
  → ConfigStep renders spec.config.fields via DynamicField
  → TestStep renders spec.test.fields + mock test runner
  
Field changes → updateNodeData(nodeId, { config: { ...config, [key]: value } })
  → Persisted in node.data.config
```

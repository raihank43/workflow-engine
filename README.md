# FlowStream — Workflow Builder MVP

A visual workflow automation builder inspired by n8n and Zapier. Built as a React MVP with interactive canvas, draggable nodes, and a 3-step node configuration sidebar.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Canvas | React Flow v12 (`@xyflow/react`) |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 |
| Router | React Router v7 |

## Quick Start

```bash
cd app
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — workflow cards, stats overview |
| `/workflow/:id` | Canvas Editor — drag nodes, connect edges, configure via sidebar |

## Demo Workflows

Click these workflow cards on the dashboard, or navigate directly:

- **E-commerce Fulfillment Flow** → `/workflow/wf-ecommerce-fulfillment`
- **Slack Notification Pipeline** → `/workflow/wf-slack-pipeline`

## Features

- **Interactive Canvas**: Pan, zoom, drag nodes, connect with Bézier edges
- **Custom Nodes**: Trigger, Action, Condition (with TRUE/FALSE branches), Filter
- **3-Step Config Sidebar**: Setup → Config (with tag input) → Test (with JSON viewer)
- **Floating Toolbar**: Add nodes directly to the canvas
- **Dashboard**: Stats cards, workflow grid with status badges
- **Dark Theme**: Consistent design matching Stitch UI mockups

## Documentation

- [Research Notes](docs/01-research-notes.md)
- [Development Plan](docs/02-development-plan.md)
- [Component Conversion Plan](docs/03-component-conversion-plan.md)
- [Development Process Log](docs/04-development-process.md)
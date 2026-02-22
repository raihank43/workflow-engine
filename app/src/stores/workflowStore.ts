import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
} from "@xyflow/react";
import type { WorkflowNode, WorkflowEdge, NodeType } from "@/types/workflow";
import { demoWorkflows } from "@/data/mockNodes";
import { nodeTypeConfig } from "@/constants/theme";

interface WorkflowMeta {
  id: string;
  name: string;
  status: "draft" | "active" | "paused";
  lastSaved: Date;
}

interface WorkflowStore {
  // Workflow metadata
  workflow: WorkflowMeta;

  // React Flow state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];

  // Clipboard
  copiedNode: WorkflowNode | null;

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange<WorkflowEdge>;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: XYPosition) => void;
  deleteNode: (id: string) => void;
  copyNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  pasteNode: (position?: XYPosition) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNode["data"]>) => void;
  loadWorkflow: (id: string) => void;
  updateWorkflowName: (name: string) => void;
}

let nodeIdCounter = 100;

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  workflow: {
    id: "",
    name: "Untitled Workflow",
    status: "draft",
    lastSaved: new Date(),
  },

  nodes: [],
  edges: [],
  copiedNode: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, type: "custom" }, get().edges) }),

  addNode: (type, position) => {
    const id = `node-${++nodeIdCounter}`;
    const config = nodeTypeConfig[type];

    // Map NodeType to React Flow node type (component key)
    const rfTypeMap: Record<string, string> = {
      trigger: "trigger",
      action: "action",
      condition: "condition",
      filter: "filter",
      ifelse: "ifelse",
      switch: "switch",
      loop: "loop",
      delay: "delay",
      merge: "merge",
      transform: "transform",
      http_request: "http_request",
      error_handler: "error_handler",
      schedule: "schedule",
    };

    const newNode: WorkflowNode = {
      id,
      type: rfTypeMap[type] || "action",
      position,
      data: {
        label: `New ${config.label.charAt(0) + config.label.slice(1).toLowerCase()}`,
        nodeType: type,
        icon: config.icon,
        iconBgColor: config.iconBg,
        iconColor: config.iconColor,
        typeLabel: config.label,
        typeLabelColor: config.labelColor,
        status: "draft",
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode: (id) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    }),

  copyNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (node) set({ copiedNode: structuredClone(node) });
  },

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    const newId = `node-${++nodeIdCounter}`;
    const newNode: WorkflowNode = {
      ...structuredClone(node),
      id: newId,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
      data: {
        ...node.data,
        label: `${node.data.label} (copy)`,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  pasteNode: (position) => {
    const copied = get().copiedNode;
    if (!copied) return;
    const newId = `node-${++nodeIdCounter}`;
    const newNode: WorkflowNode = {
      ...structuredClone(copied),
      id: newId,
      position: position || {
        x: copied.position.x + 80,
        y: copied.position.y + 80,
      },
      selected: false,
      data: {
        ...copied.data,
        label: `${copied.data.label} (copy)`,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }),

  loadWorkflow: (id) => {
    const wf = demoWorkflows[id as keyof typeof demoWorkflows];
    const nameMap: Record<string, string> = {
      "wf-ecommerce-fulfillment": "E-commerce Fulfillment Flow",
      "wf-slack-pipeline": "Slack Notification Pipeline",
      "wf-customer-onboarding": "Customer Onboarding",
      "wf-social-auto-post": "Social Auto-Post",
      "wf-invoice-auto-sync": "Invoice Auto-Sync",
      "wf-inventory-alerts": "Inventory Alerts",
      "wf-pdf-report-gen": "PDF Report Gen",
    };
    const statusMap: Record<string, "active" | "draft" | "paused"> = {
      "wf-ecommerce-fulfillment": "active",
      "wf-customer-onboarding": "active",
      "wf-inventory-alerts": "active",
      "wf-invoice-auto-sync": "paused",
    };
    if (wf) {
      set({
        workflow: {
          id,
          name: nameMap[id] || "Untitled Workflow",
          status: statusMap[id] || "draft",
          lastSaved: new Date(),
        },
        nodes: [...wf.nodes],
        edges: [...wf.edges],
      });
    } else {
      set({
        workflow: {
          id,
          name: "Untitled Workflow",
          status: "draft",
          lastSaved: new Date(),
        },
        nodes: [],
        edges: [],
      });
    }
  },

  updateWorkflowName: (name) =>
    set({ workflow: { ...get().workflow, name } }),
}));

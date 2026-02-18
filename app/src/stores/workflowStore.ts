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

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange<WorkflowEdge>;
  onConnect: OnConnect;
  addNode: (type: NodeType, position: XYPosition) => void;
  deleteNode: (id: string) => void;
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
    const newNode: WorkflowNode = {
      id,
      type: type === "condition" ? "condition" : type === "trigger" ? "trigger" : "action",
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

  updateNodeData: (id, data) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }),

  loadWorkflow: (id) => {
    const wf = demoWorkflows[id as keyof typeof demoWorkflows];
    if (wf) {
      set({
        workflow: {
          id,
          name:
            id === "wf-ecommerce-fulfillment"
              ? "E-commerce Fulfillment Flow"
              : "Slack Notification Pipeline",
          status: id === "wf-ecommerce-fulfillment" ? "active" : "draft",
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

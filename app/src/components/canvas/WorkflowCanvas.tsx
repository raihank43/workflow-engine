import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useReactFlow,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import { TriggerNode, ActionNode, ConditionNode, FilterNode, IfElseNode, SwitchNode, LoopNode, DelayNode, MergeNode, TransformNode, HttpRequestNode, ErrorHandlerNode, ScheduleNode } from "@/components/nodes/BaseNode";
import CustomEdge from "@/components/edges/CustomEdge";
import CanvasControls from "./CanvasControls";
import CanvasToolbar from "./CanvasToolbar";
import CanvasLegend from "./CanvasLegend";
import NodePickerPopup from "./NodePickerPopup";
import type { NodeType } from "@/types/workflow";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  filter: FilterNode,
  ifelse: IfElseNode,
  switch: SwitchNode,
  loop: LoopNode,
  delay: DelayNode,
  merge: MergeNode,
  transform: TransformNode,
  http_request: HttpRequestNode,
  error_handler: ErrorHandlerNode,
  schedule: ScheduleNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const addNode = useWorkflowStore((s) => s.addNode);
  const pasteNode = useWorkflowStore((s) => s.pasteNode);
  const selectNode = useUIStore((s) => s.selectNode);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const deselectNode = useUIStore((s) => s.deselectNode);
  const { screenToFlowPosition } = useReactFlow();

  // Connection drop popup state
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number } | null>(null);
  const pendingConnection = useRef<{ source: string; sourceHandle: string | null } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const justOpenedPicker = useRef(false);
  const connectionMade = useRef(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        deleteNode(selectedNodeId);
        deselectNode();
      }
      // Ctrl+V to paste
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        pasteNode();
      }
    },
    [selectedNodeId, deleteNode, deselectNode, pasteNode]
  );

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // If a valid connection was just made, don't show the popup
      if (connectionMade.current) {
        connectionMade.current = false;
        pendingConnection.current = null;
        return;
      }

      // Check if the connection was dropped on an existing node/handle
      const target = event.target as HTMLElement;
      if (target.closest(".react-flow__handle") || target.closest(".react-flow__node")) {
        return;
      }

      // Get the position relative to the canvas wrapper
      const clientPos = "changedTouches" in event
        ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
        : { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY };

      if (wrapperRef.current) {
        const bounds = wrapperRef.current.getBoundingClientRect();
        // Prevent onPaneClick from immediately closing the popup
        justOpenedPicker.current = true;
        setPickerPos({
          x: clientPos.x - bounds.left,
          y: clientPos.y - bounds.top,
        });
        requestAnimationFrame(() => {
          justOpenedPicker.current = false;
        });
      }
    },
    []
  );

  const handlePickerSelect = useCallback(
    (type: NodeType) => {
      if (!pickerPos || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const flowPos = screenToFlowPosition({
        x: pickerPos.x + bounds.left,
        y: pickerPos.y + bounds.top,
      });

      addNode(type, flowPos);

      // Connect from pending source if available
      const pending = pendingConnection.current;
      if (pending) {
        const newNodes = useWorkflowStore.getState().nodes;
        const newNode = newNodes[newNodes.length - 1];
        if (newNode) {
          useWorkflowStore.getState().onConnect({
            source: pending.source,
            target: newNode.id,
            sourceHandle: pending.sourceHandle,
            targetHandle: null,
          });
        }
      }

      setPickerPos(null);
      pendingConnection.current = null;
    },
    [pickerPos, screenToFlowPosition, addNode]
  );

  const activeNodeCount = nodes.filter(
    (n) => n.data.status === "active" || n.data.status === "configuring"
  ).length;

  return (
    <div ref={wrapperRef} className="relative h-full w-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          connectionMade.current = true;
          onConnect(params);
        }}
        onConnectStart={(_, params) => {
          pendingConnection.current = {
            source: params.nodeId || "",
            sourceHandle: params.handleId,
          };
        }}
        onConnectEnd={handleConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => {
          deselectNode();
          if (!justOpenedPicker.current) setPickerPos(null);
        }}
        defaultEdgeOptions={{ type: "custom" }}
        selectionOnDrag
        multiSelectionKeyCode="Shift"
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="canvas-grid"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={1}
          color="var(--t-canvas-dot)"
        />
      </ReactFlow>

      {/* Empty state prompt */}
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto flex flex-col items-center text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <span className="material-icons text-3xl text-primary">bolt</span>
            </div>
            <h2 className="text-xl font-bold text-heading">
              Let's Start Building Your Workflow
            </h2>
            <p className="mt-2 max-w-sm text-sm text-body leading-relaxed">
              Begin by adding a trigger node — it defines the event that kicks off your automation.
            </p>
            <button
              onClick={() => addNode("trigger", { x: 400, y: 250 })}
              className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <span className="material-icons text-lg">add</span>
              Add Trigger
            </button>
          </div>
        </div>
      )}

      <CanvasToolbar />
      <CanvasControls />
      <CanvasLegend nodeCount={nodes.length} activeCount={activeNodeCount} />

      {/* Connection drop popup */}
      {pickerPos && (
        <NodePickerPopup
          position={pickerPos}
          onSelect={handlePickerSelect}
          onClose={() => { setPickerPos(null); pendingConnection.current = null; }}
        />
      )}
    </div>
  );
}

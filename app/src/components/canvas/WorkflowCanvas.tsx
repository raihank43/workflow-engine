import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
  const selectNode = useUIStore((s) => s.selectNode);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const deselectNode = useUIStore((s) => s.deselectNode);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        deleteNode(selectedNodeId);
        deselectNode();
      }
    },
    [selectedNodeId, deleteNode, deselectNode]
  );

  const activeNodeCount = nodes.filter(
    (n) => n.data.status === "active" || n.data.status === "configuring"
  ).length;

  return (
    <div className="relative h-full w-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => deselectNode()}
        defaultEdgeOptions={{ type: "custom" }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="canvas-grid"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={30}
          size={1}
          color="#2d243d"
        />
      </ReactFlow>
      <CanvasToolbar />
      <CanvasControls />
      <CanvasLegend nodeCount={nodes.length} activeCount={activeNodeCount} />
    </div>
  );
}

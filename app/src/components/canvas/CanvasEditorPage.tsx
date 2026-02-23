import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import CanvasHeader from "./CanvasHeader";
import WorkflowCanvas from "./WorkflowCanvas";
import ConfigSidebar from "@/components/sidebar/ConfigSidebar";

export default function CanvasEditorPage() {
  const { id } = useParams<{ id: string }>();
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  useEffect(() => {
    if (id) loadWorkflow(id);
  }, [id, loadWorkflow]);

  return (
    <ReactFlowProvider>
      <div className="flex h-screen flex-col bg-bg-dark">
        <CanvasHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <WorkflowCanvas />
            {sidebarOpen && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20" />
            )}
          </div>
          {sidebarOpen && <ConfigSidebar />}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

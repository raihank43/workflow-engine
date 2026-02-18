import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/components/dashboard/DashboardPage";
import CanvasEditorPage from "@/components/canvas/CanvasEditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
        <Route path="/workflow/:id" element={<CanvasEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

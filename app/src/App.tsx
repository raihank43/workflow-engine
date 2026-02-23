import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/components/dashboard/DashboardPage";
import SettingsPage from "@/components/settings/SettingsPage";
import CanvasEditorPage from "@/components/canvas/CanvasEditorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/workflow/:id" element={<CanvasEditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

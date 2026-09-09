import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Overview } from "@/pages/Overview";
import { SmartLeads } from "@/pages/SmartLeads";
import { ClientDatabase } from "@/pages/ClientDatabase";
import { ClientProfile } from "@/pages/ClientProfile";
import { Messages } from "@/pages/Messages";
import { CalendarPage } from "@/pages/CalendarPage";
import { ListedProperties } from "@/pages/ListedProperties";
import { HelpPage } from "@/pages/HelpPage";
import { NotFound } from "@/pages/NotFound";
import { StaffList } from "@/pages/StaffList";
import { NotesPage } from "@/pages/NotesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/clients" element={<ClientDatabase />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/client-leads" element={<SmartLeads />} />
        <Route path="/client-leads/:slug" element={<SmartLeads />} />
        <Route path="/smart-leads" element={<Navigate to="/client-leads" replace />} />
        <Route path="/listed-properties" element={<ListedProperties />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

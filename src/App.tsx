import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { Overview } from "@/pages/Overview";
import { SmartLeads } from "@/pages/SmartLeads";
import { ClientDatabase } from "@/pages/ClientDatabase";
import { ClientProfile } from "@/pages/ClientProfile";
import { InboxPage } from "@/pages/InboxPage";
import { CalendarPage } from "@/pages/CalendarPage";
import { ListedProperties } from "@/pages/ListedProperties";
import { HelpPage } from "@/pages/HelpPage";
import { NotFound } from "@/pages/NotFound";
import { StaffList } from "@/pages/StaffList";
import { NotesPage } from "@/pages/NotesPage";
import { BrokerLoginPage } from "@/pages/BrokerLoginPage";
import { BrokerOnboardingPage } from "@/pages/BrokerOnboardingPage";
import { BrokerProfilePage } from "@/pages/BrokerProfilePage";
import { BrokerAccountSettingsPage } from "@/pages/BrokerAccountSettingsPage";
import { AdminSectionPage } from "@/pages/AdminSectionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<BrokerLoginPage />} />
      <Route path="/onboarding" element={<BrokerOnboardingPage />} />

      <Route element={<OnboardingGate />}>
        <Route element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/clients" element={<ClientDatabase />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/client-leads" element={<SmartLeads />} />
          <Route path="/client-leads/:slug" element={<SmartLeads />} />
          <Route path="/smart-leads" element={<Navigate to="/client-leads" replace />} />
          <Route path="/listed-properties" element={<ListedProperties />} />
          <Route path="/listed-property" element={<Navigate to="/listed-properties" replace />} />
          <Route path="/staff" element={<StaffList />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/messages" element={<Navigate to="/inbox" replace />} />
          <Route path="/broker/profile" element={<BrokerProfilePage />} />
          <Route path="/broker/settings" element={<BrokerAccountSettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin/:section" element={<AdminSectionPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
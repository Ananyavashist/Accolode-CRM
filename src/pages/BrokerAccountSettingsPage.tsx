import { useNavigate } from "react-router-dom";
import { Logout } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBroker } from "@/store/BrokerContext";

export function BrokerAccountSettingsPage() {
  const { profile, session, logout } = useBroker();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="page max-w-lg">
      <PageHeader
        title="Account settings"
        description="Manage sign in details for your broker account."
      />

      <div className="section-card mt-section space-y-4 p-4">
        <label className="block">
          <span className="text-sm font-medium text-ink-muted">Signed in as</span>
          <p className="mt-1 text-sm font-medium text-ink">{session?.email ?? profile.email}</p>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-muted">Password</span>
          <input
            type="password"
            disabled
            placeholder="Password change (demo)"
            className="input-field mt-1.5 opacity-60"
          />
        </label>
        <button type="button" onClick={handleLogout} className="btn-outline w-full gap-2 text-status-awaiting">
          Log out
          <Logout size={18} />
        </button>
      </div>
    </div>
  );
}
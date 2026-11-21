import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useBroker } from "@/store/BrokerContext";

export function OnboardingGate() {
  const { session, isOnboardingComplete } = useBroker();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
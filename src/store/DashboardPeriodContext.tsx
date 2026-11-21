import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CRM_CURRENT_MONTH, CRM_MONTHS, type CrmMonth } from "@/lib/crmClock";

interface DashboardPeriodContextValue {
  dashboardMonth: CrmMonth;
  setDashboardMonth: (month: CrmMonth) => void;
  monthOptions: readonly CrmMonth[];
}

const DashboardPeriodContext = createContext<DashboardPeriodContextValue | null>(null);

export function DashboardPeriodProvider({ children }: { children: ReactNode }) {
  const [dashboardMonth, setDashboardMonthState] = useState<CrmMonth>(CRM_CURRENT_MONTH);

  const setDashboardMonth = useCallback((month: CrmMonth) => {
    setDashboardMonthState(month);
  }, []);

  const value = useMemo(
    () => ({
      dashboardMonth,
      setDashboardMonth,
      monthOptions: CRM_MONTHS,
    }),
    [dashboardMonth, setDashboardMonth],
  );

  return <DashboardPeriodContext.Provider value={value}>{children}</DashboardPeriodContext.Provider>;
}

export function useDashboardPeriod(): DashboardPeriodContextValue {
  const ctx = useContext(DashboardPeriodContext);
  if (!ctx) throw new Error("useDashboardPeriod must be used within DashboardPeriodProvider");
  return ctx;
}
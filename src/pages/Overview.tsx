import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, TrendingUp } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { ClientCapacityCard } from "@/components/charts/ClientCapacityCard";
import { TopbarLeadingSlot } from "@/components/layout/TopbarSlot";
import { DealPipelineWorkspace } from "@/components/pipeline/DealPipelineWorkspace";
import { useBroker } from "@/store/BrokerContext";
import { useCrm } from "@/store/CrmContext";
import { useDashboardPeriod } from "@/store/DashboardPeriodContext";
import { computeOverviewFunnel } from "@/lib/dashboardMetrics";
import { formatCrmMonthSubtitle } from "@/lib/crmClock";

export function Overview() {
  const navigate = useNavigate();
  const { profile } = useBroker();
  const { leads } = useCrm();
  const { dashboardMonth } = useDashboardPeriod();

  const metrics = useMemo(
    () => computeOverviewFunnel(leads, dashboardMonth),
    [leads, dashboardMonth],
  );

  return (
    <>
      <TopbarLeadingSlot>
        <div className="min-w-0 max-w-full pr-0 sm:pr-2">
          <h1 className="text-balance font-bold text-ink">
            Welcome {profile.fullName || "there"}
          </h1>
          <p className="mt-0.5 max-w-2xl text-sm leading-relaxed text-ink-muted text-pretty">
            An overview of all the details for the broker to synthesis the data
          </p>
        </div>
      </TopbarLeadingSlot>

      <div className="page">
        <div className="leads-banner flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="icon-btn shrink-0 bg-surface text-primary"
              role="img"
              aria-label="Lead growth"
            >
              <TrendingUp size={18} />
            </span>
            <p className="text-sm font-medium text-ink">
              You have <span className="font-semibold">{metrics.newLeads} new leads</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/client-leads?view=pending")}
            className="btn-leads-banner-cta"
          >
            View New Leads <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-section xl:grid-cols-[3fr_2fr] xl:items-start [&>*]:min-w-0">
        <ClientCapacityCard className="order-2 min-w-0 xl:order-1" />
        <div className="order-1 grid w-full grid-cols-1 gap-section sm:grid-cols-2 md:grid-cols-3 xl:order-2 xl:grid-cols-2">
          <StatCard
            title="New Leads"
            value={metrics.newLeads}
            trend="12.6%"
            subtitle={`compared to last month · ${dashboardMonth}`}
          />
          <StatCard
            title="Qualified Leads"
            value={metrics.qualified}
            trend="6.6%"
            subtitle={`compared to last month · ${dashboardMonth}`}
          />
          <StatCard
            title="Scheduled Visits"
            value={metrics.scheduled}
            trend="6.6%"
            subtitle={formatCrmMonthSubtitle(dashboardMonth)}
          />
          <StatCard
            title="Negotiation stage"
            value={metrics.negotiation}
            trend="2.6%"
            trendDirection="down"
            subtitle={formatCrmMonthSubtitle(dashboardMonth)}
          />
          <StatCard
            title="Clients not responding"
            value={metrics.notResponding}
            trend="1.8%"
            trendDirection="down"
            subtitle={`of ${metrics.qualified} qualified leads`}
          />
          <StatCard
            title="Rejected leads"
            value={metrics.rejected}
            subtitle="declined before accept (capacity or fit)"
          />
        </div>
      </div>

        <DealPipelineWorkspace />
      </div>
    </>
  );
}

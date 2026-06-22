import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Download, Plus } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { DonutMetricCard } from "@/components/charts/DonutMetricCard";
import { LeadAcquisitionChart } from "@/components/charts/LeadAcquisitionChart";
import { PropertiesBarChart } from "@/components/charts/PropertiesBarChart";
import { ACQUISITION_SERIES, ChartLegend, PROPERTIES_SERIES } from "@/components/charts/ChartLegend";
import { PeriodDropdown } from "@/components/ui/PeriodDropdown";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { filterAcquisitionByPeriod, filterPropertiesByPeriod } from "@/data/charts";
import {
  computeClientInProgress,
  computeNegotiation,
  computeNewLeads,
  computePlatformLeads,
  computeQualified,
  computeScheduledVisits,
} from "@/lib/dashboardMetrics";

const ACQUISITION_PERIODS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Month"] as const;
const PROPERTIES_PERIODS = ["Last 3 Months", "Last 6 Months", "Last 12 Months"] as const;

export function Overview() {
  const navigate = useNavigate();
  const { leads, clients } = useCrm();
  const { openAddClient } = useUi();
  const [acquisitionPeriod, setAcquisitionPeriod] = useState<string>("Last 30 Days");
  const [propertiesPeriod, setPropertiesPeriod] = useState<string>("Last 6 Months");
  const [platformPeriod, setPlatformPeriod] = useState<string>("Last 30 Days");
  const [progressPeriod, setProgressPeriod] = useState<string>("Last 30 Days");

  const acquisitionData = useMemo(
    () => filterAcquisitionByPeriod(acquisitionPeriod),
    [acquisitionPeriod],
  );
  const propertiesData = useMemo(
    () => filterPropertiesByPeriod(propertiesPeriod),
    [propertiesPeriod],
  );

  const metrics = useMemo(() => {
    const platform = computePlatformLeads(leads);
    const inProgress = computeClientInProgress(clients);

    return {
      newLeads: computeNewLeads(leads),
      qualified: computeQualified(leads, clients),
      scheduled: computeScheduledVisits(clients),
      negotiation: computeNegotiation(clients),
      platform,
      inProgress,
    };
  }, [leads, clients]);

  return (
    <div className="space-y-section p-section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Welcome Rakesh Verma</h1>
          <p className="mt-1 text-ink-muted">
            An overview of all the details for the broker to synthesis the data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline">
            Export <Download size={16} />
          </button>
          <button onClick={openAddClient} className="btn-primary">
            Add Client <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="section-card flex flex-col gap-3 bg-sidebar p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <ArrowUpRight size={18} />
          </span>
          <p className="font-medium text-ink">
            You have <span className="font-semibold">{metrics.newLeads} new leads</span>
          </p>
        </div>
        <button onClick={() => navigate("/client-leads")} className="btn-outline">
          View New Leads <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="New Leads"
          value={metrics.newLeads}
          trend="12.6%"
          subtitle="compared to last month"
        />
        <StatCard
          title="Qualified Leads"
          value={metrics.qualified}
          trend="6.6%"
          subtitle="compared to last month"
        />
        <StatCard
          title="Scheduled Visits"
          value={metrics.scheduled}
          trend="6.6%"
          subtitle="for the month of June"
        />
        <StatCard
          title="Negotiation stage"
          value={metrics.negotiation}
          trend="2.6%"
          trendDirection="down"
          subtitle="for the month of June"
        />
      </div>

      <div className="grid grid-cols-1 gap-section lg:grid-cols-4 lg:items-stretch">
        <div className="section-card flex flex-col p-4 lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink">Lead Acquisition through Sources</h2>
              <p className="text-sm text-ink-muted">
                Total leads generated this month from different sources
              </p>
            </div>
            <PeriodDropdown
              value={acquisitionPeriod}
              options={[...ACQUISITION_PERIODS]}
              onChange={setAcquisitionPeriod}
            />
          </div>
          <div className="mt-2 min-h-[240px] flex-1">
            <LeadAcquisitionChart data={acquisitionData} />
          </div>
          <ChartLegend items={ACQUISITION_SERIES.map((s) => ({ label: s.label, color: s.color }))} />
        </div>

        <DonutMetricCard
          className="lg:col-span-1"
          title="Property platform Leads"
          data={metrics.platform.slices}
          total={metrics.platform.total}
          unit="leads"
          period={platformPeriod}
          onPeriodChange={setPlatformPeriod}
        />
        <DonutMetricCard
          className="lg:col-span-1"
          title="Client in progress"
          data={metrics.inProgress.slices}
          total={metrics.inProgress.total}
          emptyLabel="No clients in progress"
          period={progressPeriod}
          onPeriodChange={setProgressPeriod}
          variant="semicircle"
        />
      </div>

      <div className="section-card flex flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">Properties Overview</h2>
          <PeriodDropdown
            value={propertiesPeriod}
            options={[...PROPERTIES_PERIODS]}
            onChange={setPropertiesPeriod}
          />
        </div>
        <div className="mt-3">
          <PropertiesBarChart data={propertiesData} />
        </div>
        <ChartLegend
          items={PROPERTIES_SERIES.map((s) => ({ label: s.label, color: s.color }))}
          className="mt-1"
        />
      </div>
    </div>
  );
}

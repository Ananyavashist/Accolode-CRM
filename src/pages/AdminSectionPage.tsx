import { useParams, Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";

const TITLES: Record<string, string> = {
  analytics: "Analytics",
  report: "Report",
  templates: "Templates",
};

export function AdminSectionPage() {
  const { section } = useParams();
  const key = section?.toLowerCase() ?? "";
  const title = TITLES[key];

  if (!title) return <Navigate to="/admin/analytics" replace />;

  return (
    <div className="page">
      <PageHeader
        title={title}
        description="Administration tools for your brokerage workspace."
      />
      <div className="section-card p-8 text-center text-sm text-ink-muted">
        {title} will be available here in a future release.
      </div>
    </div>
  );
}
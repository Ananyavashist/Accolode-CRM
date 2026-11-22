import { useNavigate } from "react-router-dom";
import { ChevronRight } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="Page not found"
      description="That route is not in Accolade. Go back to the dashboard or open Notes."
      action={
        <button onClick={() => navigate("/")} className="btn-primary gap-1.5">
          Go to Home
          <ChevronRight size={16} />
        </button>
      }
    />
  );
}

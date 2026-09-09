import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="Page not found"
      description="That route is not in Accolode. Go back to the dashboard or open Notes."
      action={
        <button onClick={() => navigate("/")} className="btn-primary">
          Go to Dashboard
        </button>
      }
    />
  );
}

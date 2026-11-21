import type { LeadRejectionReason } from "@/types";
import { LEAD_REJECTION_LABELS } from "@/lib/brokerRouting";
import { cn } from "@/lib/utils";

const REASONS = Object.entries(LEAD_REJECTION_LABELS) as [LeadRejectionReason, string][];

interface LeadRejectModalProps {
  open: boolean;
  leadName?: string;
  onClose: () => void;
  onConfirm: (reason: LeadRejectionReason) => void;
}

export function LeadRejectModal({ open, leadName, onClose, onConfirm }: LeadRejectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl border border-hairline bg-surface p-5 shadow-pop"
        role="dialog"
        aria-labelledby="reject-lead-title"
      >
        <h2 id="reject-lead-title" className="text-base font-semibold text-ink">
          Reject lead{leadName ? `: ${leadName}` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Pick a reason. The client will not see this—routing continues on Shift Hona.
        </p>
        <ul className="mt-4 space-y-1">
          {REASONS.map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onConfirm(id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-sidebar text-ink",
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onClose} className="btn-outline mt-4 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}
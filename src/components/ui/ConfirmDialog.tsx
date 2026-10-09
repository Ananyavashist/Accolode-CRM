import { useCallback, useState, type ReactNode } from "react";

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface ConfirmDialogProps {
  request: ConfirmRequest | null;
  onClose: () => void;
}

export function ConfirmDialog({ request, onClose }: ConfirmDialogProps) {
  if (!request) return null;

  const handleConfirm = () => {
    request.onConfirm();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="fixed left-1/2 top-1/2 z-[70] w-[min(400px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline bg-surface p-5 shadow-pop"
      >
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-ink">
          {request.title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm text-ink-muted">
          {request.message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline">
            {request.cancelLabel ?? "Cancel"}
          </button>
          <button type="button" onClick={handleConfirm} className="btn-primary">
            {request.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}

export function useConfirmAction() {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const askConfirm = useCallback((next: ConfirmRequest) => setRequest(next), []);
  const closeConfirm = useCallback(() => setRequest(null), []);
  return { confirmRequest: request, askConfirm, closeConfirm };
}

export function ConfirmDialogHost({
  request,
  onClose,
  children,
}: {
  request: ConfirmRequest | null;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      <ConfirmDialog request={request} onClose={onClose} />
    </>
  );
}

import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** Hover/focus label for icon-only controls when the sidebar is collapsed on desktop. */
export function SidebarIconTooltip({
  label,
  show,
  children,
  className,
}: {
  label: string;
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const reveal = () => {
    if (!show) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: r.right + 10, y: r.top + r.height / 2 });
    setHover(true);
  };

  return (
    <>
      <div
        ref={ref}
        className={cn("relative", className)}
        onMouseEnter={reveal}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={reveal}
        onBlurCapture={() => setHover(false)}
      >
        {children}
      </div>
      {show &&
        hover &&
        createPortal(
          <span
            role="tooltip"
            className={cn(
              "pointer-events-none fixed z-[100] -translate-y-1/2 whitespace-nowrap",
              "rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-xs font-medium text-ink shadow-pop",
            )}
            style={{ left: pos.x, top: pos.y }}
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  );
}
import { useRef, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

export function SidebarNavLink({
  to,
  label,
  icon: Icon,
  desktopCollapsed,
  className,
  navLabelClass,
  onClick,
  end,
}: {
  to: string;
  label: string;
  icon: IconComponent;
  desktopCollapsed: boolean;
  className: ComponentProps<typeof NavLink>["className"];
  navLabelClass: string;
  onClick?: () => void;
  end?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement>(null);

  const showTooltip = () => {
    if (!desktopCollapsed) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: r.right + 10, y: r.top + r.height / 2 });
    setHover(true);
  };

  const hideTooltip = () => setHover(false);

  return (
    <>
      <NavLink
        ref={ref}
        to={to}
        end={end}
        onClick={onClick}
        className={className}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-label={desktopCollapsed ? label : undefined}
      >
        <Icon size={18} className="shrink-0" />
        <span className={navLabelClass}>{label}</span>
      </NavLink>
      {desktopCollapsed &&
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
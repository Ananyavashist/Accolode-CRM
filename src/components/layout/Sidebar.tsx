import {
  Building2,
  Calendar,
  ChevronLeft,
  HelpCircle,
  LayoutGrid,
  DirectInboxIcon,
  FileText,
  Notes,
  TrendingUp,
  Users,
} from "@/components/ui/icons";
import { SidebarNavLink } from "@/components/layout/SidebarNavLink";
import { SidebarIconTooltip } from "@/components/layout/SidebarIconTooltip";
import { SidebarProfile } from "@/components/layout/SidebarProfile";
import { FirstStepsWidget } from "@/components/layout/FirstSteps";
import { SidebarUpgradeCard } from "@/components/layout/SidebarUpgradeCard";
import { useCrm } from "@/store/CrmContext";
import { AccoladeLogo } from "@/components/ui/AccoladeLogo";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS_PRIMARY = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/clients", label: "Database", icon: Users, end: true },
  { to: "/client-leads", label: "Leads", icon: TrendingUp },
] as const;

const NAV_ITEMS_SECONDARY = [
  { to: "/listed-properties", label: "Properties", icon: Building2 },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/inbox", label: "Inbox", icon: DirectInboxIcon },
] as const;

const ADMIN_NAV_ITEMS = [
  { to: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { to: "/admin/report", label: "Report", icon: Notes },
  { to: "/admin/templates", label: "Templates", icon: FileText },
] as const;

const SIDEBAR_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const SIDEBAR_MS = "duration-300";

function sidebarCollapsedOnDesktop(collapsed: boolean, mobileOpen: boolean) {
  return collapsed && !mobileOpen;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }: SidebarProps) {
  const { firstSteps } = useCrm();
  const desktopCollapsed = sidebarCollapsedOnDesktop(collapsed, mobileOpen);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group box-border flex h-10 w-full items-center gap-3 overflow-hidden rounded-lg border px-3 text-sm",
      `transition-[width,gap,padding,border-color,background-color,color,transform] ${SIDEBAR_MS} ease-in-out`,
      isActive
        ? "border-hairline bg-surface font-semibold text-ink"
        : "border-transparent font-medium text-ink-muted hover:border-hairline hover:bg-surface hover:text-ink",
      desktopCollapsed && "lg:mx-auto lg:w-10 lg:justify-center lg:gap-0 lg:px-0",
    );

  const navLabelClass = cn(
    "min-w-0 overflow-hidden whitespace-nowrap",
    `transition-[max-width,opacity,margin] ${SIDEBAR_MS} ease-in-out`,
    desktopCollapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-[11rem] opacity-100",
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar",
          `transition-[width,transform] ${SIDEBAR_MS} ease-in-out`,
          "border-r border-hairline lg:static lg:translate-x-0",
          collapsed ? "lg:w-[78px]" : "lg:w-[244px]",
          "w-[244px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ transitionTimingFunction: SIDEBAR_EASE }}
      >
        <div
          className={cn(
            "relative flex h-16 items-center overflow-hidden px-4",
            `transition-[padding] ${SIDEBAR_MS} ease-in-out`,
            desktopCollapsed ? "lg:justify-center lg:px-2" : "justify-between",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-center gap-2 overflow-hidden",
              `transition-[max-width,opacity] ${SIDEBAR_MS} ease-in-out`,
              desktopCollapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-[12rem] opacity-100",
            )}
          >
            <AccoladeLogo size={32} />
            <span className="truncate text-lg font-semibold text-ink">Accolade</span>
          </div>
          <SidebarIconTooltip
            show={desktopCollapsed}
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              desktopCollapsed && "lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
            )}
          >
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "icon-btn hidden shrink-0 lg:flex lg:items-center lg:justify-center",
                `transition-transform ${SIDEBAR_MS} ease-in-out`,
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                size={18}
                className={cn(
                  `transition-transform ${SIDEBAR_MS} ease-in-out`,
                  collapsed && "rotate-180",
                )}
              />
            </button>
          </SidebarIconTooltip>
        </div>

        <nav
          aria-label="Primary"
          className={cn(
            "flex flex-1 flex-col gap-0.5 overflow-y-auto py-2",
            `px-3 transition-[padding] ${SIDEBAR_MS} ease-in-out`,
            desktopCollapsed && "lg:px-2",
          )}
        >
          {NAV_ITEMS_PRIMARY.map((item) => (
            <SidebarNavLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              end={"end" in item ? item.end : undefined}
              onClick={onCloseMobile}
              desktopCollapsed={desktopCollapsed}
              className={navClass}
              navLabelClass={navLabelClass}
            />
          ))}

          {NAV_ITEMS_SECONDARY.map((item) => (
            <SidebarNavLink
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={onCloseMobile}
              desktopCollapsed={desktopCollapsed}
              className={navClass}
              navLabelClass={navLabelClass}
            />
          ))}

          <div className={cn("mt-3", collapsed && "lg:mt-2")}>
            <p
              className={cn(
                "mb-1 overflow-hidden px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft",
                `transition-[max-height,opacity,margin] ${SIDEBAR_MS} ease-in-out`,
                desktopCollapsed ? "lg:mb-0 lg:max-h-0 lg:opacity-0" : "max-h-8 opacity-100",
              )}
            >
              Administration
            </p>
            {ADMIN_NAV_ITEMS.map((item) => (
              <SidebarNavLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                onClick={onCloseMobile}
                desktopCollapsed={desktopCollapsed}
                className={navClass}
                navLabelClass={navLabelClass}
              />
            ))}
          </div>
        </nav>

        <div
          className={cn(
            "shrink-0 space-y-2 pb-2",
            `px-3 transition-[padding] ${SIDEBAR_MS} ease-in-out`,
            desktopCollapsed && "lg:px-2",
          )}
        >
          <SidebarUpgradeCard collapsed={collapsed} showTooltips={desktopCollapsed} />
          <SidebarNavLink
            to="/help"
            label="Help & Support"
            icon={HelpCircle}
            onClick={onCloseMobile}
            desktopCollapsed={desktopCollapsed}
            className={navClass}
            navLabelClass={navLabelClass}
          />
        </div>

        <FirstStepsWidget steps={firstSteps} collapsed={collapsed} showTooltips={desktopCollapsed} />
        <SidebarProfile collapsed={collapsed} showTooltips={desktopCollapsed} />
      </aside>
    </>
  );
}
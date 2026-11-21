import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, DataImport, Menu, Plus, Search, Share2 } from "@/components/ui/icons";
import { SEED_NOTIFICATIONS } from "@/data/notifications";
import { PillDropdown } from "@/components/ui/PillDropdown";
import { useBroker } from "@/store/BrokerContext";
import { useDashboardPeriod } from "@/store/DashboardPeriodContext";
import { useUi } from "@/store/UiContext";
import type { CrmMonth } from "@/lib/crmClock";
import { cn, formatDisplayCopy } from "@/lib/utils";
import { useTopbarLeading } from "./TopbarSlot";

interface TopbarProps {
  onOpenMobile: () => void;
}

function GlobalSearch({ className }: { className?: string }) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <label htmlFor="global-search" className="sr-only">
        Search
      </label>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        id="global-search"
        type="search"
        placeholder="Search clients, leads, properties"
        className="input-field h-9 w-full bg-sidebar pl-9"
      />
    </div>
  );
}

export function Topbar({ onOpenMobile }: TopbarProps) {
  const { pathname } = useLocation();
  const isOverviewHome = pathname === "/";
  const leading = useTopbarLeading();
  const { dashboardMonth, setDashboardMonth, monthOptions } = useDashboardPeriod();
  const { profile } = useBroker();
  const { openAddClient } = useUi();
  const [shareCopied, setShareCopied] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifClick = () => {
    setNotifOpen((v) => !v);
    if (!notifOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const shareReferralLink = async () => {
    if (!profile.referralLink) return;
    try {
      await navigator.clipboard.writeText(profile.referralLink);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const toolbarActions = (
    <>
      {isOverviewHome && (
        <PillDropdown
          value={dashboardMonth}
          options={[...monthOptions]}
          onChange={(value) => setDashboardMonth(value as CrmMonth)}
          ariaLabel="Dashboard month"
          className="h-9 shrink-0 gap-1.5 border border-hairline bg-sidebar px-3 text-sm font-medium text-ink"
        />
      )}
      <button
        type="button"
        onClick={shareReferralLink}
        disabled={!profile.referralLink}
        className="btn-secondary !w-auto shrink-0 gap-1.5 disabled:opacity-50"
      >
        <Share2 size={16} />
        {shareCopied ? "Link copied" : "Share my link"}
      </button>
      <button
        type="button"
        onClick={openAddClient}
        className="btn-primary !w-auto shrink-0 gap-1.5"
      >
        Add Client <Plus size={16} />
      </button>
      <span className="relative inline-flex shrink-0">
        <button type="button" className="icon-btn peer" aria-label="Import">
          <DataImport size={18} />
        </button>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-hairline bg-surface px-2 py-1 text-xs font-medium text-ink shadow-pop peer-hover:block peer-focus-visible:block"
        >
          Import
        </span>
      </span>

      <div ref={notifRef} className="relative">
        <button
          type="button"
          onClick={handleNotifClick}
          className={cn(
            "icon-btn relative",
            notifOpen && "border-primary/30 bg-primary/5 text-primary",
          )}
          aria-label="Notifications"
          aria-expanded={notifOpen}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-status-awaiting" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-[10px] border border-hairline bg-surface shadow-pop sm:w-96">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notifications</p>
              <span className="text-xs text-ink-soft">{notifications.length} total</span>
            </div>
            <ul className="max-h-80 overflow-y-auto py-1">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-sidebar",
                      n.unread && "bg-primary/[0.03]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{formatDisplayCopy(n.title)}</span>
                      <span className="shrink-0 text-xs text-ink-soft">{n.time}</span>
                    </div>
                    <p className="text-xs text-ink-muted">{formatDisplayCopy(n.body)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );

  if (isOverviewHome) {
    return (
      <header className="relative z-30 flex flex-col gap-3 border-b border-hairline bg-surface px-4 py-3 xl:flex-row xl:items-center xl:gap-4 xl:px-5 xl:py-2">
        <div className="flex min-w-0 w-full flex-1 items-start gap-3 xl:items-center">
          <button
            onClick={onOpenMobile}
            className="icon-btn mt-0.5 shrink-0 lg:mt-0 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">{leading}</div>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 pl-11 lg:pl-0 xl:w-auto xl:shrink-0 xl:flex-nowrap xl:justify-end xl:gap-3">
          <GlobalSearch className="w-full flex-1 xl:w-60 xl:max-w-none xl:flex-none" />
          {toolbarActions}
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-30 flex flex-col gap-3 border-b border-hairline bg-surface px-4 py-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4 xl:px-5 xl:py-2">
      <div className="flex min-w-0 w-full flex-1 items-center gap-3 xl:max-w-xl">
        <button
          onClick={onOpenMobile}
          className="icon-btn shrink-0 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <GlobalSearch className="min-w-0 flex-1" />
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 pl-11 lg:pl-0 xl:w-auto xl:shrink-0 xl:flex-nowrap xl:justify-end xl:gap-3">
        {toolbarActions}
      </div>
    </header>
  );
}
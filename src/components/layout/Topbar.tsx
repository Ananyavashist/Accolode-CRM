import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, Settings } from "@/components/ui/icons";
import { SEED_NOTIFICATIONS } from "@/data/notifications";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onOpenMobile: () => void;
}

export function Topbar({ onOpenMobile }: TopbarProps) {
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

  return (
    <header className="relative z-30 flex h-16 items-center gap-3 border-b border-hairline bg-surface px-4 sm:px-5">
      <button
        onClick={onOpenMobile}
        className="icon-btn lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      <div className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="text"
          placeholder="Search"
          className="h-10 w-full rounded-[10px] border border-hairline bg-sidebar pl-9 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-primary/40 focus:bg-surface"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button className="icon-btn" aria-label="Settings">
          <Settings size={18} />
        </button>

        <div ref={notifRef} className="relative">
          <button
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
                        <span className="text-sm font-medium text-ink">{n.title}</span>
                        <span className="shrink-0 text-xs text-ink-soft">{n.time}</span>
                      </div>
                      <p className="text-xs text-ink-muted">{n.body}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

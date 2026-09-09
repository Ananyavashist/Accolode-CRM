import { useEffect, useRef, useState } from "react";
import { Logout, MapPin, Settings, UnfoldMore } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { AVATAR_IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export function ProfilePopup({ open, onClose, collapsed }: ProfilePopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 lg:bg-transparent" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        className={cn(
          "fixed z-50 w-[220px] rounded-[10px] border border-hairline bg-surface p-2 shadow-pop",
          collapsed ? "bottom-20 left-[88px]" : "bottom-20 left-3 lg:left-[12px]",
        )}
        role="menu"
      >
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-sidebar"
          role="menuitem"
        >
          <Settings size={18} />
          Account Settings
        </button>
        <div className="my-1 border-t border-hairline" />
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-status-awaiting transition-colors hover:bg-status-awaitingBg"
          role="menuitem"
        >
          <Logout size={18} />
          Logout
        </button>
        <div className="mt-2 flex items-center gap-2 border-t border-hairline px-3 py-2.5">
          <MapPin size={14} className="shrink-0 text-ink-soft" />
          <span className="text-xs text-ink-muted">Connaught Place, New Delhi</span>
        </div>
      </div>
    </>
  );
}

interface SidebarProfileProps {
  collapsed: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="border-t border-hairline px-3 pb-5 pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-hairline",
            collapsed && "lg:justify-center lg:px-0",
          )}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <Avatar name="Rakesh Verma" src={AVATAR_IMAGES[0]} size={32} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-ink">
                Rakesh Verma
              </span>
              <UnfoldMore size={16} className="shrink-0 text-ink-soft" />
            </>
          )}
        </button>
      </div>
      <ProfilePopup open={open} onClose={() => setOpen(false)} collapsed={collapsed} />
    </>
  );
}

import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "@/components/ui/icons";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { TopbarSlotProvider } from "./TopbarSlot";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { cn } from "@/lib/utils";

const ROUTES_WITHOUT_TOPBAR = ["/broker/profile"];

export function AppLayout() {
  const { pathname } = useLocation();
  const hideTopbar = ROUTES_WITHOUT_TOPBAR.includes(pathname);
  const isInbox = pathname === "/inbox";
  const isLeadManagement =
    pathname === "/client-leads" || pathname.startsWith("/client-leads/");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarSlotProvider>
          {hideTopbar ? (
            <header className="relative z-30 border-b border-hairline bg-surface px-4 py-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="icon-btn"
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>
            </header>
          ) : (
            <Topbar onOpenMobile={() => setMobileOpen(true)} />
          )}
          <main
            id="main"
            className={cn(
              "flex min-h-0 flex-1 flex-col",
              isInbox || isLeadManagement ? "overflow-hidden" : "overflow-y-auto",
            )}
          >
            <Outlet />
          </main>
        </TopbarSlotProvider>
      </div>

      <AddClientModal />
    </div>
  );
}

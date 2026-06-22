import { useEffect, useId, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  Navigation,
  Sparkles,
  UserCircle,
  Users,
} from "@/components/ui/icons";
import { Profile2User } from "iconsax-reactjs";
import { SidebarProfile } from "@/components/layout/SidebarProfile";
import { useCrm } from "@/store/CrmContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function StaffIcon({ size = 18, className }: { size?: number; className?: string }) {
  return <Profile2User size={size} variant="Linear" className={className} color="currentColor" />;
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/clients", label: "Client Database", icon: Users },
  { to: "/client-leads", label: "Client Leads", icon: Sparkles },
  { to: "/listed-properties", label: "Listed Properties", icon: Building2 },
  { to: "/staff", label: "Staff List", icon: StaffIcon },
  { to: "/calendar", label: "Calender", icon: Calendar },
  { to: "/messages", label: "Messages", icon: MessageSquare },
] as const;

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }: SidebarProps) {
  const { clients } = useCrm();
  const location = useLocation();
  const navigate = useNavigate();
  const [profilesOpen, setProfilesOpen] = useState(false);
  const listId = useId();

  const isProfileRoute = location.pathname.startsWith("/clients/");
  const firstClientId = clients[0]?.id;

  useEffect(() => {
    if (isProfileRoute) setProfilesOpen(true);
  }, [isProfileRoute]);

  const profileClients = useMemo(() => clients.slice(0, 8), [clients]);

  const goToFirstProfile = () => {
    if (firstClientId) {
      navigate(`/clients/${firstClientId}`);
      onCloseMobile();
    }
  };

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
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar transition-[width,transform] duration-200 ease-in-out",
          "border-r border-hairline lg:static lg:translate-x-0",
          collapsed ? "lg:w-[78px]" : "lg:w-[244px]",
          "w-[244px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn("flex items-center gap-2 overflow-hidden", collapsed && "lg:w-0")}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
              <Navigation size={16} className="text-primary" />
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-base font-bold text-primary",
                collapsed && "lg:hidden",
              )}
            >
              Accolode
            </span>
          </div>
          <button
            onClick={onToggle}
            className="hidden h-7 w-7 items-center justify-center rounded-full border border-hairline bg-surface text-ink-muted transition-colors hover:bg-hairline lg:flex"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={16}
              className={cn("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : undefined}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-card"
                    : "text-ink-muted hover:bg-hairline hover:text-ink",
                  collapsed && "lg:justify-center lg:px-0",
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>
                {item.label}
              </span>
            </NavLink>
          ))}

          {!collapsed ? (
            <div className="mt-1">
              <div
                className={cn(
                  "flex items-center rounded-xl transition-colors",
                  isProfileRoute ? "bg-primary/5" : "hover:bg-hairline",
                )}
              >
                <button
                  type="button"
                  onClick={goToFirstProfile}
                  className={cn(
                    "flex flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    isProfileRoute ? "text-primary" : "text-ink-muted hover:text-ink",
                  )}
                  aria-expanded={profilesOpen}
                  aria-controls={listId}
                >
                  <UserCircle size={18} className="shrink-0" />
                  <span className="whitespace-nowrap">Client Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfilesOpen((v) => !v)}
                  className={cn(
                    "mr-2 flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    isProfileRoute
                      ? "text-primary hover:bg-primary/10"
                      : "text-ink-soft hover:bg-hairline hover:text-ink",
                  )}
                  aria-label={profilesOpen ? "Collapse client profiles" : "Expand client profiles"}
                  aria-expanded={profilesOpen}
                  aria-controls={listId}
                >
                  <ChevronDown
                    size={16}
                    className={cn("transition-transform", profilesOpen && "rotate-180")}
                  />
                </button>
              </div>

              {profilesOpen && profileClients.length > 0 && (
                <ul
                  id={listId}
                  role="list"
                  className="relative ml-5 mt-1 space-y-0.5 border-l border-hairline pl-3"
                >
                  {profileClients.map((client) => (
                    <li key={client.id}>
                      <NavLink
                        to={`/clients/${client.id}`}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-lg px-2.5 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary/5 font-medium text-primary"
                              : "text-ink-muted hover:bg-hairline hover:text-ink",
                          )
                        }
                      >
                        {client.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={goToFirstProfile}
              className={cn(
                "mt-1 flex w-full items-center justify-center rounded-xl px-0 py-2.5 transition-colors lg:justify-center",
                isProfileRoute
                  ? "bg-primary/5 text-primary"
                  : "text-ink-muted hover:bg-hairline hover:text-ink",
              )}
              title="Client Profile"
              aria-label="Open first client profile"
            >
              <UserCircle size={18} />
            </button>
          )}
        </nav>

        <div className="px-3">
          <NavLink
            to="/help"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-white" : "text-ink-muted hover:bg-hairline hover:text-ink",
                collapsed && "lg:justify-center lg:px-0",
              )
            }
            title={collapsed ? "Help & Support" : undefined}
          >
            <HelpCircle size={18} className="shrink-0" />
            <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>Help & Support</span>
          </NavLink>
        </div>

        <SidebarProfile collapsed={collapsed} />
      </aside>
    </>
  );
}

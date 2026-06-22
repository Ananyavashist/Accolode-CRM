import { useMemo, useState } from "react";
import { Plus, Search } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";

const STAFF = [
  { id: "s1", name: "Priya Nair", role: "Senior Broker", phone: "+91 98110 11220", activeClients: 18, location: "Connaught Place" },
  { id: "s2", name: "Arjun Mehta", role: "Sales Associate", phone: "+91 98110 22331", activeClients: 12, location: "South Delhi" },
  { id: "s3", name: "Neha Kapoor", role: "Leasing Executive", phone: "+91 98110 33442", activeClients: 15, location: "Gurgaon" },
  { id: "s4", name: "Vikram Singh", role: "Field Agent", phone: "+91 98110 44553", activeClients: 9, location: "Noida" },
  { id: "s5", name: "Divya Iyer", role: "Client Relations", phone: "+91 98110 55664", activeClients: 14, location: "Mumbai" },
  { id: "s6", name: "Karan Joshi", role: "Property Analyst", phone: "+91 98110 66775", activeClients: 11, location: "Bengaluru" },
  { id: "s7", name: "Sneha Reddy", role: "Junior Broker", phone: "+91 98110 77886", activeClients: 7, location: "Hyderabad" },
  { id: "s8", name: "Manish Tiwari", role: "Operations Lead", phone: "+91 98110 88997", activeClients: 6, location: "Pune" },
];

export function StaffList() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return STAFF.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-section p-section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Staff List</h1>
          <p className="mt-1 text-ink-muted">Manage brokers and field agents on your team</p>
        </div>
        <button className="btn-primary">
          Add Staff <Plus size={16} />
        </button>
      </div>

      <div className="section-card p-4">
        <label className="relative mb-4 block max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search staff by name, role, or location"
            className="h-10 w-full rounded-[10px] border border-hairline bg-sidebar pl-9 pr-3 text-sm text-ink outline-none focus:border-primary/30 focus:bg-surface"
          />
        </label>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs text-ink-soft">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Phone</th>
                <th className="pb-3 pr-4 font-medium">Location</th>
                <th className="pb-3 font-medium">Active Clients</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((member) => (
                <tr key={member.id} className="border-b border-hairline last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={member.name} size={32} />
                      <span className="font-medium text-ink">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{member.role}</td>
                  <td className="py-3 pr-4 text-ink-muted">{member.phone}</td>
                  <td className="py-3 pr-4 text-ink-muted">{member.location}</td>
                  <td className="py-3 font-semibold text-ink">{member.activeClients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-muted">No staff match your search.</p>
        )}
      </div>
    </div>
  );
}

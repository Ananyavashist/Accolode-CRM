import type { Client } from "@/types";
import { normalizeStage, parseBudgetMax, stageRank } from "@/lib/pipeline";

export type DatabaseFilters = {
  name: string;
  stage: string;
  propertyType: string;
  location: string;
  budget: string;
};

export const EMPTY_DATABASE_FILTERS: DatabaseFilters = {
  name: "",
  stage: "",
  propertyType: "",
  location: "",
  budget: "",
};

export function filtersAreActive(filters: DatabaseFilters): boolean {
  return Object.values(filters).some((v) => v.trim().length > 0);
}

export function clientMatchesFilters(client: Client, filters: DatabaseFilters): boolean {
  if (filters.name.trim()) {
    const q = filters.name.trim().toLowerCase();
    if (!`${client.name} ${client.email}`.toLowerCase().includes(q)) return false;
  }
  if (filters.stage && normalizeStage(client.progressStage) !== filters.stage) return false;
  if (filters.propertyType && client.propertyType !== filters.propertyType) return false;
  if (filters.location.trim()) {
    const q = filters.location.trim().toLowerCase();
    if (!client.location.toLowerCase().includes(q)) return false;
  }
  if (filters.budget.trim()) {
    const q = filters.budget.trim().toLowerCase();
    if (!client.budget.toLowerCase().includes(q)) return false;
  }
  return true;
}

export type DatabaseSortField =
  | "name"
  | "category"
  | "stage"
  | "location"
  | "budget"
  | "source"
  | "moveInDate";

export type DatabaseSortDirection = "asc" | "desc";

export type DatabaseSort = {
  field: DatabaseSortField;
  direction: DatabaseSortDirection;
};

export const DEFAULT_DATABASE_SORT: DatabaseSort = { field: "name", direction: "asc" };

export function compareClients(a: Client, b: Client, sort: DatabaseSort): number {
  const dir = sort.direction === "asc" ? 1 : -1;
  switch (sort.field) {
    case "name":
      return dir * a.name.localeCompare(b.name);
    case "category": {
      const rank = (c: Client) => (c.category === "Renter" ? 0 : 1);
      return dir * (rank(a) - rank(b));
    }
    case "stage":
      return dir * (stageRank(a.progressStage) - stageRank(b.progressStage));
    case "location":
      return dir * a.location.localeCompare(b.location);
    case "source":
      return dir * String(a.source ?? "").localeCompare(String(b.source ?? ""));
    case "moveInDate":
      return dir * String(a.moveInDate ?? "").localeCompare(String(b.moveInDate ?? ""));
    case "budget": {
      const maxA = parseBudgetMax(a.budget) ?? 0;
      const maxB = parseBudgetMax(b.budget) ?? 0;
      return dir * (maxA - maxB);
    }
    default:
      return 0;
  }
}

export function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function exportClientsExcel(rows: Client[], filename: string) {
  const header = [
    "Client ID",
    "Name",
    "Source",
    "Move-in date",
    "Type",
    "Stage",
    "Property type",
    "Location",
    "Budget",
    "Email",
  ];
  const lines = rows.map((c) =>
    [
      c.clientId,
      c.name,
      c.source ?? "",
      c.moveInDate ?? "",
      c.category,
      String(c.progressStage),
      c.propertyType,
      c.location,
      c.budget,
      c.email,
    ]
      .map((v) => csvCell(String(v)))
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportClientsPdf(rows: Client[], title: string) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  const rowsHtml = rows
    .map(
      (c) =>
        `<tr><td>${c.clientId}</td><td>${c.name}</td><td>${c.source ?? ""}</td><td>${c.moveInDate ?? ""}</td><td>${c.category}</td><td>${c.progressStage}</td><td>${c.propertyType}</td><td>${c.location}</td><td>${c.budget}</td></tr>`,
    )
    .join("");
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;padding:24px} table{border-collapse:collapse;width:100%;font-size:12px}
    th,td{border:1px solid #ddd;padding:8px;text-align:left} th{background:#f5f5f5}</style></head>
    <body><h1>${title}</h1><table><thead><tr>
    <th>Client ID</th><th>Name</th><th>Source</th><th>Move-in</th><th>Type</th><th>Stage</th><th>Property type</th><th>Location</th><th>Budget</th>
    </tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
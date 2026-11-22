import { preferenceMatchTableForClient, type PreferenceMatchLevel } from "@/lib/preferenceMatch";
import type { Client } from "@/types";
import { cn } from "@/lib/utils";

function levelTone(level: PreferenceMatchLevel): string {
  if (level === "strong") return "text-ink";
  if (level === "partial") return "text-ink";
  return "text-ink-muted";
}

function MatchDot({ level }: { level: PreferenceMatchLevel }) {
  return (
    <span
      className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full align-middle",
        level === "strong" && "bg-primary",
        level === "partial" && "bg-amber-500",
        level === "weak" && "bg-ink-soft",
      )}
      aria-hidden
    />
  );
}

export function ClientPreferenceMatchTable({ client }: { client: Client }) {
  const { properties, rows } = preferenceMatchTableForClient(client);

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-[10px] border border-hairline bg-surface p-4 sm:p-5">
      <h3 className="text-base font-semibold text-ink">How the homes match the preferences</h3>
      <p className="mt-1 text-[14px] text-ink-muted">
        Top {properties.length} preferred listings compared to onboarding preferences for{" "}
        {client.name}.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-hairline">
              <th
                scope="col"
                className="pb-3 pr-4 text-[13px] font-medium text-ink-muted"
              >
                Preference
              </th>
              {properties.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="pb-3 pr-3 text-[14px] font-semibold text-ink last:pr-0"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-hairline last:border-0">
                <th
                  scope="row"
                  className="py-3 pr-4 text-[13px] font-normal text-ink-muted"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={`${row.id}-${properties[i]?.id ?? i}`}
                    className={cn("py-3 pr-3 font-medium last:pr-0", levelTone(cell.level))}
                  >
                    <span className="inline-flex items-center">
                      <MatchDot level={cell.level} />
                      {cell.value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-ink-soft">
        <span className="inline-flex items-center gap-3">
          <span>
            <MatchDot level="strong" />
            Strong match
          </span>
          <span>
            <MatchDot level="partial" />
            Partial
          </span>
          <span>
            <MatchDot level="weak" />
            Gap
          </span>
        </span>
      </p>
    </section>
  );
}
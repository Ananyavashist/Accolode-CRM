import { useState } from "react";
import { Calendar, ChevronDown, Mail, Phone, FileText } from "@/components/ui/icons";
import {
  activityFeedForClient,
  type ClientActivityFeedItem,
  type ClientActivityType,
} from "@/data/clientActivityFeed";
import type { Client } from "@/types";
import { cn } from "@/lib/utils";

const ICON_BY_TYPE: Record<ClientActivityType, { Icon: typeof Phone; wrap: string }> = {
  call: { Icon: Phone, wrap: "bg-[#E8F2FF] text-[#2563EB]" },
  visit: { Icon: Calendar, wrap: "bg-primary-50 text-primary" },
  task: { Icon: FileText, wrap: "bg-ink text-white" },
  email: { Icon: Mail, wrap: "bg-[#F0E8FF] text-[#7C3AED]" },
};

function RichHeadline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-[14px] leading-snug text-ink">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-semibold">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function RichDetail({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="mt-1 text-sm text-ink-muted">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-medium text-ink">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function ActivityRow({ item }: { item: ClientActivityFeedItem }) {
  const { Icon, wrap } = ICON_BY_TYPE[item.type];

  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      <span
        className={cn(
          "relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          wrap,
        )}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <RichHeadline text={item.headline} />
          <time className="shrink-0 text-xs text-ink-muted">{item.at}</time>
        </div>
        {item.detail && <RichDetail text={item.detail} />}
        {item.callMeta && <p className="mt-1 text-sm text-ink-muted">{item.callMeta}</p>}
        {item.taskCard && (
          <div className="mt-2 rounded-lg border border-hairline bg-surface p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  item.taskCard.status === "Done"
                    ? "border-primary bg-primary text-[10px] text-white"
                    : "border-hairline",
                )}
              >
                {item.taskCard.status === "Done" ? "✓" : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.taskCard.title}</p>
                {item.taskCard.checklist && item.taskCard.checklist.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {item.taskCard.checklist.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-[13px] text-ink-muted"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="pill bg-status-warningBg text-status-warning text-[11px]">
                    {item.taskCard.priority}
                  </span>
                  <span className="pill bg-status-awaitingBg text-status-awaiting text-[11px]">
                    {item.taskCard.status}
                  </span>
                  <span className="text-xs text-ink-muted">Due {item.taskCard.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export function ClientActivityFeed({
  client,
  brokerName,
}: {
  client: Client;
  brokerName: string;
}) {
  const items = activityFeedForClient(client, brokerName);
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Activity</p>
        <p className="mt-1 text-[14px] text-ink-muted">
          Calls, site visits, tasks, and emails for this client — from first contact through{" "}
          {client.progressStage}.
        </p>
        <ul className="relative mt-4 space-y-0 pl-1">
          <span
            className="pointer-events-none absolute bottom-2 left-[18px] top-2 w-px border-l border-dashed border-hairline"
            aria-hidden
          />
          {visible.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </ul>
        {items.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-sm font-medium text-ink-muted hover:text-ink"
          >
            {expanded ? "Show less activity" : "View more activity"}
            <ChevronDown
              size={16}
              className={cn("transition-transform", expanded && "rotate-180")}
            />
          </button>
        )}
      </div>
    </div>
  );
}
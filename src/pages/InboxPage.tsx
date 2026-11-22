import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ListFilter,
  PaperclipIcon,
  Phone,
  Plus,
  Search,
  Send,
  VideoIcon,
} from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import type { Conversation } from "@/types";
import { cn, formatDisplayCopy } from "@/lib/utils";

function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
        active ? "bg-primary/[0.08]" : "hover:bg-sidebar",
      )}
    >
      <span className="relative shrink-0">
        <Avatar name={conversation.name} src={conversation.avatar} size={44} />
        {conversation.online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-completed" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-ink">{conversation.name}</span>
          <span className="shrink-0 text-xs text-ink-muted">{conversation.time}</span>
        </span>
        <span className="mt-0.5 block truncate text-sm text-ink-muted">
          {formatDisplayCopy(conversation.preview)}
        </span>
      </span>
    </button>
  );
}

function ChatThread({
  conversation,
  draft,
  onDraft,
  onSend,
  onBack,
}: {
  conversation: Conversation;
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  onBack?: () => void;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button type="button" onClick={onBack} className="btn-ghost !w-auto gap-1.5 lg:hidden">
              Back
              <ChevronLeft size={16} />
            </button>
          )}
          <Avatar name={conversation.name} src={conversation.avatar} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{conversation.name}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" className="icon-btn" aria-label="Video call">
            <VideoIcon size={18} />
          </button>
          <button type="button" className="icon-btn" aria-label="Phone call">
            <Phone size={18} />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-sidebar/30 px-4 py-4">
        <p className="text-center text-xs font-medium text-ink-soft">Today</p>
        {conversation.messages.map((msg) => {
          const isBroker = msg.from === "broker";
          return (
            <div key={msg.id} className={cn("flex", isBroker ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[min(100%,420px)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                  isBroker
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-hairline bg-surface text-ink",
                )}
              >
                <p>{formatDisplayCopy(msg.text)}</p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    isBroker ? "text-white/80" : "text-ink-muted",
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-2 border-t border-hairline bg-surface px-3 py-3"
      >
        <button type="button" className="icon-btn shrink-0" aria-label="Attach file">
          <PaperclipIcon size={18} />
        </button>
        <button type="button" className="icon-btn shrink-0" aria-label="Add">
          <Plus size={18} />
        </button>
        <input
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          placeholder="Enter a message"
          className="input-field h-10 min-w-0 flex-1 border-transparent bg-sidebar"
        />
        <button
          type="submit"
          className="btn-primary !w-auto shrink-0 gap-1.5 !px-3"
          aria-label="Send message"
        >
          Send
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export function InboxPage() {
  const { conversations, sendMessage } = useCrm();
  const [searchParams] = useSearchParams();
  const focusClient = searchParams.get("client");
  const [query, setQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [mobileThread, setMobileThread] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return conversations.filter((c) => {
      if (onlineOnly && !c.online) return false;
      if (!q) return true;
      return `${c.name} ${c.preview}`.toLowerCase().includes(q);
    });
  }, [conversations, query, onlineOnly]);

  const active = useMemo(
    () => filtered.find((c) => c.id === activeId) ?? filtered[0] ?? null,
    [filtered, activeId],
  );

  useEffect(() => {
    if (!focusClient) return;
    const slug = focusClient.replace(/-/g, " ").toLowerCase();
    const match = conversations.find((c) => c.name.toLowerCase().includes(slug));
    if (match) {
      setActiveId(match.id);
      setMobileThread(true);
    }
  }, [focusClient, conversations]);

  useEffect(() => {
    if (!activeId && filtered[0]) setActiveId(filtered[0].id);
  }, [filtered, activeId]);

  const handleSend = () => {
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 lg:p-6">
      <div className="section-card flex min-h-0 flex-1 overflow-hidden rounded-2xl">
        <aside
          className={cn(
            "flex h-full min-h-0 w-full min-w-0 flex-col border-hairline lg:basis-[30%] lg:shrink-0 lg:grow-0 lg:border-r",
            mobileThread && "hidden lg:flex",
          )}
        >
          <div className="flex items-center gap-2 border-b border-hairline px-3 py-2.5">
            <h1 className="shrink-0 text-lg font-bold text-ink">Inbox</h1>
            <div className="relative min-w-0 flex-1">
              <label htmlFor="inbox-search" className="sr-only">
                Search inbox
              </label>
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="inbox-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="input-field h-9 w-full bg-sidebar pl-9"
              />
            </div>
            <button
              type="button"
              onClick={() => setOnlineOnly((v) => !v)}
              className={cn(
                "icon-btn shrink-0",
                onlineOnly && "border-primary/30 bg-primary/5 text-primary",
              )}
              aria-label="Filter online conversations"
              aria-pressed={onlineOnly}
            >
              <ListFilter size={16} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState
                title="No conversations"
                description="Try another search or clear the online filter."
                className="py-12"
              />
            ) : (
              filtered.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conversation={conv}
                  active={active?.id === conv.id}
                  onSelect={() => {
                    setActiveId(conv.id);
                    setMobileThread(true);
                    setDraft("");
                  }}
                />
              ))
            )}
          </div>
        </aside>

        <div
          className={cn(
            "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:basis-[70%] lg:flex-none lg:shrink-0 lg:grow-0",
            !mobileThread && "hidden lg:flex",
          )}
        >
          {active ? (
            <ChatThread
              conversation={active}
              draft={draft}
              onDraft={setDraft}
              onSend={handleSend}
              onBack={() => setMobileThread(false)}
            />
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Pick a thread from the inbox list to start chatting."
              className="m-auto py-16"
            />
          )}
        </div>
      </div>
    </div>
  );
}

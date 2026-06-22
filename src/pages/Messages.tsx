import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ImageIcon,
  ListFilter,
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  VideoIcon as Video,
} from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { useCrm } from "@/store/CrmContext";
import { cn } from "@/lib/utils";

export function Messages() {
  const { conversations, sendMessage } = useCrm();
  const [searchParams] = useSearchParams();
  const chatParam = searchParams.get("chat");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [draft, setDraft] = useState("");
  const [mobileChat, setMobileChat] = useState(false);

  useEffect(() => {
    if (!chatParam) return;
    const match = conversations.find((c) => c.id === chatParam);
    if (match) {
      setSelectedId(match.id);
      setMobileChat(true);
    }
  }, [chatParam, conversations]);

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        `${c.name} ${c.preview}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [conversations, query],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? conversations[0],
    [conversations, selectedId],
  );

  const handleSend = () => {
    if (!active) return;
    sendMessage(active.id, draft);
    setDraft("");
  };

  return (
    <div className="p-section">
      <div className="grid grid-cols-1 gap-section lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className={cn("section-card flex flex-col", mobileChat && "hidden lg:flex")}>
          <div className="p-3">
            <h1 className="px-1 pb-3 text-ink">Client chat</h1>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-10 w-full rounded-[10px] border border-hairline bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-ink-soft focus:border-primary/40"
                />
              </div>
              <button className="icon-btn rounded-[10px]" aria-label="Filter">
                <ListFilter size={16} />
              </button>
            </div>
          </div>

          <div className="flex max-h-[calc(100vh-220px)] flex-col overflow-y-auto px-2 pb-2 lg:max-h-[680px]">
            {filtered.map((conv) => {
              const isActive = active?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedId(conv.id);
                    setMobileChat(true);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-[10px] px-2.5 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-primary/5 font-medium text-primary"
                      : "text-ink-muted hover:bg-sidebar hover:text-ink",
                  )}
                >
                  <Avatar name={conv.name} src={conv.avatar} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{conv.name}</span>
                      <span className="shrink-0 text-xs text-ink-soft">{conv.time}</span>
                    </div>
                    <p className="truncate text-xs text-ink-muted">{conv.preview}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={cn("section-card flex flex-col", !mobileChat && "hidden lg:flex")}>
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-hairline p-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileChat(false)}
                    className="icon-btn h-8 w-8 lg:hidden"
                    aria-label="Back"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <Avatar name={active.name} src={active.avatar} size={40} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{active.name}</p>
                    <p className={cn("text-xs", active.online ? "text-status-completed" : "text-ink-soft")}>
                      {active.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="icon-btn" aria-label="Video call">
                    <Video size={16} />
                  </button>
                  <button className="icon-btn" aria-label="Voice call">
                    <Phone size={16} />
                  </button>
                  <button className="icon-btn" aria-label="More">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 lg:max-h-[560px]">
                {active.messages.map((msg) => {
                  const mine = msg.from === "broker";
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex flex-col", mine ? "items-end" : "items-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-[10px] px-3 py-2 text-sm",
                          mine
                            ? "bg-primary text-white"
                            : "border border-hairline bg-sidebar text-ink",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="mt-1 text-xs text-ink-soft">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-hairline p-3">
                <div className="flex items-center gap-2 rounded-[10px] border border-hairline px-3 py-2">
                  <button className="text-ink-soft hover:text-ink" aria-label="Add">
                    <Plus size={18} />
                  </button>
                  <button className="text-ink-soft hover:text-ink" aria-label="Emoji">
                    <Smile size={18} />
                  </button>
                  <button className="text-ink-soft hover:text-ink" aria-label="Image">
                    <ImageIcon size={18} />
                  </button>
                  <button className="text-ink-soft hover:text-ink" aria-label="Voice">
                    <Mic size={18} />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Enter the message"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-soft"
                  />
                  <button
                    onClick={handleSend}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white transition-colors hover:bg-primary-700"
                    aria-label="Send"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-sm text-ink-soft">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

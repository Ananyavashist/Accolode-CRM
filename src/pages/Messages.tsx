import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { personSlug, waHref } from "@/lib/pipeline";

function templateFor(name: string, properties: { name: string; location: string; price: string }[]) {
  const lines = properties
    .slice(0, 3)
    .map((p) => `• ${p.name} — ${p.location} — ${p.price}`)
    .join("\n");
  return `Hi ${name}, here are a few properties that match what you asked for:\n${lines || "• I’ll send options shortly."}\nShall I book a visit?`;
}

export function Messages() {
  const navigate = useNavigate();
  const { clients, whatsappSends, logWhatsApp } = useCrm();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("client");
  const [query, setQuery] = useState("");

  const filteredClients = useMemo(
    () =>
      clients.filter((c) =>
        `${c.name} ${c.phone} ${c.location}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [clients, query],
  );

  const filteredSends = useMemo(
    () =>
      whatsappSends.filter((s) =>
        `${s.clientName} ${s.preview}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [whatsappSends, query],
  );

  const sendTo = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const text = templateFor(client.name, client.properties);
    logWhatsApp({
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      preview: text.slice(0, 80),
      stage: String(client.progressStage),
    });
    window.open(waHref(client.phone, text), "_blank", "noopener,noreferrer");
  };

  const highlighted = focusId
    ? clients.find((c) => c.id === focusId || personSlug(c.name) === focusId)
    : undefined;

  return (
    <div className="page">
      <div>
        <h1 className="text-ink">WhatsApp</h1>
        <p className="page-lede">
          Message in WhatsApp. Accolode only logs that you sent it — no second inbox.
        </p>
      </div>

      {highlighted && (
        <div className="section-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={highlighted.name} src={highlighted.avatar} size={40} />
            <div>
              <p className="text-sm font-semibold text-ink">{highlighted.name}</p>
              <p className="text-xs text-ink-muted">{highlighted.phone}</p>
            </div>
          </div>
          <button onClick={() => sendTo(highlighted.id)} className="btn-primary">
            Message on WhatsApp
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-section lg:grid-cols-2">
        <section className="section-card" aria-labelledby="pick-client">
          <div className="border-b border-hairline p-3">
            <h2 id="pick-client" className="text-sm font-semibold text-ink">
              Clients
            </h2>
            <label htmlFor="wa-search" className="sr-only">
              Search clients
            </label>
            <div className="relative mt-2">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="wa-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="input-field pl-9"
              />
            </div>
          </div>
          <ul className="max-h-[560px] divide-y divide-hairline overflow-y-auto">
            {filteredClients.length === 0 ? (
              <EmptyState
                title="No clients to message"
                description="Add or accept a client first."
                action={
                  <button className="btn-primary" onClick={() => navigate("/clients")}>
                    Client Database
                  </button>
                }
              />
            ) : (
              filteredClients.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-3 py-2.5">
                  <Avatar name={c.name} src={c.avatar} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                    <p className="truncate text-xs text-ink-muted">{c.phone}</p>
                  </div>
                  <button onClick={() => sendTo(c.id)} className="btn-outline h-8 text-xs">
                    WhatsApp
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="section-card" aria-labelledby="send-log">
          <div className="border-b border-hairline p-3">
            <h2 id="send-log" className="text-sm font-semibold text-ink">
              Send log
            </h2>
            <p className="text-xs text-ink-muted">Each send is recorded with the stage at the time.</p>
          </div>
          {filteredSends.length === 0 ? (
            <EmptyState
              title="Message a client on WhatsApp"
              description="Opens WhatsApp with a shortlist template. We only keep a log here."
            />
          ) : (
            <ul className="divide-y divide-hairline">
              {filteredSends.map((s) => (
                <li key={s.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{s.clientName}</p>
                    <span className="text-xs text-ink-muted">
                      {new Date(s.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    {s.stage ? `Stage: ${s.stage} · ` : ""}
                    {s.preview}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

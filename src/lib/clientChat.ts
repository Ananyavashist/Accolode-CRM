import type { Conversation } from "@/types";

/** Resolve the messages conversation for a client profile. */
export function conversationIdForClient(
  clientName: string,
  conversations: Conversation[],
): string | undefined {
  const normalized = clientName.trim().toLowerCase();
  const exact = conversations.find((c) => c.name.trim().toLowerCase() === normalized);
  if (exact) return exact.id;

  const first = normalized.split(" ")[0];
  const partial = conversations.find((c) =>
    c.name.trim().toLowerCase().startsWith(first),
  );
  return partial?.id;
}

export function messagesPathForClient(
  clientName: string,
  conversations: Conversation[],
): string {
  const id = conversationIdForClient(clientName, conversations);
  return id ? `/messages?chat=${encodeURIComponent(id)}` : "/messages";
}

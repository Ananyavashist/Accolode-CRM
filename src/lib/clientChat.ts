import type { Client } from "@/types";
import { personSlug } from "@/lib/pipeline";

export function messagesPathForClient(client: Pick<Client, "name">): string {
  return `/messages?client=${encodeURIComponent(personSlug(client.name))}`;
}

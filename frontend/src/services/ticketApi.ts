import type { Priority, Ticket, TicketStatus } from "../types/ticket";

export async function getTickets(
  status: TicketStatus | "",
  priority: Priority | "",
  signal?: AbortSignal,
): Promise<Ticket[]> {
  const parameters = new URLSearchParams();

  if (status) {
    parameters.set("status", status);
  }

  if (priority) {
    parameters.set("priority", priority);
  }

  const query = parameters.toString();
  const url = query ? `/api/tickets?${query}` : "/api/tickets";
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load tickets (${response.status})`);
  }

  return response.json() as Promise<Ticket[]>;
}

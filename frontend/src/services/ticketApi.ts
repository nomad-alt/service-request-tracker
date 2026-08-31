import type {
  Priority,
  Ticket,
  TicketRequest,
  TicketStatus,
} from "../types/ticket";

async function createResponseError(response: Response): Promise<Error> {
  try {
    const body = (await response.json()) as { message?: string };

    return new Error(body.message ?? `Request failed (${response.status})`);
  } catch {
    return new Error(`Request failed (${response.status})`);
  }
}

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
    throw await createResponseError(response);
  }

  return response.json() as Promise<Ticket[]>;
}

export async function createTicket(request: TicketRequest): Promise<Ticket> {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw await createResponseError(response);
  }

  return response.json() as Promise<Ticket>;
}

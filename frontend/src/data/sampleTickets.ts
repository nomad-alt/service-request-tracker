import type { Ticket } from "../types/ticket";

export const sampleTickets: Ticket[] = [
  {
    id: 101,
    title: "Printer unavailable",
    description:
      "The third-floor printer is offline and cannot be reached by anyone on the office network.",
    priority: "HIGH",
    status: "OPEN",
    createdAt: "2026-08-29T08:15:00.000Z",
    updatedAt: "2026-08-29T08:15:00.000Z",
  },
  {
    id: 102,
    title: "New employee account",
    description:
      "Set up email, shared drive access, and standard application permissions for a new support specialist.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdAt: "2026-08-27T13:40:00.000Z",
    updatedAt: "2026-08-30T09:20:00.000Z",
  },
  {
    id: 103,
    title: "Software installation",
    description:
      "Install the approved diagramming application on the design team's conference-room computer.",
    priority: "LOW",
    status: "CLOSED",
    createdAt: "2026-08-22T10:05:00.000Z",
    updatedAt: "2026-08-25T15:30:00.000Z",
  },
];

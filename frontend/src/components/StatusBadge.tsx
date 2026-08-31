import type { TicketStatus } from "../types/ticket";

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge status-badge status-badge--${status.toLowerCase()}`}>
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;

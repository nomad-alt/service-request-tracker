import type { ChangeEvent } from "react";
import type { Priority, TicketStatus } from "../types/ticket";

interface TicketFiltersProps {
  status: TicketStatus | "";
  priority: Priority | "";
  onStatusChange: (status: TicketStatus | "") => void;
  onPriorityChange: (priority: Priority | "") => void;
}

function TicketFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TicketFiltersProps) {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(event.currentTarget.value as TicketStatus | "");
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onPriorityChange(event.currentTarget.value as Priority | "");
  };

  return (
    <div className="ticket-filters">
      <div className="ticket-filter">
        <label htmlFor="ticket-status-filter">Status</label>
        <select
          id="ticket-status-filter"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="ticket-filter">
        <label htmlFor="ticket-priority-filter">Priority</label>
        <select
          id="ticket-priority-filter"
          value={priority}
          onChange={handlePriorityChange}
        >
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
    </div>
  );
}

export default TicketFilters;

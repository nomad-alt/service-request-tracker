import { useState } from "react";
import { Link } from "react-router";
import TicketCard from "../components/TicketCard";
import TicketFilters from "../components/TicketFilters";
import { sampleTickets } from "../data/sampleTickets";
import type { Priority, TicketStatus } from "../types/ticket";

function TicketDashboard() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

  function handleStatusChange(status: TicketStatus | "") {
    setStatusFilter(status);

    if (status) {
      setPriorityFilter("");
    }
  }

  function handlePriorityChange(priority: Priority | "") {
    setPriorityFilter(priority);

    if (priority) {
      setStatusFilter("");
    }
  }

  const visibleTickets = sampleTickets.filter((ticket) => {
    if (statusFilter) {
      return ticket.status === statusFilter;
    }

    if (priorityFilter) {
      return ticket.priority === priorityFilter;
    }

    return true;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Ticket Dashboard</h2>
          <p>Monitor, prioritize, and manage incoming service requests.</p>
        </div>
        <Link className="primary-action" to="/tickets/new">
          Create ticket
        </Link>
      </div>

      <TicketFilters
        status={statusFilter}
        priority={priorityFilter}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      <p className="result-count" aria-live="polite">
        Showing {visibleTickets.length} of {sampleTickets.length} tickets
      </p>

      {visibleTickets.length === 0 ? (
        <section className="empty-state">
          <p>No tickets match the selected filter.</p>
        </section>
      ) : (
        <section className="ticket-list" aria-label="Ticket list">
          {visibleTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </section>
      )}
    </div>
  );
}

export default TicketDashboard;

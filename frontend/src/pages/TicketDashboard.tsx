import { useEffect, useState } from "react";
import { Link } from "react-router";
import TicketCard from "../components/TicketCard";
import TicketFilters from "../components/TicketFilters";
import { getTickets } from "../services/ticketApi";
import type { Priority, Ticket, TicketStatus } from "../types/ticket";

function TicketDashboard() {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTickets() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await getTickets(
          statusFilter,
          priorityFilter,
          controller.signal,
        );

        setTickets(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load tickets",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadTickets();

    return () => controller.abort();
  }, [statusFilter, priorityFilter]);

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

  const hasActiveFilter = Boolean(statusFilter || priorityFilter);

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

      {isLoading ? (
        <section className="request-state" aria-live="polite">
          <p>Loading tickets…</p>
        </section>
      ) : loadError ? (
        <section className="request-state request-state--error">
          <p role="alert">{loadError}</p>
        </section>
      ) : tickets.length === 0 ? (
        <>
          <p className="result-count" aria-live="polite">
            {tickets.length} tickets
          </p>
          <section className="empty-state">
            <p>
              {hasActiveFilter
                ? "No tickets match the selected filter."
                : "No tickets have been created yet."}
            </p>
          </section>
        </>
      ) : (
        <>
          <p className="result-count" aria-live="polite">
            {tickets.length} tickets
          </p>
          <section className="ticket-list" aria-label="Ticket list">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default TicketDashboard;

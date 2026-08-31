import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { getTicket, updateTicketStatus } from "../services/ticketApi";
import type {
  Ticket,
  TicketStatus,
  UpdateTicketStatusRequest,
} from "../types/ticket";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function TicketDetailsPage() {
  const { id } = useParams();
  const ticketId = Number(id);
  const hasValidId = Number.isInteger(ticketId) && ticketId > 0;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<TicketStatus>("OPEN");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!hasValidId) {
      return;
    }

    const controller = new AbortController();

    async function loadTicket() {
      setIsLoading(true);
      setLoadError(null);
      setTicket(null);
      setStatusUpdateError(null);
      setStatusUpdateMessage(null);

      try {
        const result = await getTicket(ticketId, controller.signal);

        setTicket(result);
        setSelectedStatus(result.status);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load ticket",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadTicket();

    return () => controller.abort();
  }, [ticketId, hasValidId]);

  const hasStatusChanged =
    ticket !== null && selectedStatus !== ticket.status;

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ticket || !hasStatusChanged) {
      return;
    }

    const request: UpdateTicketStatusRequest = {
      status: selectedStatus,
    };

    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    setStatusUpdateMessage(null);

    try {
      const updatedTicket = await updateTicketStatus(ticket.id, request);

      setTicket(updatedTicket);
      setSelectedStatus(updatedTicket.status);
      setStatusUpdateMessage("Status updated successfully.");
    } catch (error) {
      setStatusUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to update ticket status",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const requestError = hasValidId ? loadError : "Invalid ticket ID";

  if (hasValidId && isLoading) {
    return (
      <div className="dashboard">
        <section className="request-state" aria-live="polite">
          <p>Loading ticket…</p>
        </section>
      </div>
    );
  }

  if (requestError) {
    return (
      <div className="dashboard">
        <h2 role="alert">{requestError}</h2>
        <Link className="secondary-action details-return-link" to="/">
          Return to dashboard
        </Link>
      </div>
    );
  }

  if (ticket) {
    return (
      <div className="dashboard">
        <Link className="secondary-action details-back-link" to="/">
          Return to dashboard
        </Link>

        <article className="ticket-details">
          <header className="ticket-details__header">
            <p className="section-label">Ticket #{ticket.id}</p>
            <h2>{ticket.title}</h2>
            <div className="ticket-details__badges">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </header>

          <section aria-labelledby="ticket-description-heading">
            <h3 id="ticket-description-heading">Description</h3>
            <p className="ticket-details__description">{ticket.description}</p>
          </section>

          <dl className="ticket-details__dates">
            <div>
              <dt>Created</dt>
              <dd>
                <time dateTime={ticket.createdAt}>
                  {dateFormatter.format(new Date(ticket.createdAt))}
                </time>
              </dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>
                <time dateTime={ticket.updatedAt}>
                  {dateFormatter.format(new Date(ticket.updatedAt))}
                </time>
              </dd>
            </div>
          </dl>

          <form className="status-form" onSubmit={handleStatusSubmit}>
            <div className="form-field">
              <label htmlFor="ticket-status">Status</label>
              <select
                id="ticket-status"
                value={selectedStatus}
                disabled={isUpdatingStatus}
                onChange={(event) => {
                  setSelectedStatus(event.currentTarget.value as TicketStatus);
                  setStatusUpdateError(null);
                  setStatusUpdateMessage(null);
                }}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <button
              className="primary-action"
              type="submit"
              disabled={isUpdatingStatus || !hasStatusChanged}
            >
              {isUpdatingStatus ? "Updating…" : "Update status"}
            </button>

            {statusUpdateError && (
              <p className="submit-error" role="alert">
                {statusUpdateError}
              </p>
            )}

            {statusUpdateMessage && (
              <p className="submit-success" role="status">
                {statusUpdateMessage}
              </p>
            )}
          </form>
        </article>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 role="alert">Ticket not found</h2>
      <Link className="secondary-action details-return-link" to="/">
        Return to dashboard
      </Link>
    </div>
  );
}

export default TicketDetailsPage;

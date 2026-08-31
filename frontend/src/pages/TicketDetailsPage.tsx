import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { getTicket } from "../services/ticketApi";
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
  const [pendingStatusRequest, setPendingStatusRequest] =
    useState<UpdateTicketStatusRequest | null>(null);

  useEffect(() => {
    if (!hasValidId) {
      return;
    }

    const controller = new AbortController();

    async function loadTicket() {
      setIsLoading(true);
      setLoadError(null);
      setTicket(null);
      setPendingStatusRequest(null);

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

  function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: UpdateTicketStatusRequest = {
      status: selectedStatus,
    };

    setPendingStatusRequest(request);
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
                onChange={(event) => {
                  setSelectedStatus(event.currentTarget.value as TicketStatus);
                  setPendingStatusRequest(null);
                }}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <button className="primary-action" type="submit">
              Update status
            </button>

            {pendingStatusRequest && (
              <p className="submit-success" role="status">
                Status is ready to update.
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

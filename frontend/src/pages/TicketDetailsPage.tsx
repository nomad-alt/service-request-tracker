import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import { sampleTickets } from "../data/sampleTickets";
import type {
  TicketStatus,
  UpdateTicketStatusRequest,
} from "../types/ticket";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function TicketDetailsPage() {
  const { id } = useParams();
  const ticketId = Number(id);

  const ticket = sampleTickets.find(
    (candidate) => candidate.id === ticketId,
  );
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket?.status ?? "OPEN",
  );
  const [pendingStatusRequest, setPendingStatusRequest] =
    useState<UpdateTicketStatusRequest | null>(null);

  function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: UpdateTicketStatusRequest = {
      status: selectedStatus,
    };

    setPendingStatusRequest(request);
  }

  if (!ticket) {
    return (
      <div className="dashboard">
        <h2>Ticket not found</h2>
        <Link className="secondary-action details-return-link" to="/">
          Return to dashboard
        </Link>
      </div>
    );
  }

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

export default TicketDetailsPage;

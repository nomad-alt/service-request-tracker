import { Link } from "react-router";
import type { Ticket } from "../types/ticket";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

interface TicketCardProps {
  ticket: Ticket;
}

function TicketCard({ ticket }: TicketCardProps) {
  const formattedCreationDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(ticket.createdAt));

  return (
    <article className="ticket-card">
      <h3 className="ticket-card__title">
        <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
      </h3>

      <p className="ticket-card__description">{ticket.description}</p>

      <div className="ticket-card__metadata">
        <div className="ticket-card__badges">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
        <p className="ticket-card__date">
          Created <time dateTime={ticket.createdAt}>{formattedCreationDate}</time>
        </p>
      </div>
    </article>
  );
}

export default TicketCard;

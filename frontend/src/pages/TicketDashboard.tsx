import { Link } from "react-router";
import TicketCard from "../components/TicketCard";
import { sampleTickets } from "../data/sampleTickets";

function TicketDashboard() {
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

      {sampleTickets.length === 0 ? (
        <section className="empty-state">
          <p>No tickets found</p>
        </section>
      ) : (
        <section className="ticket-list" aria-label="Ticket list">
          {sampleTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </section>
      )}
    </div>
  );
}

export default TicketDashboard;

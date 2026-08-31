import { Link } from "react-router";

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

      <section className="empty-state" aria-label="Ticket list">
        <p>No tickets loaded yet</p>
      </section>
    </div>
  );
}

export default TicketDashboard;

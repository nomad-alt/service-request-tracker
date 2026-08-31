import { useParams } from "react-router";

function TicketDetailsPage() {
  const { id } = useParams();

  return (
    <div className="dashboard">
      <h2>Ticket #{id}</h2>
    </div>
  );
}

export default TicketDetailsPage;

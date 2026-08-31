import "./App.css";
import { Link, Route, Routes } from "react-router";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDashboard from "./pages/TicketDashboard";
import TicketDetailsPage from "./pages/TicketDetailsPage";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="page-width">
          <p className="section-label">Support Operations</p>
          <h1>
            <Link className="brand-link" to="/">
              Service Request Tracker
            </Link>
          </h1>
        </div>
      </header>

      <main className="page-width main-content">
        <Routes>
          <Route path="/" element={<TicketDashboard />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

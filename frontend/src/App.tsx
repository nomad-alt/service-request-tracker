import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="page-width">
          <p className="section-label">Support Operations</p>
          <h1>Service Request Tracker</h1>
        </div>
      </header>

      <main className="page-width dashboard">
        <div className="dashboard-heading">
          <div>
            <h2>Ticket Dashboard</h2>
            <p>Monitor, prioritize, and manage incoming service requests.</p>
          </div>
          <button type="button">Create ticket</button>
        </div>

        <section className="empty-state" aria-label="Ticket list">
          <p>No tickets loaded yet</p>
        </section>
      </main>
    </div>
  );
}

export default App;

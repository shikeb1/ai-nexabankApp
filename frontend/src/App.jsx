import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import Transactions from "./pages/Transactions";
import AIAdvisor from "./pages/AIAdvisor";

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "⬡" },
  { id: "create",       label: "New Account",  icon: "＋" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "ai",           label: "AI Advisor",   icon: "◈" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">◈</span>
          <div>
            <div className="brand-name">NexaBank</div>
            <div className="brand-sub">AI-Powered Banking</div>
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="devsecops-badge">DevSecOps Learning App</div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────── */}
      <main className="main-content">
        {page === "dashboard"    && <Dashboard    onSelectAccount={setSelectedAccount} selectedAccount={selectedAccount} />}
        {page === "create"       && <CreateAccount onCreated={() => setPage("dashboard")} />}
        {page === "transactions" && <Transactions  selectedAccount={selectedAccount} />}
        {page === "ai"           && <AIAdvisor     selectedAccount={selectedAccount} />}
      </main>
    </div>
  );
}

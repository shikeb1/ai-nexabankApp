import { useState, useEffect } from "react";
import { getAccounts, deposit, withdraw } from "../api";

export default function Dashboard({ onSelectAccount, selectedAccount }) {
  const [accounts, setAccounts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [action, setAction]       = useState(null); // { type, accountId }
  const [amount, setAmount]       = useState("");
  const [desc, setDesc]           = useState("");
  const [feedback, setFeedback]   = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAccounts();
      setAccounts(data);
    } catch (e) {
      setError("Could not load accounts. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleQuickAction = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || +amount <= 0) return;
    try {
      if (action.type === "deposit") {
        await deposit({ account_id: action.accountId, amount: +amount, description: desc || "Deposit" });
      } else {
        await withdraw({ account_id: action.accountId, amount: +amount, description: desc || "Withdrawal" });
      }
      setFeedback(`✓ ${action.type} successful!`);
      setAction(null);
      setAmount("");
      setDesc("");
      load();
    } catch (e) {
      setFeedback(`✗ ${e.message}`);
    }
  };

  if (loading) return <div className="loading-pulse">Loading accounts…</div>;
  if (error)   return <div className="error-banner">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Account Dashboard</h1>
        <p className="page-sub">Overview of all NexaBank accounts</p>
      </div>

      {accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⬡</div>
          <p>No accounts yet. Create your first account →</p>
        </div>
      ) : (
        <div className="card-grid">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`account-card ${selectedAccount?.id === acc.id ? "selected" : ""}`}
              onClick={() => onSelectAccount(acc)}
            >
              <div className="card-top">
                <div className="card-avatar">{acc.name[0].toUpperCase()}</div>
                <div className="card-acno">{acc.account_no}</div>
              </div>
              <div className="card-name">{acc.name}</div>
              <div className="card-email">{acc.email}</div>
              <div className="card-balance">
                <span className="balance-label">Balance</span>
                <span className="balance-amount">₹{acc.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="card-actions">
                <button className="btn-deposit" onClick={(e) => { e.stopPropagation(); setAction({ type: "deposit", accountId: acc.id }); setFeedback(""); }}>
                  + Deposit
                </button>
                <button className="btn-withdraw" onClick={(e) => { e.stopPropagation(); setAction({ type: "withdraw", accountId: acc.id }); setFeedback(""); }}>
                  − Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Modal */}
      {action && (
        <div className="modal-overlay" onClick={() => setAction(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{action.type === "deposit" ? "💰 Deposit Funds" : "💸 Withdraw Funds"}</div>
            <form onSubmit={handleQuickAction}>
              <div className="field">
                <label>Amount (₹)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="1" required />
              </div>
              <div className="field">
                <label>Description</label>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Salary credit" />
              </div>
              {feedback && <div className={`feedback ${feedback.startsWith("✓") ? "success" : "fail"}`}>{feedback}</div>}
              <div className="modal-btns">
                <button type="submit" className="btn-primary">Confirm</button>
                <button type="button" className="btn-ghost" onClick={() => setAction(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedback && !action && (
        <div className={`toast ${feedback.startsWith("✓") ? "success" : "fail"}`}>{feedback}</div>
      )}
    </div>
  );
}

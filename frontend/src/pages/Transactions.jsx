import { useState, useEffect } from "react";
import { getAccounts, getTransactions, transfer } from "../api";

const TYPE_STYLE = {
  deposit:    { color: "#22c55e", label: "Deposit",    sign: "+" },
  withdrawal: { color: "#ef4444", label: "Withdrawal", sign: "−" },
  transfer:   { color: "#f59e0b", label: "Transfer",   sign: "→" },
};

export default function Transactions({ selectedAccount }) {
  const [accounts, setAccounts]       = useState([]);
  const [txns, setTxns]               = useState([]);
  const [accountId, setAccountId]     = useState(selectedAccount?.id || "");
  const [loading, setLoading]         = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [tfForm, setTfForm]           = useState({ to: "", amount: "", desc: "" });
  const [feedback, setFeedback]       = useState("");

  useEffect(() => {
    getAccounts().then(setAccounts).catch(() => {});
  }, []);

  useEffect(() => {
    if (accountId) loadTxns(accountId);
  }, [accountId]);

  const loadTxns = async (id) => {
    setLoading(true);
    try {
      const data = await getTransactions(id);
      setTxns(data);
    } catch (e) {
      setTxns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await transfer({
        from_account_id: +accountId,
        to_account_id:   +tfForm.to,
        amount:          +tfForm.amount,
        description:     tfForm.desc || "Transfer",
      });
      setFeedback("✓ Transfer successful!");
      setShowTransfer(false);
      setTfForm({ to: "", amount: "", desc: "" });
      loadTxns(accountId);
    } catch (e) {
      setFeedback(`✗ ${e.message}`);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>
        <p className="page-sub">View and manage transfers</p>
      </div>

      <div className="txn-controls">
        <select
          className="select-input"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="">— Select Account —</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.account_no})
            </option>
          ))}
        </select>

        {accountId && (
          <button className="btn-primary" onClick={() => { setShowTransfer(true); setFeedback(""); }}>
            ⇄ New Transfer
          </button>
        )}
      </div>

      {feedback && (
        <div className={`toast ${feedback.startsWith("✓") ? "success" : "fail"}`}>{feedback}</div>
      )}

      {loading && <div className="loading-pulse">Loading transactions…</div>}

      {!loading && accountId && txns.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⇄</div>
          <p>No transactions yet for this account.</p>
        </div>
      )}

      {!loading && txns.length > 0 && (
        <div className="txn-list">
          {txns.map((t) => {
            const style = TYPE_STYLE[t.type] || {};
            return (
              <div key={t.id} className="txn-row">
                <div className="txn-left">
                  <div className="txn-type-dot" style={{ background: style.color }} />
                  <div>
                    <div className="txn-desc">{t.description}</div>
                    <div className="txn-date">
                      {new Date(t.created_at).toLocaleString("en-IN")} · {style.label}
                    </div>
                  </div>
                </div>
                <div className="txn-amount" style={{ color: style.color }}>
                  {style.sign} ₹{t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="modal-overlay" onClick={() => setShowTransfer(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⇄ Transfer Funds</div>
            <form onSubmit={handleTransfer}>
              <div className="field">
                <label>To Account</label>
                <select
                  className="select-input"
                  value={tfForm.to}
                  onChange={(e) => setTfForm({ ...tfForm, to: e.target.value })}
                  required
                >
                  <option value="">— Select Recipient —</option>
                  {accounts.filter((a) => String(a.id) !== String(accountId)).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.account_no})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Amount (₹)</label>
                <input
                  type="number" min="1"
                  value={tfForm.amount}
                  onChange={(e) => setTfForm({ ...tfForm, amount: e.target.value })}
                  placeholder="0.00" required
                />
              </div>
              <div className="field">
                <label>Description</label>
                <input
                  type="text"
                  value={tfForm.desc}
                  onChange={(e) => setTfForm({ ...tfForm, desc: e.target.value })}
                  placeholder="e.g. Rent payment"
                />
              </div>
              <div className="modal-btns">
                <button type="submit" className="btn-primary">Confirm Transfer</button>
                <button type="button" className="btn-ghost" onClick={() => setShowTransfer(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

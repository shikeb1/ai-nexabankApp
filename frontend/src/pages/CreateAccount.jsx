import { useState } from "react";
import { createAccount } from "../api";

export default function CreateAccount({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", initial_deposit: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(null);
    setLoading(true);
    try {
      const acc = await createAccount({
        name:            form.name,
        email:           form.email,
        initial_deposit: +form.initial_deposit || 0,
      });
      setSuccess(acc);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Account Created!</h2>
          <div className="success-detail">
            <div><span>Name</span><strong>{success.name}</strong></div>
            <div><span>Account No</span><strong>{success.account_no}</strong></div>
            <div><span>Balance</span><strong>₹{success.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
          </div>
          <div className="modal-btns">
            <button className="btn-primary" onClick={() => { setSuccess(null); setForm({ name: "", email: "", initial_deposit: "" }); }}>
              Create Another
            </button>
            <button className="btn-ghost" onClick={onCreated}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Open New Account</h1>
        <p className="page-sub">Create a NexaBank AI account in seconds</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Shaziya Khan"
              required
            />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label>Initial Deposit (₹)</label>
            <input
              name="initial_deposit"
              type="number"
              value={form.initial_deposit}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
            />
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button className="btn-primary full-width" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create Account →"}
          </button>
        </form>
      </div>
    </div>
  );
}

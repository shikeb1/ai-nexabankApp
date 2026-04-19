import { useState, useEffect, useRef } from "react";
import { getAccounts, askAI } from "../api";

const QUICK_QUESTIONS = [
  "How should I save money this month?",
  "Give me a budget plan based on my balance.",
  "Should I invest some money right now?",
  "How can I reduce my spending?",
];

export default function AIAdvisor({ selectedAccount }) {
  const [accounts, setAccounts]   = useState([]);
  const [accountId, setAccountId] = useState(selectedAccount?.id || "");
  const [messages, setMessages]   = useState([
    {
      role: "assistant",
      text: "Hello! I'm NexaBank AI — your personal financial advisor powered by Ollama LLM. Select an account and ask me anything about your finances! 🏦",
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getAccounts().then(setAccounts).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q || !accountId) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await askAI(+accountId, q);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: res.answer,
          model: res.model_used,
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Error: ${e.message}`, error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page ai-page">
      <div className="page-header">
        <h1 className="page-title">◈ AI Financial Advisor</h1>
        <p className="page-sub">Powered by Ollama (Llama 3.2) · Local LLM · Zero Data Sent to Cloud</p>
      </div>

      {/* Account selector */}
      <div className="txn-controls">
        <select
          className="select-input"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          <option value="">— Select Your Account —</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} · ₹{a.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </option>
          ))}
        </select>
      </div>

      {/* Chat window */}
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="bubble-icon">◈</div>
            )}
            <div className="bubble-content">
              <div className="bubble-text">{msg.text}</div>
              {msg.model && (
                <div className="bubble-meta">via {msg.model}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <div className="bubble-icon">◈</div>
            <div className="bubble-content">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {accountId && (
        <div className="quick-questions">
          {QUICK_QUESTIONS.map((q) => (
            <button key={q} className="quick-btn" onClick={() => sendMessage(q)} disabled={loading}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={accountId ? "Ask anything about your finances…" : "Select an account first"}
          disabled={!accountId || loading}
        />
        <button
          className="btn-primary"
          onClick={() => sendMessage()}
          disabled={!accountId || loading || !input.trim()}
        >
          {loading ? "…" : "Send →"}
        </button>
      </div>
    </div>
  );
}

const BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Something went wrong");
  }
  return res.json();
}

// ── Accounts ──────────────────────────────────────────────────────────────────
export const getAccounts      = ()       => request("/accounts/");
export const getAccount       = (id)     => request(`/accounts/${id}`);
export const createAccount    = (data)   => request("/accounts/", {
  method: "POST", body: JSON.stringify(data)
});

// ── Transactions ──────────────────────────────────────────────────────────────
export const getTransactions  = (id)     => request(`/transactions/${id}`);
export const deposit          = (data)   => request("/transactions/deposit", {
  method: "POST", body: JSON.stringify(data)
});
export const withdraw         = (data)   => request("/transactions/withdraw", {
  method: "POST", body: JSON.stringify(data)
});
export const transfer         = (data)   => request("/transactions/transfer", {
  method: "POST", body: JSON.stringify(data)
});

// ── AI ────────────────────────────────────────────────────────────────────────
export const askAI = (account_id, question) =>
  request("/ai/ask", {
    method: "POST",
    body: JSON.stringify({ account_id, question }),
  });

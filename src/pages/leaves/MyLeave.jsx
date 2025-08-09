import React, { useState, useMemo } from "react";
import "./MyLeave.css";

/**
 * Employee "My Leave" page
 * - Local sample data used; replace with API calls as explained below.
 */

const msPerDay = 1000 * 60 * 60 * 24;

function daysBetweenInclusive(fromStr, toStr) {
  const from = new Date(fromStr);
  const to = new Date(toStr);
  const diff = Math.round((to - from) / msPerDay) + 1; // inclusive
  return diff > 0 ? diff : 0;
}

const MyLeave = () => {
  // Total allowance (company policy) — change as needed or fetch from API
  const TOTAL_ALLOWANCE = 20;

  // sample initial data (replace with data from backend)
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      from: "2025-07-01",
      to: "2025-07-03",
      type: "Casual",
      reason: "Family work",
      days: 3,
      status: "Approved",
      managerComment: "",
      appliedAt: "2025-06-25",
    },
    {
      id: 2,
      from: "2025-08-01",
      to: "2025-08-02",
      type: "Sick",
      reason: "Medical",
      days: 2,
      status: "Rejected",
      managerComment: "Insufficient documentation",
      appliedAt: "2025-07-20",
    },
    {
      id: 3,
      from: "2025-09-10",
      to: "2025-09-11",
      type: "Casual",
      reason: "Personal",
      days: 2,
      status: "Pending",
      managerComment: "",
      appliedAt: "2025-08-28",
    },
  ]);

  // form state
  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "Casual",
    reason: "",
  });

  // derived totals
  const totals = useMemo(() => {
    const approvedDays = leaves
      .filter((l) => l.status === "Approved")
      .reduce((s, l) => s + (l.days || daysBetweenInclusive(l.from, l.to)), 0);
    const pendingDays = leaves
      .filter((l) => l.status === "Pending")
      .reduce((s, l) => s + (l.days || daysBetweenInclusive(l.from, l.to)), 0);
    const taken = approvedDays;
    const available = TOTAL_ALLOWANCE - approvedDays;
    return { approvedDays, pendingDays, taken, available };
  }, [leaves]);

  // handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // validation & submit
  const handleApply = (e) => {
    e.preventDefault();
    const { from, to, type, reason } = form;
    if (!from || !to) return alert("Please select both From and To dates.");
    const days = daysBetweenInclusive(from, to);
    if (days <= 0) return alert("Invalid date range.");
    const today = new Date();
    const fromDate = new Date(from);
    // prevent applying for past start date
    if (fromDate < new Date(today.toDateString())) {
      return alert("From date cannot be in the past.");
    }

    // you can choose whether pending days should reduce available immediately
    if (days > totals.available) {
      const ok = window.confirm(
        `You are requesting ${days} days but only ${totals.available} available. Proceed?`
      );
      if (!ok) return;
    }

    // build new leave object
    const newLeave = {
      id: Date.now(),
      from,
      to,
      type,
      reason,
      days,
      status: "Pending",
      managerComment: "",
      appliedAt: new Date().toISOString().slice(0, 10),
    };

    // optimistic update to UI
    setLeaves((prev) => [newLeave, ...prev]);
    setForm({ from: "", to: "", type: "Casual", reason: "" });

    // TODO: replace with API POST to /api/leaves
    // fetch("/api/leaves", { method: "POST", headers: {...}, body: JSON.stringify(newLeave) })
    alert("Leave request submitted (status: Pending).");
  };

  // helper to render status badge
  const statusClass = (s) =>
    s === "Approved" ? "badge approved" : s === "Rejected" ? "badge rejected" : "badge pending";

  return (
    <div className="my-leave-page">
      <h2>My Leave</h2>

      {/* Summary */}
      <div className="leave-summary">
        <div className="summary-card">
          <div className="label">Total Allowance</div>
          <div className="value">{TOTAL_ALLOWANCE} days</div>
        </div>
        <div className="summary-card">
          <div className="label">Taken (Approved)</div>
          <div className="value">{totals.taken} days</div>
        </div>
        <div className="summary-card">
          <div className="label">Available</div>
          <div className="value">{totals.available >= 0 ? totals.available : 0} days</div>
        </div>
        <div className="summary-card">
          <div className="label">Pending Requests</div>
          <div className="value">{totals.pendingDays} days</div>
        </div>
      </div>

      {/* Apply form */}
      <div className="apply-card">
        <h3>Apply for Leave</h3>
        <form onSubmit={handleApply} className="leave-form">
          <label>
            From
            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>

          <label>
            To
            <input type="date" name="to" value={form.to} onChange={handleChange} />
          </label>

          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Casual</option>
              <option>Sick</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </label>

          <label>
            Reason
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Short explanation for your manager"
              rows={3}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn primary">Submit Leave</button>
            <button
              type="button"
              className="btn"
              onClick={() => setForm({ from: "", to: "", type: "Casual", reason: "" })}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="history-card">
        <h3>Leave History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Applied At</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Type</th>
              <th>Status</th>
              <th>Manager Note</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.appliedAt}</td>
                <td>{l.from}</td>
                <td>{l.to}</td>
                <td>{l.days || daysBetweenInclusive(l.from, l.to)}</td>
                <td>{l.type}</td>
                <td>
                  <span className={statusClass(l.status)}>{l.status}</span>
                </td>
                <td className="mgr-note">{l.managerComment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18, color: "#555", fontSize: 13 }}>
        Note: Pending leaves do not deduct your available balance until approved. You can simulate manager
        response by editing the record in backend or using devtools (or we'll wire API next).
      </div>
    </div>
  );
};

export default MyLeave;

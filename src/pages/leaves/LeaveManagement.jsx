import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Thoufi",
      from: "2025-08-01",
      to: "2025-08-03",
      status: "Pending",
      employeeReason: "Family emergency",
      reason: "",
    },
    {
      id: 2,
      name: "Libin",
      from: "2025-07-29",
      to: "2025-07-30",
      status: "Approved",
      employeeReason: "Medical appointment",
      reason: "",
    },
    {
      id: 3,
      name: "Disha",
      from: "2025-08-05",
      to: "2025-08-06",
      status: "Rejected",
      employeeReason: "Personal work",
      reason: "Insufficient leave balance",
    },
    {
      id: 4,
      name: "Gauro",
      from: "2025-08-02",
      to: "2025-08-04",
      status: "Pending",
      employeeReason: "Sibling wedding",
      reason: "",
    },
    {
      id: 5,
      name: "Rahul",
      from: "2025-08-07",
      to: "2025-08-08",
      status: "Pending",
      employeeReason: "Doctor consultation",
      reason: "",
    },
    {
      id: 6,
      name: "raju",
      from: "2025-08-10",
      to: "2025-08-12",
      status: "Approved",
      employeeReason: "Travel",
      reason: "",
    },
  ]);

  const handleReject = (id) => {
    const rejectReason = prompt("Please enter the rejection reason:");
    if (!rejectReason) return;

    const updated = leaves.map((leave) =>
      leave.id === id
        ? { ...leave, status: "Rejected", reason: rejectReason }
        : leave
    );
    setLeaves(updated);
    alert("Leave Rejected with reason: " + rejectReason);
  };

  const handleApprove = (id) => {
    const updated = leaves.map((leave) =>
      leave.id === id ? { ...leave, status: "Approved", reason: "" } : leave
    );
    setLeaves(updated);
    alert("Leave Approved");
  };

  const columns = [
    { name: "Employee", selector: (row) => row.name, sortable: true },
    { name: "From", selector: (row) => row.from },
    { name: "To", selector: (row) => row.to },
    {
      name: "Status",
      cell: (row) => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Request Reason",
      selector: (row) => row.employeeReason || "-",
    },
    {
      name: "Rejection Reason",
      selector: (row) =>
        row.status === "Rejected" ? row.reason : "-",
    },
    {
      name: "Actions",
      cell: (row) =>
        row.status === "Pending" && (
          <div className="actions">
            <button
              className="action-btn approve"
              onClick={() => handleApprove(row.id)}
              title="Approve"
            >
              ✅
            </button>
            <button
              className="action-btn reject"
              onClick={() => handleReject(row.id)}
              title="Reject"
            >
              ❌
            </button>
          </div>
        ),
    },
  ];

  return (
    <div className="view-container">
      <h2>Leave Management</h2>
      <div className="employees-table-container">
        <DataTable columns={columns} data={leaves} pagination />
      </div>
    </div>
  );
};

export default LeaveManagement;

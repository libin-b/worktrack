import React, { useEffect, useState } from "react";
import "./DashboardHR.css";
import {
  FiUsers,
  FiBriefcase,
  FiCheck,
  FiX,
  FiDatabase,
  FiBarChart,
  FiClipboard,
} from "react-icons/fi";
import api from "../api/axios";
import { showSuccess, showError } from "../components/common/SweetAlert";

const DashboardHR = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [stats, setStats] = useState({ employees: 0, departments: 0 });

  useEffect(() => {
    fetchStats();
    fetchPendingLeaves();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/hr/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      const filteredLeaves = res.data.filter(
        (leave) => leave.status === "pending"
      );
      setPendingLeaves(filteredLeaves);
    } catch (err) {
      console.error("Error fetching pending leaves", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`);
      showSuccess("Approved", "Leave request approved");
      fetchPendingLeaves();
    } catch (err) {
      showError("Error", "Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leaves/${id}/reject`);
      showSuccess("Rejected", "Leave request rejected");
      fetchPendingLeaves();
    } catch (err) {
      showError("Error", "Failed to reject request");
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-In", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";
  };

  return (
    <div className="hr-dashboard">
      <h2>HR Dashboard</h2>

      {/* Stats cards */}
      <div className="hr-stats">
        <div className="hr-stat-card">
          <FiUsers className="hr-icon blue" />
          <div>
            <h4>{stats.employees}</h4>
            <span>Total Employees</span>
          </div>
        </div>

        <div className="hr-stat-card">
          <FiBriefcase className="hr-icon green" />
          <div>
            <h4>{stats.departments}</h4>
            <span>Total Departments</span>
          </div>
        </div>

        <div className="hr-stat-card">
          <FiClipboard className="hr-icon orange" />
          <div>
            <h4>
              {stats.tasks?.pending || 0} / {stats.tasks?.total || 0}
            </h4>
            <span>Pending Tasks</span>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="pending-leaves">
        <h3>Pending Leave Requests</h3>
        <table className="pending-leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employee.name}</td>
                  <td>{formatDate(leave.fromDate)}</td>
                  <td>{formatDate(leave.toDate)}</td>
                  <td>{leave.days}</td>
                  <td className="actions">
                    <button
                      className="action-btn approve-btn"
                      onClick={() => handleApprove(leave.id)}
                    >
                      <FiCheck />
                    </button>
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleReject(leave.id)}
                    >
                      <FiX />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-requests">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHR;

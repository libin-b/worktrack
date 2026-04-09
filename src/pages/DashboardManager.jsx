import React, { useEffect, useState } from "react";
import "./DashboardManager.css";
import { FiUsers, FiClipboard, FiCheck } from "react-icons/fi";
import api from "../api/axios";

const DashboardManager = () => {
  const [stats, setStats] = useState({
    employees: 0,
    tasks: { total: 0, pending: 0, completed: 0 },
  });
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchHighPriorityTasks();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/manager/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchHighPriorityTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const filteredTasks = res.data.content.filter(
        (task) => task.priority === "high" && task.status !== "completed"
      );
      setHighPriorityTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching high-priority tasks", err);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";
  };

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>

      {/* Stats Cards */}
      <div className="hr-stats">
        <div className="hr-stat-card">
          <FiUsers className="hr-icon blue" />
          <div>
            <h4>{stats.employees}</h4>
            <span>Total Employees</span>
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

        <div className="hr-stat-card">
          <FiCheck className="hr-icon green" />
          <div>
            <h4>{stats.tasks?.completed || 0}</h4>
            <span>Completed Tasks</span>
          </div>
        </div>
      </div>

      {/* High-Priority Pending Tasks Table */}
      <div className="high-priority-tasks">
        <h3>High-Priority Pending Tasks</h3>
        <table className="high-priority-task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedToName || "-"}</td>
                  <td className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </td>
                  <td>{formatDate(task.deadline)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-tasks">
                  No high-priority pending tasks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardManager;

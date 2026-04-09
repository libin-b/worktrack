import React from "react";
import "./DashboardEmployee.css";
import { FiCheckCircle, FiClock, FiClipboard, FiCalendar, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getUserRole } from "../utils/userRole";
import api from "../api/axios";

const DashboardEmployee = () => {
  
  // Stats
  const [taskStats, setTaskStats] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const role = getUserRole();

  useEffect(() => {
    // Fetch stats
    api.get("/tasks/my-task-stats")
      .then(res => setTaskStats(res.data))
      .catch(err => console.error("Error fetching task stats:", err));

    // Fetch recent tasks
    api.get("tasks/my-tasks", { params: { page: 0, size: 5 } })
      .then(res => setRecentTasks(res.data.content))
      .catch(err => console.error("Error fetching recent tasks:", err));
  }, []);
  // const leaveStats = { applied: 5, approved: 3 };

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
    <div className="employee-dashboard">
      <h2>Dashboard</h2>
      <p className="role"> {role.userRole}</p>

      {/* Task Stats cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <FiClipboard className="icon blue" />
          <div>
            <h4>{taskStats.pending}</h4>
            <span>Pending Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <FiClock className="icon orange" />
          <div>
            <h4>{taskStats.inProgress}</h4>
            <span>In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <FiCheckCircle className="icon green" />
          <div>
            <h4>{taskStats.completed}</h4>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Leave stats */}
      {/* <div className="stats-cards">
        <div className="stat-card">
          <FiCalendar className="icon blue" />
          <div>
            <h4>{leaveStats.applied}</h4>
            <span>Leaves Applied</span>
          </div>
        </div>
        <div className="stat-card">
          <FiCheck className="icon green" />
          <div>
            <h4>{leaveStats.approved}</h4>
            <span>Leaves Approved</span>
          </div>
        </div>
      </div> */}

      {/* Recent Tasks Table */}
      <div className="list-section">
        <h3>Recent Tasks</h3>
        <table className="recent-tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Deadline</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task, idx) => (
              <tr key={idx}>
                <td>{task.title}</td>
                <td>{formatDate(task.deadline)}</td>
                <td>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardEmployee;

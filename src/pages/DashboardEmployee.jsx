import React from "react";
import "./DashboardEmployee.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

const DashboardEmployee = () => {
  const employeeName = "Mohamed Thoufeek";
  const role = "Frontend Developer";

  // Performance Speedometer
  const performanceScore = 65; // completed %
  const performanceData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [performanceScore, 100 - performanceScore],
        backgroundColor: ["#4ade80", "#e5e7eb"], // green & grey
        borderWidth: 0,
      },
    ],
  };

  const performanceOptions = {
    rotation: -90, // half circle start
    circumference: 180, // half circle
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: true,
        formatter: (value, ctx) =>
          ctx.dataIndex === 0 ? `${performanceScore}%` : "",
        color: "#111",
        font: { size: 18, weight: "bold" },
      },
    },
  };

  // Leave Status Column Chart
  const leaveData = {
    labels: ["Applied", "Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Leave Count",
        data: [5, 3, 1, 1],
        backgroundColor: ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"],
        borderRadius: 6,
      },
    ],
  };

  const leaveOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // Recently Received Tasks
  const recentTasks = [
    { title: "Update Landing Page", deadline: "2025-08-10", priority: "High" },
    { title: "Fix Login Bug", deadline: "2025-08-12", priority: "Medium" },
  ];

  // Ongoing Tasks
  const ongoingTasks = [
    { title: "Client Portal Redesign", status: "In Progress" },
    { title: "Performance Optimization", status: "Pending" },
  ];

  // Messages from Clients
  const clientMessages = [
    { client: "Acme Corp", message: "Great work on the new dashboard!" },
    {
      client: "Tech Solutions",
      message: "Please check the issue on reports page.",
    },
  ];

  return (
    <div className="employee-dashboard">
      <h2>Welcome, {employeeName}</h2>
      <p className="role">Role: {role}</p>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h4>Performance</h4>
          <Doughnut data={performanceData} options={performanceOptions} />
        </div>
        <div className="chart-card">
          <h4>Leave Status</h4>
          <Bar data={leaveData} options={leaveOptions} />
        </div>
      </div>

      {/* Recently Received Tasks */}
      <div className="list-section">
        <h3>Recently Received Tasks</h3>
        <ul>
          {recentTasks.map((task, index) => (
            <li key={index}>
              <strong>{task.title}</strong> – Deadline: {task.deadline} (
              {task.priority})
            </li>
          ))}
        </ul>
      </div>

      {/* Ongoing Tasks */}
      <div className="list-section">
        <h3>Ongoing Tasks</h3>
        <ul>
          {ongoingTasks.map((task, index) => (
            <li key={index}>
              <strong>{task.title}</strong> – Status: {task.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Client Messages */}
      <div className="list-section">
        <h3>Messages from Clients</h3>
        <ul>
          {clientMessages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.client}</strong>: {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardEmployee;

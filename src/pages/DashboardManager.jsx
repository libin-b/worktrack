import React from "react";
import "./DashboardManager.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardManager = () => {
  const performanceData = [
    { name: "Thoufi", value: 40 },
    { name: "Libin", value: 30 },
    { name: "Gauro", value: 20 },
    { name: "Disha", value: 10 },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

  const queries = [
    { id: 1, client: "Amazon", query: "Need update on project A" },
    { id: 2, client: "H&M", query: "Still getting the same Bug" },
    { id: 3, client: "walmart", query: "Add new feature request" },
    { id: 3, client: "Zoho", query: "waiting for final output" },
  ];

  return (
    <div className="manager-dashboard">
      <h1>Welcome, Manager!</h1>

      {/* Top Performer Chart */}
      <div className="chart-box">
        <h3>Top Performer Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={performanceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {performanceData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Client Queries Table */}
      <div className="queries-section">
        <h3>Client Queries</h3>
        <table className="queries-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Query</th>
              <th>Assign To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q.id}>
                <td>{q.client}</td>
                <td>{q.query}</td>
                <td>
                  <select>
                    <option>Select Employee</option>
                    <option>Thoufi</option>
                    <option>libin</option>
                    <option>Gauro</option>
                    <option>Disha</option>
                  </select>
                </td>
                <td>
                  <button>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardManager;

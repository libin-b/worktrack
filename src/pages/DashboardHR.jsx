import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import './DashboardHR.css';
import { useNavigate } from 'react-router-dom';

const DashboardHR = () => {
  const navigate = useNavigate();

  // Sample data for pie chart
  const teamData = [
    { name: 'Development', value: 15 },
    { name: 'Design', value: 10 },
    { name: 'QA', value: 5 },
    { name: 'HR', value: 3 },
  ];

  // Sample data for bar chart
  const leaveData = [
    { team: 'Development', leaves: 8 },
    { team: 'Design', leaves: 4 },
    { team: 'QA', leaves: 3 },
    { team: 'HR', leaves: 2 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="hr-dashboard">
      <h1>Welcome, HR!</h1>
      <p>This is our HR dashboard — we will enhance it with more features soon.</p>

      <div className="dashboard-cards">
        <div className="card clickable" onClick={handleCalendarClick}>
          <h3>📅 Calendar</h3>
          <p>View tasks, leaves & shift plans</p>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <h3>Team Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {teamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Team-wise Leave Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leaves" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHR;

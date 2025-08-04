import React from "react";
import "./DashboardEmployee.css";

const DashboardEmployee = () => {
  // Sample data (in real apps, you would fetch this from backend)
  const employeeName = " XYZ ";
  const role = "Frontend Developer";

  const taskSummary = {
    total: 12,
    completed: 9,
    pending: 3,
  };

  const leaveStatus = {
    applied: 5,
    approved: 3,
    rejected: 1,
    pending: 1,
  };

  const meetings = [
    {
      title: "Client Update",
      date: "2025-08-05",
      time: "10:30 AM",
    },
    {
      title: "General Meeting",
      date: "2025-08-07",
      time: "3:00 PM",
    },
  ];

  const performance = {
    errorFreeTasks: 10,
    timelyQueries: 8,
    saturdayWork: 3,
    noLeaveDays: 15,
  };

  return (
    <div className="employee-dashboard">
      <h2>Welcome, {employeeName}</h2>
      <p className="role">Role: {role}</p>

      {/* Task Summary */}
      <div className="dashboard-cards">
        <div className="card">
          <h4>Tasks</h4>
          <p>Total: {taskSummary.total}</p>
          <p>Completed: {taskSummary.completed}</p>
          <p>Pending: {taskSummary.pending}</p>
        </div>

        {/* Leave Status */}
        <div className="card">
          <h4>Leave Status</h4>
          <p>Applied: {leaveStatus.applied}</p>
          <p>Approved: {leaveStatus.approved}</p>
          <p>Rejected: {leaveStatus.rejected}</p>
          <p>Pending: {leaveStatus.pending}</p>
        </div>

        {/* Performance */}
        <div className="card">
          <h4>Performance</h4>
          <p>Tasks without Errors: {performance.errorFreeTasks}</p>
          <p>Client Queries on Time: {performance.timelyQueries}</p>
          <p>Saturday Work Days: {performance.saturdayWork}</p>
          <p>No Leave Days: {performance.noLeaveDays}</p>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="meetings-section">
        <h3>Upcoming Meetings</h3>
        {meetings.length === 0 ? (
          <p>No upcoming meetings.</p>
        ) : (
          <ul>
            {meetings.map((meet, index) => (
              <li key={index}>
                <strong>{meet.title}</strong> – {meet.date} at {meet.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardEmployee;

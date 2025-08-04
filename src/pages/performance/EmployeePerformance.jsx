import React from "react";
import "./EmployeePerformance.css";

const EmployeePerformance = () => {
  const performanceData = [
    {
      name: "Thoufi",
      tasksCompleted: 24,
      noErrors: true,
      clientQueries: 15,
      saturdayWork: true,
      noLeave: true,
    },
    {
      name: "Libin",
      tasksCompleted: 18,
      noErrors: false,
      clientQueries: 9,
      saturdayWork: false,
      noLeave: false,
    },
    {
      name: "Disha",
      tasksCompleted: 18,
      noErrors: false,
      clientQueries: 9,
      saturdayWork: false,
      noLeave: false,
    },
    {
      name: "Gauro",
      tasksCompleted: 30,
      noErrors: true,
      clientQueries: 20,
      saturdayWork: true,
      noLeave: true,
    },
  ];

  return (
    <div className="performance-container">
      <h2>Employee Performance Overview</h2>
      <div className="card-grid">
        {performanceData.map((emp, index) => (
          <div className="performance-card" key={index}>
            <h3>{emp.name}</h3>
            <p><strong>Tasks Completed:</strong> {emp.tasksCompleted}</p>
            <p>
              <strong>No Errors:</strong>{" "}
              {emp.noErrors ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Client Queries:</strong> {emp.clientQueries}
            </p>
            <p>
              <strong>Saturday Work:</strong>{" "}
              {emp.saturdayWork ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>No Leaves:</strong>{" "}
              {emp.noLeave ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePerformance;

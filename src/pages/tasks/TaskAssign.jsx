// src/pages/tasks/TaskAssign.jsx
import React from "react";
import "./TaskAssign.css";

const TaskAssign = () => {
  const tasks = [
    {
      id: 1,
      employee: "John Doe",
      task: "Complete UI for Leave Module",
      deadline: "2025-08-01",
      status: "Pending",
      reason: "Waiting for backend API",
    },
    {
      id: 2,
      employee: "Priya K",
      task: "Design meeting dashboard",
      deadline: "2025-07-31",
      status: "Completed",
      reason: "",
    },
    {
      id: 3,
      employee: "Ahmed M",
      task: "Update performance KPIs",
      deadline: "2025-08-03",
      status: "Pending",
      reason: "Needs clarification from HR",
    },
  ];

  return (
    <div className="task-assign-page">
      <h2>Assigned Tasks</h2>
      <table className="task-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Task</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Pending Reason</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.employee}</td>
              <td>{task.task}</td>
              <td>{task.deadline}</td>
              <td className={task.status === "Pending" ? "pending" : "completed"}>
                {task.status}
              </td>
              <td>{task.status === "Pending" ? task.reason : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskAssign;

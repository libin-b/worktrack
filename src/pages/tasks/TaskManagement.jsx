import React, { useState } from "react";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      employee: "John Doe",
      description: "Design UI for HR dashboard",
      deadline: "2025-08-04T17:00",
      priority: "High",
      status: "Pending",
      reason: "",
      delayReasonFromEmployee: "Waiting for client approval"
    },
    {
      id: 2,
      employee: "Priya K",
      description: "Fix bugs in employee login",
      deadline: "2025-08-01T12:00",
      priority: "Medium",
      status: "Completed",
      reason: "",
      delayReasonFromEmployee: ""
    },
  ]);

  const [form, setForm] = useState({
    employee: "",
    description: "",
    deadline: "",
    priority: "Low",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = () => {
    if (!form.employee || !form.description || !form.deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        ...form,
        status: "Pending",
        reason: "",
        delayReasonFromEmployee: ""
      },
    ]);

    setForm({ employee: "", description: "", deadline: "", priority: "Low" });
  };

  const handleReassign = (id) => {
    const reason = prompt("Why is this task delayed or needs reassignment?");
    if (!reason) return;

    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, reason, status: "Pending" } : t
    ));
  };

  const formatDateTime = (str) => new Date(str).toLocaleString();

  return (
    <div className="task-mgmt-page">
      <h2>Task Management</h2>

      {/* Form to Assign Task */}
      <div className="assign-form">
        <h3>Assign New Task</h3>
        <input
          name="employee"
          placeholder="Employee Name"
          value={form.employee}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High (Urgent)</option>
        </select>
        <button onClick={handleAssign}>Assign Task</button>
      </div>

      {/* Table to Show Tasks */}
      <div className="task-list">
        <h3>All Assigned Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Employee Delay Reason</th>
              <th>Manager Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={task.priority === "High" ? "urgent" : ""}
              >
                <td>{task.employee}</td>
                <td>{task.description}</td>
                <td>{formatDateTime(task.deadline)}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.delayReasonFromEmployee || "-"}</td>
                <td>{task.reason || "-"}</td>
                <td>
                  {task.status !== "Completed" && (
                    <button onClick={() => handleReassign(task.id)}>
                      Reassign / Add Remark
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManagement;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import "./AssignTask.css";
import api from "../../api/axios";
import { showError, showSuccess } from "../../components/common/SweetAlert";

const AssignTask = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    task: "",
    deadline: "",
    priority: "medium",
    description: "",
  });

  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    api
      .get("/employees/simple-by-role?role=employee")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/tasks", formData)
      .then((response) => {
        setEmployees(response.data);
        showSuccess("Success", "Task assigned successfully!");
        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        showError("Error", "Failed to assign task.");
      });
  };

  const breadcrumbItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Task Management", onClick: () => navigate("/tasks") },
    { label: "Assign Task" },
  ];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Assign New Task</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="assignedToId">Employee</label>
              <select
                id="assignedToId"
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleInputChange}
                required
              >
                <option value="" hidden>
                  Select Employee
                </option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add task details, requirements, or notes..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;

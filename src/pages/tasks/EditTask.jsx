import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import "./AssignTask.css";
import api from "../../api/axios";
import { showError, showSuccess } from "../../components/common/SweetAlert";

const EditTask = () => {
  const { taskId } = useParams(); // get task id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assignedToId: "",
    title: "",
    deadline: "",
    priority: "medium",
    description: "",
  });

  const [employees, setEmployees] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch employees for dropdown
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

  // Fetch task details
  useEffect(() => {
    if (taskId) {
      api
        .get(`/tasks/${taskId}`)
        .then((response) => {
          setFormData({
            assignedToId: response.data.assignedToId || "",
            title: response.data.title || "",
            deadline: response.data.deadline ? response.data.deadline.split("T")[0] : "",
            priority: response.data.priority || "medium",
            description: response.data.description || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching task:", error);
          showError("Error", "Failed to load task details.");
        });
    }
  }, [taskId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put(`/tasks/${taskId}`, formData) 
      .then(() => {
        showSuccess("Success", "Task updated successfully!");
        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        showError("Error", "Failed to update task.");
      });
  };

  const breadcrumbItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Task Management", onClick: () => navigate("/tasks") },
    { label: "Edit Task" },
  ];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Edit Task</h2>

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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;

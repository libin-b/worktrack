import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import './AssignTask.css';

const AssignTask = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    task: '',
    deadline: '',
    priority: 'medium',
    description: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, this would make an API call to save the task
    // Then navigate back to the tasks list
    navigate('/tasks');
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Task Management', onClick: () => navigate('/tasks') },
    { label: 'Assign Task' }
  ];

  // Mock employee data - in a real app, this would come from an API
  const employees = [
    { id: 1, name: 'Thoufi' },
    { id: 2, name: 'Libin' },
    { id: 3, name: 'Disha' },
    { id: 4, name: 'Gauro' },
    { id: 5, name: 'kumar' },
  ];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Assign New Task</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="employeeName">Employee</label>
              <select
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task">Task Title</label>
              <input
                type="text"
                id="task"
                name="task"
                value={formData.task}
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
                min={new Date().toISOString().split('T')[0]}
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

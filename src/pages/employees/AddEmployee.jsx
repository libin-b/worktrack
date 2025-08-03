import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import './AddEmployee.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    emailId: '',
    contactNumber: '',
    selectRole: '',
    department: '',
    joiningDate: '',
    status: 'active'
  });

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Research & Development'
  ];

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
    // Handle form submission logic here
  };

  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Employees', onClick: () => navigate('/employees') },
    { label: 'Add Employees' }
  ];

  return (
    <div className="add-employee-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Add New Employee</h2>
        
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeId">Employee Id</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                placeholder="Enter employee ID"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emailId">Email Id</label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                placeholder="Enter email address"
                autoComplete="email"
                value={formData.emailId}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter phone number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="selectRole">Select Role</label>
              <select
                id="selectRole"
                name="selectRole"
                value={formData.selectRole}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="joiningDate">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                max={new Date().toISOString().split('T')[0]}
                placeholder="Select joining date"
                value={formData.joiningDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* <div className="form-group">
              <label>Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-text">Active</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-text">Inactive</span>
                </label>
              </div> */}
            {/* </div> */}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;

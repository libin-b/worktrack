import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showSuccess, showError } from '../../components/common/SweetAlert';
import Breadcrumb from '../../components/common/Breadcrumb';
import './AddEmployee.css';
import api from '../../api/axios';

const EditEmployee = () => {
  const { employeeId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    emailId: '',
    contactNumber: '',
    selectJobRole: '',
    department: '',
    joiningDate: '',
    selectUserRole: '',
    status: 'active'
  });

  useEffect(() => {
    api.get('/departments')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

    api.get('/job-roles')
      .then(response => {
        setJobRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching job roles:', error);
      });
  }, []);

  useEffect(() => {
    if(employeeId) {
      api.get(`/employees/${employeeId}`)
        .then(response => {
          setFormData({
            employeeCode: response.data.employeeCode,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            emailId: response.data.email,
            contactNumber: response.data.phone,
            selectJobRole: response.data.jobRoleId,
            department: response.data.departmentId,
            joiningDate: response.data.joinDate,
            selectUserRole: response.data.userRole
          });
          console.log('Employee details fetched successfully:', response.data);
        })
        .catch(error => {
        console.error('Error fetching employee details:', error);
      });
    }
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      employeeCode: formData.employeeCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.contactNumber,
      email: formData.emailId,  
      departmentId: formData.department,
      jobRoleId: formData.selectJobRole,
      joinDate: formData.joiningDate,
      userRole: formData.selectUserRole
    };
    api.put(`/employees/${employeeId}`, payload)
      .then(response => {
        console.log('Employee updated successfully:', response.data);
        showSuccess('Success', 'Employee updated successfully!');
        navigate('/employees');
      })
      .catch(error => {
        showError('Error', 'Failed to update employee.');
        console.error('Error updating employee:', error);
      });
  };

  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Employees', onClick: () => navigate('/employees') },
    { label: 'Edit Employee' }
  ];

  return (
    <div className="add-employee-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Edit Employee</h2>
        
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeCode">Employee Code</label>
              <input
                type="text"
                id="employeeCode"
                name="employeeCode"
                placeholder="Enter employee code"
                value={formData.employeeCode}
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
              <label htmlFor="selectJobRole">Select Job Role</label>
              <select
                id="selectJobRole"
                name="selectJobRole"
                value={formData.selectJobRole}
                onChange={handleInputChange}
                required
              >
                <option value="" hidden>Select Job Role</option>
                {jobRoles.map((role, index) => (
                  <option key={index} value={role.id}>
                    {role.name}
                  </option>
                ))}
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
                <option value="" hidden>Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="selectUserRole">Select User Role</label>
              <select
                id="selectUserRole"
                name="selectUserRole"
                value={formData.selectUserRole}
                onChange={handleInputChange}
                required
              >
                <option value="" hidden>Select User Role</option>
                <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
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

export default EditEmployee;

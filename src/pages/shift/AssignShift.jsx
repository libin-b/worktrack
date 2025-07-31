import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import './AssignShift.css';

const AssignShift = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    fromDate: '',
    shiftType: '',
  });


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
    { label: 'Shift Management', onClick: () => navigate('/shift') },
    { label: 'Assign Shift' }
  ];

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="form-container">
        <h2 className="form-title">Assign Shift</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employeeName">Employee Name</label>
              <select
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Employee</option>
                <option value="Thoufi">Thoufi</option>
                <option value="Libin">Libin</option>
                <option value="Gauro">Gauro</option>
                <option value="Disha">Disha</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fromDate">From Date</label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shiftType">Shift Type</label>
              <select
                id="shiftType"
                name="shiftType"
                value={formData.shiftType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Shift Type</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
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

export default AssignShift;

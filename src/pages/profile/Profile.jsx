import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import userImage from '../../assets/images/user.png';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Libin',
    lastName: 'B',
    email: 'test@example.com',
    phone: '+91 1234567890',
    employeeId: 'EMP-001',
    department: 'Engineering',
    position: 'Software developer',
    joinDate: '2022-01-15',
    address: '123 Tech Park, Silicon Valley, CA 94025'
  });

  const [profileImage, setProfileImage] = useState(userImage);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Profile' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the profile in your backend
    console.log('Profile updated:', formData);
    // After successful update, exit edit mode
    setIsEditing(false);
  };

  // Reset form when canceling edit
  const handleCancel = () => {
    // Reset any changes made during editing
    // In a real app, you might want to fetch the latest data from the server
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="page-title">My Profile</h1>
      
      <div className="profile-page-content">
        {/* Sidebar with profile picture */}
        <div className="profile-sidebar">
          <div className="profile-header">
            <div className="profile-image-container">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image"
              />
              {isEditing && (
                <div className="image-upload-overlay">
                  <label htmlFor="profile-image-upload" className="upload-button">
                    Change Photo
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
            <div className="profile-header-info">
              <h2>{`${formData.firstName} ${formData.lastName}`}</h2>
              <p className="text-muted">{formData.position}</p>
              <p className="text-muted">{formData.department} Department</p>
              <button 
                className={`edit-profile-btn ${isEditing ? 'hidden' : ''}`}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="profile-main-content">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-form-section">
              <h3>Personal Information</h3>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled="true"
                  />
                </div>
                <div className="profile-form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    disabled={true}
                  />
                </div>
                <div className="profile-form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="profile-form-grid">
                <div className="profile-form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="profile-form-actions">
                <button 
                  type="button" 
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="profile-save-btn"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

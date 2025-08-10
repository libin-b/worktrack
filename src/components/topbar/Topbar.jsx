import { useState, useRef, useEffect } from 'react';
import "./Topbar.css";
import { FaBell, FaSearch, FaUserCog, FaEnvelope, FaSignOutAlt, FaChevronDown, FaCircle, FaRegBell, FaRegEnvelope, FaRegClock } from 'react-icons/fa';
import userImage from '../../assets/images/user.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: Complete project proposal',
    time: '2 hours ago',
    read: false,
    icon: <FaRegClock className="notification-icon" />,
    type: 'task'
  },
  {
    id: 2,
    title: 'Leave Approved',
    message: 'Your leave request for August 15-17 has been approved',
    time: '1 day ago',
    read: true,
    icon: <FaRegEnvelope className="notification-icon" />,
    type: 'leave'
  },
  {
    id: 3,
    title: 'New Message',
    message: 'You have a new message from John Doe',
    time: '2 days ago',
    read: true,
    icon: <FaRegEnvelope className="notification-icon" />,
    type: 'message'
  }
];

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => !n.read).length);
  const isDashboard = useLocation().pathname.includes('/dashboard');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
    navigate('/'); // Assuming you have a navigate function to redirect to the login page
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const toggleNotification = () => {
    if (!isNotificationOpen) {
      // Mark all as read when opening
      const updatedNotifications = notifications.map(n => ({
        ...n,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click (e.g., navigate to related page)
    console.log('Notification clicked:', notification);
    
    // Mark as read if not already read
    if (!notification.read) {
      const updatedNotifications = notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    }
    
    // Close the dropdown
    setIsNotificationOpen(false);
  };
  
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({
      ...n,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="topbar">
      { isDashboard && (
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      )}
      <div className="topbar-right">
        <div className="notification-wrapper" ref={notificationRef}>
          <div 
            className={`icon-wrapper ${unreadCount > 0 ? 'has-notification' : ''}`}
            onClick={toggleNotification}
          >
            <FaBell className="icon" />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </div>
          
          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button 
                  className="mark-all-read"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAllAsRead();
                  }}
                >
                  Mark all as read
                </button>
              </div>
              
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        {notification.icon}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">
                          <h5>{notification.title}</h5>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    No new notifications
                  </div>
                )}
              </div>
              
              <div className="notification-footer">
                <button 
                  className="view-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(false);
                    navigate('/notifications');
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`profile-wrapper ${isDropdownOpen ? 'active' : ''}`} ref={dropdownRef}>
          <div className="profile-container" onClick={toggleDropdown}>
            <img src={userImage} alt="User" className="profile-img" />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleProfileClick}>
                <FaUserCog className="dropdown-icon" />
                <span>Profile Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

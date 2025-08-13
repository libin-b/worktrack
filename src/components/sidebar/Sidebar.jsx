import { Link, useLocation } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUserFriends,
  FaUserPlus,
  FaEnvelope,
  FaChartBar,
  FaTachometerAlt,
  FaTasks,
  FaUsersCog,
  FaClipboardList,
} from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  // Detect role 
  const userRole = localStorage.getItem('userRole');

  const isManager = userRole === 'manager';
  const isEmployee = userRole === 'employee';
  // const isHR = userRole === 'hr';

  if (!userRole) {
    return null; 
  }


  // Sidebar links
  const hrLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { to: '/employees', label: 'Overall Employees', icon: <FaUserFriends /> },
    { to: '/add-employee', label: 'Add New Employee', icon: <FaUserPlus /> },
    { to: '/leave', label: 'Leave Management', icon: <FaCalendarAlt /> },
    // { to: '/messages', label: 'Messages from Employee', icon: <FaEnvelope /> },
    { to: '/performance', label: 'View Performance', icon: <FaChartBar /> },
  ];

  const managerLinks = [
    { to: '/dashboard/manager', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { to: '/tasks', label: 'Task Management', icon: <FaTasks /> },
    { to: '/shift', label: 'Shift Management', icon: <FaUsersCog /> },
    { to: '/leave', label: 'Leave Approvals', icon: <FaCalendarAlt /> },
    { to: '/meetings', label: 'Meeting Planning', icon: <FaUsersCog /> },
    { to: '/performance', label: 'Employee Performance', icon: <FaChartBar /> },
  ];

  const employeeLinks = [
    { to: '/dashboard/employee', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/calendar', label: 'My Calendar', icon: <FaCalendarAlt /> },
    { to: '/leave-history', label: 'My Leaves', icon: <FaClipboardList /> },
    { to: '/performance', label: 'My Performance', icon: <FaChartBar /> },
  ];

  const links = isManager ? managerLinks : isEmployee ? employeeLinks : hrLinks;

  return (
    <aside className="main-sidebar">
      <div className="sidebar-title">WorkTrack</div>
      <nav className="nav-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-item ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

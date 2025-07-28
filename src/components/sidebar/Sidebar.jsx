import { Link, useLocation } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUserFriends,
  FaUserPlus,
  FaEnvelope,
  FaChartBar,
  FaTachometerAlt
} from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="main-sidebar">
      <div className="sidebar-title">WorkTrack</div>
      <nav className="nav-links">
        <Link
          to="/dashboard"
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <FaTachometerAlt className="nav-icon" />
          Dashboard
        </Link>
        <Link
          to="/calendar"
          className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
        >
          <FaCalendarAlt className="nav-icon" />
          Calendar
        </Link>
        <Link
          to="/employees"
          className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`}
        >
          <FaUserFriends className="nav-icon" />
          Overall Employees
        </Link>
        <Link
          to="/add-employee"
          className={`nav-item ${location.pathname === '/add-employee' ? 'active' : ''}`}
        >
          <FaUserPlus className="nav-icon" />
          Add New Employee
        </Link>
        <Link
          to="/leave"
          className={`nav-item ${location.pathname === '/leave' ? 'active' : ''}`}
        >
          <FaCalendarAlt className="nav-icon" />
          Leave Management
        </Link>
        <Link
          to="/messages"
          className={`nav-item ${location.pathname === '/messages' ? 'active' : ''}`}
        >
          <FaEnvelope className="nav-icon" />
          Messages from Employee
        </Link>
        <Link
          to="/performance"
          className={`nav-item ${location.pathname === '/performance' ? 'active' : ''}`}
        >
          <FaChartBar className="nav-icon" />
          View Performance
        </Link>
      </nav>
    </aside>
  );
}

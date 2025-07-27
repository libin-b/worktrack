import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaUserFriends, FaChartBar } from 'react-icons/fa';
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
          Employees
        </Link>
        <Link
          to="/leave"
          className={`nav-item ${location.pathname === '/leave' ? 'active' : ''}`}
        >
          <FaCalendarAlt className="nav-icon" />
          Leave Management
        </Link>
        <Link
          to="/kpi"
          className={`nav-item ${location.pathname === '/kpi' ? 'active' : ''}`}
        >
          <FaChartBar className="nav-icon" />
          KRA / KPI
        </Link>
      </nav>
    </aside>
  );
}

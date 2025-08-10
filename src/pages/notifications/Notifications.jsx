import React, { useMemo, useState } from 'react';
import './Notifications.css';
import { FaRegClock, FaRegEnvelope, FaBell, FaCheckCircle, FaFilter, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';

// Temporary mock data. If you later add a store/API, wire it here.
const DEFAULT_NOTIFICATIONS = [
  { id: 1, title: 'New Task Assigned', message: 'You have been assigned a new task: Complete project proposal', time: '2 hours ago', read: false, type: 'task', icon: <FaRegClock /> },
  { id: 2, title: 'Leave Approved', message: 'Your leave request for August 15-17 has been approved', time: '1 day ago', read: true, type: 'leave', icon: <FaRegEnvelope /> },
  { id: 3, title: 'New Message', message: 'You have a new message from John Doe', time: '2 days ago', read: true, type: 'message', icon: <FaRegEnvelope /> },
  { id: 4, title: 'System Update', message: 'Timesheet module will be under maintenance tonight 11PM-12AM', time: '3 days ago', read: false, type: 'system', icon: <FaBell /> }
];

const TYPE_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'task', label: 'Tasks' },
  { key: 'leave', label: 'Leaves' },
  { key: 'message', label: 'Messages' },
  { key: 'system', label: 'System' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all'); // all | unread | read
  const [type, setType] = useState('all');
  const [items, setItems] = useState(DEFAULT_NOTIFICATIONS);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(n => {
      const matchesQuery = !q || `${n.title} ${n.message}`.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || (status === 'unread' ? !n.read : n.read);
      const matchesType = type === 'all' || n.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [items, query, status, type]);

  const breadcrumbItems = [
    { label: 'Home' , onclick: () => navigate('/') },
    { label: 'Notifications' }
  ];

  const unreadCount = items.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const toggleRead = (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="notifications-page-container">
      <Breadcrumb items={breadcrumbItems} />
      <h2 className="page-title">Notifications</h2>

      <div className="notifications-toolbar">
        <div className="search-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notifications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="status-filter">
            <button className={`chip ${status === 'all' ? 'active' : ''}`} onClick={() => setStatus('all')}>All</button>
            <button className={`chip ${status === 'unread' ? 'active' : ''}`} onClick={() => setStatus('unread')}>Unread</button>
            <button className={`chip ${status === 'read' ? 'active' : ''}`} onClick={() => setStatus('read')}>Read</button>
          </div>

          <div className="type-filter">
            {TYPE_OPTIONS.map(opt => (
              <button key={opt.key} className={`chip ${type === opt.key ? 'active' : ''}`} onClick={() => setType(opt.key)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-actions">
          <button className="btn btn-secondary" onClick={markAllAsRead} disabled={!unreadCount}>
            <FaCheckCircle />
            <span>Mark all as read</span>
          </button>
          <button className="btn btn-ghost" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <div className="notifications-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <FaFilter className="empty-icon" />
            <p>No notifications match your filters.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filtered.map(n => (
              <div key={n.id} className={`notification-row ${n.read ? 'read' : 'unread'}`} onClick={() => toggleRead(n.id)}>
                <div className={`notif-icon ${n.type}`}>{n.icon}</div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <h4>{n.title}</h4>
                    <span className="time">{n.time}</span>
                  </div>
                  <div className="notif-message">{n.message}</div>
                </div>
                {!n.read && <span className="dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiCalendar, FiFilter, FiChevronLeft, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import './LeaveManagement.css';

// Mock data - in a real app, this would come from an API
const mockLeaves = [
  {
    id: 'LV001',
    employee: 'John Doe',
    leaveType: 'Annual Leave',
    fromDate: '2023-07-15',
    toDate: '2023-07-17',
    days: 3,
    reason: 'Family vacation',
    status: 'Pending'
  },
  {
    id: 'LV002',
    employee: 'Jane Smith',
    leaveType: 'Sick Leave',
    fromDate: '2023-07-20',
    toDate: '2023-07-20',
    days: 1,
    reason: 'Medical appointment',
    status: 'Approved'
  },
  {
    id: 'LV003',
    employee: 'Robert Johnson',
    leaveType: 'Casual Leave',
    fromDate: '2023-07-25',
    toDate: '2023-07-26',
    days: 2,
    reason: 'Personal work',
    status: 'Rejected'
  },
  {
    id: 'LV004',
    employee: 'Emily Davis',
    leaveType: 'Work From Home',
    fromDate: '2023-08-01',
    toDate: '2023-08-01',
    days: 1,
    reason: 'Home maintenance',
    status: 'Pending'
  },
  {
    id: 'LV005',
    employee: 'Michael Brown',
    leaveType: 'Annual Leave',
    fromDate: '2023-08-10',
    toDate: '2023-08-15',
    days: 5,
    reason: 'Summer vacation',
    status: 'Pending'
  }
];

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [leaves, setLeaves] = useState(mockLeaves);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Leave Management' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = (leaveId) => {
    setLeaves(leaves.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'Approved' } : leave
    ));
  };

  const handleReject = (leaveId) => {
    setLeaves(leaves.map(leave => 
      leave.id === leaveId ? { ...leave, status: 'Rejected' } : leave
    ));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Define columns for the data table
  const columns = [
    {
      name: 'Employee',
      selector: row => row.employee,
      sortable: true,
    },
    {
      name: 'Leave Type',
      selector: row => row.leaveType,
      sortable: true,
    },
    {
      name: 'From Date / To Date',
      cell: row => (
        <div>
          <div>{formatDate(row.fromDate)}</div>
          <div className="text-muted small">to {formatDate(row.toDate)}</div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
    },
    {
      name: 'No. of Days',
      selector: row => row.days,
      sortable: true,
      center: true,
    },
    {
      name: 'Reason',
      selector: row => row.reason,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="actions">
          {row.status === 'Pending' ? (
            <>
              <button 
                className="action-btn approve"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(row.id);
                }}
                title="Approve"
              >
                <FiCheck />
              </button>
              <button 
                className="action-btn reject"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(row.id);
                }}
                title="Reject"
              >
                <FiX />
              </button>
            </>
          ) : (
            <span className="action-text">
              {row.status === 'Approved' ? 'Approved' : 'Rejected'}
            </span>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Filter leaves based on search query and date range
  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      const matchesSearch = 
        leave.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
      
      const fromDateFilter = fromDate ? new Date(leave.fromDate) >= new Date(fromDate) : true;
      const toDateFilter = toDate ? new Date(leave.toDate) <= new Date(toDate) : true;
      
      return matchesSearch && fromDateFilter && toDateFilter;
    });
  }, [leaves, searchQuery, fromDate, toDate]);

  // Pagination
  const indexOfLastLeave = currentPage * rowsPerPage;
  const indexOfFirstLeave = indexOfLastLeave - rowsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

  // Handle row click
  const handleRowClicked = (row) => {
    // Navigate to leave details or edit page if needed
    console.log(`Row clicked: ${row.id}`);
  };

  // Custom styles for the data table
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        minHeight: '52px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '24px',
        paddingRight: '24px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#A3AED0',
      },
    },
    cells: {
      style: {
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #edf2f7',
        },
      },
    },
  };

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />
      <h2>Leave Management</h2>
      
      <div className="table-filter-container">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search leaves..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="date-filters">
          <div className="date-filter">
            <span>From Date</span>
            <div className="date-input">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          
          <div className="date-filter">
            <span>To Date</span>
            <div className="date-input">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          
          <button className="filter-btn">
            <FiFilter />
            Filter
          </button>
        </div>
      </div>
      
      <div className="employees-table-container">
        <DataTable
          columns={columns}
          data={currentLeaves}
          customStyles={customStyles}
          onRowClicked={handleRowClicked}
          pagination
          paginationServer
          paginationTotalRows={filteredLeaves.length}
          paginationPerPage={rowsPerPage}
          paginationComponentOptions={{
            rowsPerPageText: 'Rows per page:',
            rangeSeparatorText: 'of',
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: 'All',
          }}
          paginationIconNext={
            <span className="pagination-arrow">
              <FiChevronRight />
            </span>
          }
          paginationIconPrevious={
            <span className="pagination-arrow">
              <FiChevronLeft />
            </span>
          }
          className="data-table"
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default LeaveManagement;

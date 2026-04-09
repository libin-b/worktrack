import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import api from '../../api/axios';
import { showError } from '../../components/common/SweetAlert';
import './LeaveManagement.css';
import { getUserRole } from "../../utils/userRole";
import { getAuthUser } from "../../utils/authUser";

const LeaveHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { userRole, isEmployee, isManager } = getUserRole();
  const { authUser } = getAuthUser();


  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Leave History' }
  ];

  // Fetch leave history for authenticated user
  const fetchMyLeaves = () => {
    api.get('/leaves/my-leaves')
      .then(res => {
        const leavesData = res.data;
        if (Array.isArray(leavesData)) {
          setLeaves(leavesData);
        } else if (leavesData && Array.isArray(leavesData.leaves)) {
          setLeaves(leavesData.leaves);
        } else {
          setLeaves([]);
        }
      })
      .catch(err => {
        console.error("Error fetching leave history:", err);
        showError("Error", "Failed to load leave history");
        setLeaves([]); // Ensure component doesn't crash
      });
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNewLeaveClick = () => {
    navigate('/calendar');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const columns = [
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
      cell: row => <div style={{ textAlign: 'center' }}>{row.days}</div>,
    },
    {
      name: 'Reason',
      selector: row => row.reason,
      sortable: true,
    },
    {
      name: 'Status',
      cell: row => (
        <div className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Rejection Reason',
      selector: row => row.managerComment || '-',
      cell: row => (
        <div>{row.status === 'rejected' && row.managerComment ? row.managerComment : '-'}</div>
      ),
      sortable: false,
      minWidth: '200px',
    }
  ];

  // Filter leaves based on search query and date range
  const filteredLeaves = useMemo(() => {
    return leaves.filter(leave => {
      const matchesSearch =
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const fromDateFilter = fromDate ? new Date(leave.fromDate) >= new Date(fromDate) : true;
      const toDateFilter = toDate ? new Date(leave.toDate) <= new Date(toDate) : true;

      return matchesSearch && fromDateFilter && toDateFilter;
    });
  }, [leaves, searchQuery, fromDate, toDate]);

  const indexOfLastLeave = currentPage * rowsPerPage;
  const indexOfFirstLeave = indexOfLastLeave - rowsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);

  const handleRowClicked = (row) => {
    console.log(`Row clicked: ${row.id}`);
  };

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="table-header">
        <h2>Leave History</h2>
        <button className="apply-leave-btn" onClick={handleAddNewLeaveClick}>
          <FiPlus className="icon" /> Apply Leave
        </button>
      </div>

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
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="date-filter">
            <span>To Date</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
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
          onRowClicked={handleRowClicked}
          pagination
          paginationServer
          paginationTotalRows={filteredLeaves.length}
          paginationPerPage={rowsPerPage}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
          }}
          paginationIconNext={<FiChevronRight />}
          paginationIconPrevious={<FiChevronLeft />}
          className="data-table"
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
};

export default LeaveHistory;

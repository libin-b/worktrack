import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import './ViewShift.css';

// Mock data - in a real app, this would come from an API
const mockShifts = [
  {
    id: 'SHF001',
    employeeName: 'kumar',
    shiftType: 'Morning',
    startDate: '2023-07-01',
    endDate: '2023-07-07',
    status: 'Active'
  },
  {
    id: 'SHF002',
    employeeName: 'Thoufi',
    shiftType: 'Evening',
    startDate: '2023-07-01',
    endDate: '2023-07-07',
    status: 'Active'
  },
  {
    id: 'SHF003',
    employeeName: 'Libin',
    shiftType: 'Night',
    startDate: '2023-07-08',
    endDate: '2023-07-14',
    status: 'Upcoming'
  },
  {
    id: 'SHF004',
    employeeName: 'Disha',
    shiftType: 'Morning',
    startDate: '2023-06-24',
    endDate: '2023-06-30',
    status: 'Completed'
  },
  {
    id: 'SHF005',
    employeeName: 'Gauro',
    shiftType: 'Evening',
    startDate: '2023-06-24',
    endDate: '2023-06-30',
    status: 'Completed'
  }
];

const ViewShift = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [shifts, setShifts] = useState(mockShifts);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Shift Management' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (shiftId) => {
    // In a real app, this would navigate to an edit page
    console.log(`Editing shift with ID: ${shiftId}`);
    // navigate(`/shift/edit/${shiftId}`);
  };

  const handleDelete = (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift assignment?')) {
      // In a real app, this would make an API call to delete the shift
      console.log(`Deleting shift with ID: ${shiftId}`);
      setShifts(shifts.filter(shift => shift.id !== shiftId));
    }
  };

  const handleAssignShift = () => {
    navigate('/shift/assign');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Define columns for the data table
  const columns = [
    
    {
      name: 'Employee Name',
      selector: row => row.employeeName,
      sortable: true,
    },
    {
      name: 'Shift Type',
      selector: row => row.shiftType,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: row => formatDate(row.startDate),
      sortable: true,
      sortFunction: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    
    {
      name: 'Actions',
      cell: row => (
        <div className="actions">
          <button 
            className="action-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.id);
            }}
          >
            <FiEdit />
          </button>
          <button 
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <FiTrash2 />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Filter shifts based on search query
  const filteredShifts = shifts.filter(shift => 
    shift.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shift.shiftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shift.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastShift = currentPage * rowsPerPage;
  const indexOfFirstShift = indexOfLastShift - rowsPerPage;
  const currentShifts = filteredShifts.slice(indexOfFirstShift, indexOfLastShift);
  const totalPages = Math.ceil(filteredShifts.length / rowsPerPage);

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
        '&:hover': {
          backgroundColor: 'rgba(67, 24, 255, 0.03)',
          cursor: 'pointer',
        },
      },
    },
    pagination: {
      style: {
        borderTop: 'none',
        padding: '16px 24px',
      },
    },
  };

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="table-header">
        <h2>Shift Management</h2>
        <button 
          className="assign-shift-btn"
          onClick={handleAssignShift}
        >
          <FiPlus className="icon" /> Assign Shift
        </button>
      </div>

      <div className="table-filter-container">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search shifts..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="date-filters">
          <div className="date-filter">
            <span>From</span>
            <div className="date-input">
              <input type="date" />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <div className="date-filter">
            <span>To</span>
            <div className="date-input">
              <input type="date" />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <button className="filter-btn">
            <FiFilter />
            Filter
          </button>
        </div>
      </div>

      <div className="shifts-table-container">
        <DataTable
          columns={columns}
          data={currentShifts}
          customStyles={customStyles}
          pagination
          paginationServer
          paginationTotalRows={filteredShifts.length}
          paginationPerPage={rowsPerPage}
          paginationDefaultPage={currentPage}
          onChangePage={page => setCurrentPage(page)}
          noDataComponent={
            <div className="no-data">
              No shifts found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ViewShift;
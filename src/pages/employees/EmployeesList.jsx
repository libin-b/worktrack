import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import './EmployeesList.css';

// Mock data - in a real app, this would come from an API
const mockEmployees = [
  {
    id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    jobRole: 'Senior Developer',
    joiningDate: '2023-01-15',
    status: 'Active'
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Design',
    jobRole: 'UI/UX Designer',
    joiningDate: '2023-02-20',
    status: 'Active'
  },
  {
    id: 'EMP003',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    department: 'Marketing',
    jobRole: 'Marketing Manager',
    joiningDate: '2023-03-10',
    status: 'Inactive'
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    department: 'Human Resources',
    jobRole: 'HR Specialist',
    joiningDate: '2023-04-05',
    status: 'Active'
  },
  {
    id: 'EMP005',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    department: 'Finance',
    jobRole: 'Financial Analyst',
    joiningDate: '2023-05-12',
    status: 'Active'
  }
];

const EmployeesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [employees, setEmployees] = useState(mockEmployees);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Employees' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (employeeId) => {
    // In a real app, this would navigate to an edit page
    // navigate(`/employees/edit/${employeeId}`);
    //navigate to add page for now
    console.log(`Editing employee with ID: ${employeeId}`);
    navigate(`/employees/add`);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      // In a real app, this would make an API call to delete the employee
      console.log(`Deleting employee with ID: ${employeeId}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Define columns for the data table
  const columns = [
    {
      name: 'Employee ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.department,
      sortable: true,
    },
    {
      name: 'Job Role',
      selector: row => row.jobRole,
      sortable: true,
    },
    {
      name: 'Joining Date',
      selector: row => formatDate(row.joiningDate),
      sortable: true,
      sortFunction: (a, b) => new Date(a.joiningDate) - new Date(b.joiningDate),
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

  // Handle row click
  const handleRowClicked = (row) => {
    // Navigate to employee details or edit page
    console.log(`Row clicked: ${row.id}`);
    // navigate(`/employees/${row.id}`);
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
          borderBottom: '1px solid #e0e5f2',
        },
        '&:hover': {
          backgroundColor: 'rgba(67, 24, 255, 0.03)',
          cursor: 'pointer',
        },
      },
    },
    pagination: {
      style: {
        borderTop: '1px solid #e0e5f2',
        padding: '16px 24px',
      },
    },
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />      
      <h2>Employees</h2>
      <div className="table-filter-container">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search employees by name, email, or ID"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="date-filters">
          <div className="date-filter">
            <span>From Date</span>
            <div className="date-input">
              <input type="date" />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <div className="date-filter">
            <span>To Date</span>
            <div className="date-input">
              <input type="date" />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <button className="filter-btn">
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="employees-table-container">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          customStyles={customStyles}
          onRowClicked={handleRowClicked}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationComponentOptions={{
            rowsPerPageText: 'Rows per page:',
            rangeSeparatorText: 'of',
            noRowsPerPage: false,
            selectAllRowsItem: false,
          }}
          highlightOnHover
          pointerOnHover
          noDataComponent={
            <div className="no-results">
              No employees found matching your search criteria.
            </div>
          }
        />
      </div>
    </div>
  );
};

export default EmployeesList;

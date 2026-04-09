import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import './EmployeesList.css';
import api from '../../api/axios';
import {showSuccess, showError} from '../../components/common/SweetAlert';


const EmployeesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // fetch employees data
  useEffect(() => {
    fetchEmployees(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Employees' }
  ];

  const fetchEmployees = (page, size, fromDate='', toDate='') => {
    api.get(`/employees?page=${page}&size=${size}&fromDate=${fromDate}&toDate=${toDate}`)
      .then(response => {
        setEmployees(response.data.content);
        setTotalRows(response.data.totalElements);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (employeeId) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      api.delete(`/employees/${employeeId}`)
        .then(response => {
          showSuccess('Success', 'Employee deleted successfully!');
          // Refresh employee list
          setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        })
        .catch(error => {
          showError('Error', 'Failed to delete employee.');
          console.error('Error deleting employee:', error);
        });
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
      selector: row => row.employeeCode,
      sortable: true,
    },
    {
      name: 'First Name',
      selector: row => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: row => row.lastName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },    
    {
      name: 'Phone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'Department',
      selector: row => row.departmentName,
      sortable: true,
    },
    {
      name: 'Job Role',
      selector: row => row.jobRoleName,
      sortable: true,
    },
    {
      name: 'Joining Date',
      selector: row => formatDate(row.joinDate),
      sortable: true,
      sortFunction: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
    },
    // {
    //   name: 'Status',
    //   cell: row => (
    //     <span className={`status-badge ${row.status.toLowerCase()}`}>
    //       {row.status}
    //     </span>
    //   ),
    //   sortable: true,
    // },
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

  
  // Filter employees based on search query
  const filteredEmployees = employees.length > 0 ? employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

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
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <div className="date-filter">
            <span>To Date</span>
            <div className="date-input">
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              {/* <FiCalendar className="calendar-icon" /> */}
            </div>
          </div>
          <button 
            className="filter-btn"
            onClick={() => {
              setCurrentPage(0);
              fetchEmployees(0, rowsPerPage, fromDate, toDate);
            }}
            >
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="employees-table-container">
        <DataTable
          columns={columns}
          data={employees}
          // customStyles={customStyles}
          onRowClicked={handleRowClicked}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          onChangePage={(page) => setCurrentPage(page - 1)}
          onChangeRowsPerPage={(newPerPage) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(0);
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { FiSearch, FiCalendar, FiFilter, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import DataTable from 'react-data-table-component';
import './ViewTasks.css';

// Mock data - in a real app, this would come from an API
const mockTasks = [
  {
    id: 'TSK001',
    employeeName: 'Thoufi',
    task: 'Complete UI for Leave Module',
    deadline: '2023-07-15',
    status: 'Pending',
    priority: 'High',
    description: 'Need to finalize the design and implement the frontend components.'
  },
  {
    id: 'TSK002',
    employeeName: 'Libin',
    task: 'Design meeting dashboard',
    deadline: '2023-07-10',
    status: 'Completed',
    priority: 'Medium',
    description: 'Design the layout and components for the meeting dashboard.'
  },
  {
    id: 'TSK003',
    employeeName: 'Disha',
    task: 'Update documentation',
    deadline: '2023-07-20',
    status: 'In Progress',
    priority: 'Low',
    description: 'Revise and update the project documentation.'
  },
  {
    id: 'TSK004',
    employeeName: 'Gauro',
    task: 'Fix login issue',
    deadline: '2023-07-05',
    status: 'Completed',
    priority: 'High',
    description: 'Identify and fix the login issue in the application.'
  },
  {
    id: 'TSK005',
    employeeName: 'Kumar',
    task: 'Performance optimization',
    deadline: '2023-07-25',
    status: 'Pending',
    priority: 'Medium',
    description: 'Optimize the performance of the application.'
  }
];

const ViewTasks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [tasks, setTasks] = useState(mockTasks);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Task Management' }
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (taskId) => {
    console.log(`Editing task with ID: ${taskId}`);
    // navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log(`Deleting task with ID: ${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleAssignTask = () => {
    navigate('/tasks/assign');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Define columns for the data table
  const columns = [
    {
      name: 'Employee',
      selector: row => row.employeeName,
      sortable: true,
    },
    {
      name: 'Task',
      selector: row => row.task,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Deadline',
      selector: row => formatDate(row.deadline),
      sortable: true,
      sortFunction: (a, b) => new Date(a.deadline) - new Date(b.deadline),
    },
    {
      name: 'Status',
      cell: row => (
        <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Priority',
      selector: row => row.priority,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      wrap: true,
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

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastTask = currentPage * rowsPerPage;
  const indexOfFirstTask = indexOfLastTask - rowsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

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
        <h2>Task Management</h2>
        <button 
          className="assign-task-btn"
          onClick={handleAssignTask}
        >
          <FiPlus className="icon" /> Assign Task
        </button>
      </div>

      <div className="table-filter-container">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="date-filters">
          <div className="date-filter">
            <span>From</span>
            <div className="date-input">
              <input type="date" />
            </div>
          </div>
          <div className="date-filter">
            <span>To</span>
            <div className="date-input">
              <input type="date" />
            </div>
          </div>
          <button className="filter-btn">
            <FiFilter />
            Filter
          </button>
        </div>
      </div>

      <div className="tasks-table-container">
        <DataTable
          columns={columns}
          data={currentTasks}
          customStyles={customStyles}
          pagination
          paginationServer
          paginationTotalRows={filteredTasks.length}
          paginationPerPage={rowsPerPage}
          paginationDefaultPage={currentPage}
          onChangePage={page => setCurrentPage(page)}
          noDataComponent={
            <div className="no-data">
              No tasks found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ViewTasks;

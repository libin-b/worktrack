import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import DataTable from "react-data-table-component";
import api from "../../api/axios";
import "./ViewTasks.css";
import { showSuccess } from "../../components/common/SweetAlert";

const ViewTasks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [tasks, setTasks] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRows, setTotalRows] = useState(0);

  const breadcrumbItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Task Management" },
  ];

  // Fetch tasks from API
  const fetchTasks = async (page = 1, fromDate, toDate) => {
    try {
      const response = await api.get(`/tasks`, {
        params: {
          page: page - 1,
          size: rowsPerPage,
          fromDate,
          toDate,
        },
      });
      setTasks(response.data.content);
      setTotalRows(response.data.totalElements);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, null, null);
  }, [searchQuery, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        showSuccess("Success", "Task deleted successfully.");
        fetchTasks(currentPage);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleAssignTask = () => {
    navigate("/tasks/assign");
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";
  };

  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.assignedToName.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  

  const columns = [
    { name: "Employee", selector: (row) => row.assignedToName, sortable: true },
    { name: "Task", selector: (row) => row.title, sortable: true, wrap: true },
    {
      name: "Deadline",
      selector: (row) => formatDate(row.deadline),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={`status-badge ${row.status}`}>{row.status}</span>
      ),
      sortable: true,
    },
    { name: "Priority", selector: (row) => row.priority, sortable: true },
    { name: "Description", selector: (row) => row.description, wrap: true },
    {
      name: "Actions",
      cell: (row) => (
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

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />

      <div className="table-header">
        <h2>Task Management</h2>
        <button className="assign-task-btn" onClick={handleAssignTask}>
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
            <span>From Date</span>
            <div className="date-input">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
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
            </div>
          </div>

          <button
            className="filter-btn"
            onClick={() => fetchTasks(1, fromDate, toDate)}
          >
            <FiFilter />
            Filter
          </button>
        </div>
      </div>

      <div className="tasks-table-container">
        <DataTable
          columns={columns}
          data={filteredTasks}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={rowsPerPage}
          paginationDefaultPage={currentPage}
          paginationRowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500, 1000]}
          onChangePage={(page) => fetchTasks(page)}
          noDataComponent={<div className="no-data">No tasks found</div>}
        />
      </div>
    </div>
  );
};

export default ViewTasks;

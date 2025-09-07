import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheckCircle,
  FiPlay,
  FiMinus,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
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
    { label: "My Tasks" },
  ];

  // Fetch tasks from API
  const fetchTasks = async (page = 1, fromDate, toDate) => {
    try {
      const response = await api.get(`/tasks/my-tasks`, {
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

  const handleStartTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/status?status=in_progress`);
      showSuccess("Success", "Task started!");
      fetchTasks(currentPage);
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/status?status=completed`);
      showSuccess("Success", "Task marked as completed!");
      fetchTasks(currentPage);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-In", {
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
    {
      name: "Priority",
      cell: (row) => {
        let color = "";
        let icon = null;

        switch (row.priority) {
          case "low":
            color = "green";
            icon = <FiArrowDown />;
            break;
          case "medium":
            color = "orange";
            icon = <FiMinus />;
            break;
          case "high":
            color = "red";
            icon = <FiArrowUp />;
            break;
          default:
            color = "gray";
        }

        return (
          <span
            style={{ color, display: "flex", alignItems: "center", gap: "4px" }}
          >
            {icon} {row.priority}
          </span>
        );
      },
      sortable: true,
    },
    { name: "Description", selector: (row) => row.description, wrap: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="actions">
          {row.status === "pending" && (
            <button
              className="action-btn start"
              onClick={(e) => {
                e.stopPropagation();
                handleStartTask(row.id);
              }}
              title="Start Task"
            >
              <FiPlay />
            </button>
          )}

          {row.status === "in_progress" && (
            <button
              className="action-btn complete"
              onClick={(e) => {
                e.stopPropagation();
                handleCompleteTask(row.id);
              }}
              title="Mark as Completed"
            >
              <FiCheckCircle />
            </button>
          )}
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
        <h2>My Tasks</h2>
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
          highlightOnHover
          onChangePage={(page) => fetchTasks(page)}
          noDataComponent={<div className="no-data">No tasks found</div>}
        />
      </div>
    </div>
  );
};

export default ViewTasks;

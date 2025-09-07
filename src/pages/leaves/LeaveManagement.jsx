import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
} from "react-icons/fi";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import api from "../../api/axios";
import {
  showSuccess,
  showError,
} from "../../components/common/SweetAlert";
import "./LeaveManagement.css";

// Rejection Reason Modal Component
const RejectModal = ({ isOpen, onClose, onConfirm, reason, onReasonChange }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Reject Leave Request"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <h2>Reject Leave Request</h2>
    <div className="form-group">
      <label htmlFor="rejectionReason">Reason for Rejection:</label>
      <textarea
        id="rejectionReason"
        className="form-control"
        rows="4"
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Please provide a reason for rejecting this leave request"
        required
      />
    </div>
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={onConfirm}
        disabled={!reason.trim()}
      >
        Confirm Reject
      </button>
    </div>
  </Modal>
);

Modal.setAppElement("#root");

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [leaves, setLeaves] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const breadcrumbItems = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Leave Management" },
  ];

  // Fetch leaves
  const fetchLeaves = () => {
    api
      .get("/leaves")
      .then((res) => setLeaves(res.data))
      .catch((err) => {
        console.error("Error fetching leaves:", err);
        showError("Error", "Failed to load leaves");
      });
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleApprove = (leaveId) => {
    api
      .put(`/leaves/${leaveId}/approve`)
      .then(() => {
        showSuccess("Success", "Leave approved");
        fetchLeaves();
      })
      .catch((err) => {
        console.error("Error approving leave:", err);
        showError("Error", "Failed to approve leave");
      });
  };

  const openRejectModal = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedLeaveId(null);
    setRejectionReason("");
  };

  const handleReject = () => {
    if (selectedLeaveId) {
      api
        .put(`/leaves/${selectedLeaveId}/reject`, { reason: rejectionReason })
        .then(() => {
          showSuccess("Success", "Leave rejected");
          fetchLeaves();
        })
        .catch((err) => {
          console.error("Error rejecting leave:", err);
          showError("Error", "Failed to reject leave");
        })
        .finally(() => {
          closeRejectModal();
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const columns = [
    {
      name: "Employee",
      selector: (row) => row.employee?.name,
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "From Date / To Date",
      cell: (row) => (
        <div>
          <div>{formatDate(row.fromDate)}</div>
          <div className="text-muted small">to {formatDate(row.toDate)}</div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
    },
    {
      name: "No. of Days",
      selector: (row) => row.days,
      sortable: true,
      cell: (row) => <div style={{ textAlign: "center" }}>{row.days}</div>,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Rejection Reason",
      selector: (row) => row.managerComment || "-",
      cell: (row) => (
        <div>
          {row.status === "rejected" && row.managerComment
            ? row.managerComment
            : "-"}
        </div>
      ),
      sortable: false,
      minWidth: "200px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="actions" style={{ overflow: "visible" }}>
          {row.status === "pending" ? (
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
                  openRejectModal(row.id);
                }}
                title="Reject"
              >
                <FiX />
              </button>
            </>
          ) : (
            <span className="action-text">
              {row.status === "approved" ? "Approved" : "Rejected"}
            </span>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch =
        (leave.employee?.firstName + " " + leave.employee?.lastName)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const fromDateFilter = fromDate
        ? new Date(leave.fromDate) >= new Date(fromDate)
        : true;
      const toDateFilter = toDate
        ? new Date(leave.toDate) <= new Date(toDate)
        : true;

      return matchesSearch && fromDateFilter && toDateFilter;
    });
  }, [leaves, searchQuery, fromDate, toDate]);

  const indexOfLastLeave = currentPage * rowsPerPage;
  const indexOfFirstLeave = indexOfLastLeave - rowsPerPage;
  const currentLeaves = filteredLeaves.slice(
    indexOfFirstLeave,
    indexOfLastLeave
  );

  const handleRowClicked = (row) => {
    console.log(`Row clicked: ${row.id}`);
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
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "All",
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

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        onConfirm={handleReject}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
      />
    </div>
  );
};

export default LeaveManagement;

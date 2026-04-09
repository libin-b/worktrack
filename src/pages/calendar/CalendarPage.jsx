import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import Select from "react-select";
import {
  FiX,
  FiPlus,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiLink,
  FiUsers,
  FiAlignLeft,
} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb";
import "./CalendarPage.css";
import api from "../../api/axios";
import { showError, showSuccess } from "../../components/common/SweetAlert";
import { getUserRole } from "../../utils/userRole";
import { getAuthUser } from "../../utils/authUser";

// Make sure to bind modal to your appElement
Modal.setAppElement("#root");
const CalendarPage = () => {
  const { userRole, isEmployee, isManager } = getUserRole();
  const authUser = getAuthUser();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: null,
    end: null,
    allDay: false,
    extendedProps: {
      description: "",
      location: "",
      guests: [],
      label: "meeting",
      leaveType: "", // Add leaveType here
    },
    backgroundColor: "#E0EAFF",
    borderColor: "#B2CCFF",
    textColor: "#3E4784",
  });

  const calendarRef = useRef(null);
  // always include both labels so existing events (meeting/leave) render correctly
  const labelColors = {
    meeting: {
      bg: "#FCE7F6",
      text: "#05603A",
      border: "#FCCEEE",
    },
    leave: {
      bg: "#FEE4E2",
      text: "#912018",
      border: "#FECDCA",
    },
  };

  const fetchLeaveTypes = () => {
    // Fetch leave types from API
    api
      .get("/leave-types")
      .then((response) => {
        setLeaveTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leave types:", error);
      });
  };

  const fetchEmployees = () => {
    // Fetch employees from API
    api
      .get("/employees/simple")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  // Helpers
  const pad = (n) => String(n).padStart(2, "0");

  const formatLocalDate = (d) => {
    if (!d) return null;
    const date = new Date(d);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
  };

  const formatLocalDateTime = (d) => {
    if (!d) return null;
    const date = new Date(d);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  // Normalize events so calendar IDs are unique client-side while preserving server ID
  const normalizeEvents = (events) => {
    const counts = {};
    return events.map((ev, idx) => {
      const serverId = ev.id != null ? String(ev.id) : `__noid_${idx}`;
      counts[serverId] = (counts[serverId] || 0) + 1;
      const clientId =
        counts[serverId] === 1
          ? serverId
          : `${serverId}-dup-${counts[serverId]}`;
      return {
        ...ev,
        id: clientId,
        extendedProps: {
          ...(ev.extendedProps || {}),
          serverId: ev.id,
        },
      };
    });
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchEmployees();

    // Fetch events from API and normalize duplicates
    api
      .get("/calendar/events")
      .then((res) => {
        setEvents(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error fetching calendar events:", err));
  }, []);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Calendar", path: "/calendar" },
  ];

  const handleDateClick = (arg) => {
    const startDate = arg.date;
    // Default duration: for meetings use 1 hour, for leave use full day
    let endDate;
    let normalizedStart = new Date(startDate);
    if (isEmployee && !newEvent.id) {
      // when creating a new leave: start at 00:00:00, end at 23:59:59 of same day
      normalizedStart.setHours(0, 0, 0, 0);
      endDate = new Date(normalizedStart);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // meeting: default 1 hour
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    setNewEvent({
      ...newEvent,
      title: "",
      start: normalizedStart,
      end: endDate,
      allDay: false,
      extendedProps: {
        ...newEvent.extendedProps,
        description: "",
        location: "",
        guests: [],
        label: isEmployee ? "leave" : "meeting",
        leaveType: isEmployee ? leaveTypes[0]?.id || "" : "",
      },
      backgroundColor: labelColors[isEmployee ? "leave" : "meeting"].bg,
      borderColor: labelColors[isEmployee ? "leave" : "meeting"].border,
      textColor: labelColors[isEmployee ? "leave" : "meeting"].text,
    });

    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const label = event.extendedProps.label || "meeting";

    const guestIds = event.extendedProps.guests?.map((g) => g.id) || [];

    setNewEvent({
      id: event.id,
      serverId: event.extendedProps?.serverId ?? event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        ...event.extendedProps,
        guests: guestIds,
        leaveType: event.extendedProps.leaveTypeId || "",
        url: event.extendedProps.link || event.extendedProps.url || "",
      },
      backgroundColor: labelColors[label].bg,
      borderColor: labelColors[label].border,
      textColor: labelColors[label].text,
    });

    setIsModalOpen(true);
  };

  const handleEventDrop = (eventInfo) => {
    setEvents(
      events.map((event) =>
        event.id === eventInfo.event.id
          ? {
              ...event,
              start: eventInfo.event.start,
              end: eventInfo.event.end,
            }
          : event
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [, child] = name.split(".");
      setNewEvent((prev) => ({
        ...prev,
        extendedProps: {
          ...prev.extendedProps,
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setNewEvent((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleLabelChange = (label) => {
    setNewEvent((prev) => ({
      ...prev,
      extendedProps: {
        ...prev.extendedProps,
        label,
        leaveType:
          label === "leave"
            ? Number(prev.extendedProps.leaveType) || leaveTypes[0]?.id || ""
            : prev.extendedProps.leaveType,
      },
      backgroundColor: labelColors[label].bg,
      borderColor: labelColors[label].border,
      textColor: labelColors[label].text,
    }));
  };

  const handleAddNewEventClick = () => {
    const now = new Date();
    // For leave default to full day today, for meeting default to one hour from now
    let start = new Date(now);
    let end;
    if (isEmployee) {
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    } else {
      end = new Date(now.getTime() + 60 * 60 * 1000);
    }

    setNewEvent({
      title: "",
      start,
      end,
      allDay: false,
      extendedProps: {
        description: "",
        location: "",
        guests: [],
        label: isEmployee ? "leave" : "meeting",
        url: "",
        leaveType: isEmployee ? leaveTypes[0]?.id || "" : "",
      },
      backgroundColor: labelColors[isEmployee ? "leave" : "meeting"].bg,
      borderColor: labelColors[isEmployee ? "leave" : "meeting"].border,
      textColor: labelColors[isEmployee ? "leave" : "meeting"].text,
    });

    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    const isLeave = newEvent.extendedProps?.label === "leave";
    const payload = {
      title: newEvent.title,
      start: isLeave
        ? formatLocalDate(newEvent.start)
        : formatLocalDateTime(newEvent.start),
      end: isLeave
        ? formatLocalDate(newEvent.end)
        : formatLocalDateTime(newEvent.end),
      description: newEvent.extendedProps.description,
      guestIds: newEvent.extendedProps.guests,
      link: newEvent.extendedProps.url,
      leaveTypeId: newEvent.extendedProps.leaveType,
      days: newEvent.extendedProps.days,
      reason: newEvent.extendedProps.reason,
    };

    let sid = newEvent.serverId || newEvent.id;
    if (
      typeof sid === "string" &&
      (sid.startsWith("L-") || sid.startsWith("M-"))
    ) {
      sid = sid.substring(2); // remove "L-"
    }

    if (newEvent.id) {
      // Update existing
      const url = isLeave ? `/leaves/${sid}` : `/meetings/${sid}`;
      api
        .put(url, payload)
        .then(() => {
          showSuccess("Success", "Event updated successfully");
          return api.get("/calendar/events");
        })
        .then((res) => setEvents(normalizeEvents(res?.data || [])))
        .catch((err) => {
          showError("Error", "Error updating event");
          console.error("Error updating event:", err);
        });
    } else {
      // Create new
      const url = isLeave ? "/leaves" : "/meetings";
      api
        .post(url, payload)
        .then(() => {
          showSuccess("Success", "Event saved successfully");
          return api.get("/calendar/events");
        })
        .then((res) => setEvents(normalizeEvents(res.data || [])))
        .catch((err) => {
          showError("Error", "Error saving event");
          console.error("Error saving event:", err);
        });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (newEvent.id) {
      let sid = newEvent.serverId || newEvent.id;
      if (
        typeof sid === "string" &&
        (sid.startsWith("L-") || sid.startsWith("M-"))
      ) {
        sid = sid.substring(2); // remove "L-"
      }

      const url =
        newEvent.extendedProps.label === "meeting"
          ? `/meetings/${sid}`
          : `/leaves/${sid}`;

      api
        .delete(url)
        .then(() => {
          showSuccess("Success", "Event deleted successfully");
          return api.get("/calendar/events"); // 🔹 fetch updated list
        })
        .then((res) => setEvents(normalizeEvents(res.data || [])))
        .catch((err) => {
          showError("Error", "Error deleting event");
          console.error("Error deleting event:", err);
        });

      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleDateChange = (field, value) => {
    // value comes from datetime-local input (string like '2025-09-05T09:00')
    let parsed = value ? new Date(value) : null;

    // If this is a leave event and we're creating a new leave (no id), normalize times.
    if (newEvent.extendedProps?.label === "leave" && !newEvent.id) {
      if (field === "start" && parsed) {
        parsed.setHours(0, 0, 0, 0);
      }
      if (field === "end" && parsed) {
        parsed.setHours(23, 59, 59, 999);
      }
    }

    const updatedEvent = { ...newEvent, [field]: parsed };
    const days = calculateDays(updatedEvent.start, updatedEvent.end);

    setNewEvent({
      ...updatedEvent,
      extendedProps: {
        ...updatedEvent.extendedProps,
        days: days,
      },
    });
  };

  const resetForm = () => {
    setNewEvent({
      title: "",
      start: null,
      end: null,
      allDay: false,
      extendedProps: {
        description: "",
        location: "",
        guests: [],
        label: isEmployee ? "leave" : "meeting",
      },
      backgroundColor: labelColors[isEmployee ? "leave" : "meeting"].bg,
      borderColor: labelColors[isEmployee ? "leave" : "meeting"].border,
      textColor: labelColors[isEmployee ? "leave" : "meeting"].text,
    });
  };

  return (
    <div className="view-container">
      <Breadcrumb items={breadcrumbItems} />
      <h2>Calendar</h2>
      <div className="page-header"></div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,addEventButton",
          }}
          customButtons={{
            addEventButton: {
              text: isEmployee ? "+ Apply Leave" : "+ Add Event",
              click: handleAddNewEventClick,
            },
          }}
          events={events}
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          ref={calendarRef}
          eventContent={renderEventContent}
          // show more events per day to avoid hiding crowded days
          dayMaxEventRows={4}
          eventMaxStack={99}
          eventOrder="start,title"
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          dayHeaderFormat={{ weekday: "short" }}
          titleFormat={{ year: "numeric", month: "long" }}
          firstDay={1} // Start week on Monday
          nowIndicatorClassNames={["now-indicator"]}
          eventClassNames={["custom-event"]}
        />
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Event Details"
        className="modal event-modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="modal-header">
          <h2>
            {isEmployee
              ? newEvent.id
                ? "Edit Leave"
                : "Apply Leave"
              : newEvent.id
              ? "Edit Event"
              : "Add New Event"}
          </h2>

          <button
            className="close-button"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <form className="event-form">
            <div className="form-row">
              {newEvent.extendedProps.label !== "leave" && (
                <div className="form-group col-6">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={
                      newEvent.extendedProps.label !== "leave"
                        ? newEvent.title
                        : "Leave Application"
                    }
                    onChange={handleInputChange}
                    placeholder="Event Title"
                    autoFocus
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <div className="select-wrapper">
                  <select
                    value={newEvent.extendedProps.label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="form-control"
                  >
                    {Object.entries(labelColors)
                      .filter(([key]) => {
                        // hide 'meeting' for employees
                        if (userRole === "employee" && key === "meeting")
                          return false;
                        // hide 'leave' for HR
                        if (userRole === "hr" && key === "leave") return false;
                        return true;
                      })
                      .map(([key]) => (
                        <option key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {newEvent.extendedProps.label == "leave" && (
                <div className="form-group">
                  <label className="form-label">Leave Type</label>
                  <div className="select-wrapper">
                    <select
                      value={newEvent.extendedProps.leaveType}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "extendedProps.leaveType",
                            value: e.target.value,
                          },
                        })
                      }
                      disabled={!!newEvent.id}
                      className="form-control"
                    >
                      {leaveTypes.map((leaveType) => (
                        <option key={leaveType.id} value={leaveType.id}>
                          {leaveType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date & Time</label>
                <div className="input-with-icon">
                  {/* <FiCalendar className="input-icon" /> */}
                  <input
                    type="datetime-local"
                    name="start"
                    className="form-control"
                    value={
                      newEvent.start
                        ? newEvent.start
                            .toLocaleString("sv-SE")
                            .replace(" ", "T")
                        : ""
                    }
                    onChange={(e) => handleDateChange("start", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">End Date & Time</label>
                <div className="input-with-icon">
                  {/* <FiClock className="input-icon" /> */}
                  <input
                    type="datetime-local"
                    name="end"
                    className="form-control"
                    value={
                      newEvent.end
                        ? newEvent.end.toLocaleString("sv-SE").replace(" ", "T")
                        : ""
                    }
                    onChange={(e) => handleDateChange("end", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {newEvent.extendedProps.label == "leave" ? (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">No Of Days</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      name="extendedProps.days"
                      className="form-control"
                      value={newEvent.extendedProps.days || ""}
                      onChange={handleInputChange}
                      placeholder="Add number of days"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      name="extendedProps.reason"
                      className="form-control"
                      value={newEvent.extendedProps.reason || ""}
                      onChange={handleInputChange}
                      placeholder="Add reason"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Meeting Link</label>
                  <div className="input-with-icon">
                    {/* <FiLink className="input-icon" /> */}
                    <input
                      type="url"
                      name="extendedProps.url"
                      className="form-control"
                      value={newEvent.extendedProps.url || ""}
                      onChange={handleInputChange}
                      placeholder="Add a meeting link"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Guests</label>
                  <div className="input-with-icon">
                    <Select
                      isMulti
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: emp.name,
                      }))}
                      value={employees
                        .filter((emp) =>
                          newEvent.extendedProps.guests?.includes(emp.id)
                        )
                        .map((emp) => ({ value: emp.id, label: emp.name }))}
                      onChange={(selected) =>
                        handleInputChange({
                          target: {
                            name: "extendedProps.guests",
                            value: selected.map((s) => s.value), // store only IDs in state
                          },
                        })
                      }
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <div className="input-with-icon">
                    {/* <FiAlignLeft className="input-icon" /> */}
                    <textarea
                      name="extendedProps.description"
                      className="form-control"
                      rows={3}
                      value={newEvent.extendedProps.description || ""}
                      onChange={handleInputChange}
                      placeholder="Add description"
                    />
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="modal-actions">
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            {newEvent.id &&
              newEvent.extendedProps.createdById === authUser?.id && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              )}
          </div>
          <div className="action-buttons">
            {(!newEvent.id ||
              newEvent.extendedProps.createdById === authUser?.id) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddEvent}
              >
                {newEvent.id ? "Update" : "Add"} Event
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );

  // Helper function to render event content with custom styling
  function renderEventContent(eventInfo) {
    const event = eventInfo.event;
    const label = event.extendedProps.label || event.title || "meeting";
    const color = labelColors[label] || labelColors.leave;
    const eventTitle = event.title;

    const employeeName =
      !isEmployee &&
      !isManager &&
      label === "leave" &&
      event.extendedProps.guests &&
      event.extendedProps.guests.length > 0
        ? event.extendedProps.guests[0].name
        : "";

    return (
      <div
        className="custom-event"
        style={{
          backgroundColor: color.bg,
          color: color.text,
          borderLeft: `3px solid ${color.border}`,
          borderRadius: "4px",
          padding: "4px 8px",
          margin: "2px 4px",
          fontSize: "0.75rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s ease",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <div
          className="event-time"
          style={{ fontWeight: 500, marginRight: "4px" }}
        >
          {eventInfo.timeText}
        </div>
        <div
          className="event-title"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {eventTitle}
        </div>
        <div
          className="emp-name"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <b>{employeeName}</b>
        </div>
      </div>
    );
  }
};

export default CalendarPage;

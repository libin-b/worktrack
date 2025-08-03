import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
      allDay: false,
      extendedProps: {
        description: "Weekly team sync",
        location: "Conference Room A",
        guests: ["john@example.com", "jane@example.com"],
        label: "meeting",
      },
      backgroundColor: "#E0EAFF",
      borderColor: "#B2CCFF",
      textColor: "#3E4784",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
    },
    backgroundColor: "#E0EAFF",
    borderColor: "#B2CCFF",
    textColor: "#3E4784",
  });

  const calendarRef = useRef(null);
  const labelColors = {
    task: {
      bg: "#E0EAFF",
      text: "#3E4784",
      border: "#B2CCFF",
    },
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
    blocker: {
      bg: "#D1FADF",
      text: "#9E165F",
      border: "#A6F4C5",
    },
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Calendar", path: "/calendar" },
  ];

  const handleDateClick = (arg) => {
    const startDate = arg.date;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    setSelectedDate(startDate);
    setNewEvent({
      ...newEvent,
      title: "",
      start: startDate,
      end: endDate,
      allDay: false,
      extendedProps: {
        ...newEvent.extendedProps,
        description: "",
        location: "",
        guests: [],
        label: "meeting",
      },
      backgroundColor: labelColors.meeting.bg,
      borderColor: labelColors.meeting.border,
      textColor: labelColors.meeting.text,
    });

    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const label = event.extendedProps.label || "meeting";

    setNewEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        ...event.extendedProps,
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
        event.id === parseInt(eventInfo.event.id)
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
      const [parent, child] = name.split(".");
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
      },
      backgroundColor: labelColors[label].bg,
      borderColor: labelColors[label].border,
      textColor: labelColors[label].text,
    }));
  };

  const handleAddNewEventClick = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    setNewEvent({
      title: "",
      start: now,
      end: oneHourLater,
      allDay: false,
      extendedProps: {
        description: "",
        location: "",
        guests: [],
        label: "meeting",
        url: "",
      },
      backgroundColor: labelColors.meeting.bg,
      borderColor: labelColors.meeting.border,
      textColor: labelColors.meeting.text,
    });

    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
      title: newEvent.title.trim(),
      start: newEvent.start,
      end: newEvent.end,
      allDay: newEvent.allDay,
      extendedProps: {
        ...newEvent.extendedProps,
        guests: Array.isArray(newEvent.extendedProps.guests)
          ? newEvent.extendedProps.guests
          : newEvent.extendedProps.guests
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean),
      },
      backgroundColor:
        newEvent.backgroundColor ||
        labelColors[newEvent.extendedProps.label].bg,
      borderColor:
        newEvent.borderColor ||
        labelColors[newEvent.extendedProps.label].border,
      textColor:
        newEvent.textColor || labelColors[newEvent.extendedProps.label].text,
    };

    // If editing existing event, update it, otherwise add new event
    const eventExists = events.some((e) => e.id === newEvent.id);

    setEvents(
      eventExists
        ? events.map((e) => (e.id === newEvent.id ? event : e))
        : [...events, event]
    );

    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (newEvent.id) {
      setEvents(events.filter((event) => event.id !== newEvent.id));
      setIsModalOpen(false);
      resetForm();
    }
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
        label: "meeting",
      },
      backgroundColor: labelColors.meeting.bg,
      borderColor: labelColors.meeting.border,
      textColor: labelColors.meeting.text,
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
              text: "+ Add Event",
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
          dayMaxEventRows={3}
          eventMaxStack={3}
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
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Event Details"
        className="modal event-modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="modal-header">
          <h2>{newEvent.id ? "Edit Event" : "Add New Event"}</h2>
          <button
            className="close-button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <form className="event-form">
            <div className="form-row">
              <div className="form-group col-6">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Event Title"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <div className="select-wrapper">
                  <select
                    value={newEvent.extendedProps.label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="form-control"
                  >
                    {Object.entries(labelColors).map(([key]) => (
                      <option
                        key={key}
                        value={key}
                      >                     
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                        ? newEvent.start.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        start: new Date(e.target.value),
                      })
                    }
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
                        ? newEvent.end.toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        end: new Date(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
                      

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
                {/* <FiUsers className="input-icon" /> */}
                <input
                  type="text"
                  name="extendedProps.guests"
                  className="form-control"
                  value={newEvent.extendedProps.guests.join(", ") || ""}
                  placeholder="Add guests (comma separated)"
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
          </form>
        </div>

        <div className="modal-actions">
          <div>            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            {newEvent.id && (
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddEvent}
              disabled={!newEvent.title.trim()}
            >
              {newEvent.id ? "Update" : "Add"} Event
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );

  // Helper function to render event content with custom styling
  function renderEventContent(eventInfo) {
    const event = eventInfo.event;
    const label = event.extendedProps.label || "meeting";
    const color = labelColors[label] || labelColors.meeting;

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
          {event.title}
        </div>
      </div>
    );
  }
};

export default CalendarPage;

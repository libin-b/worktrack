import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MeetingPlanning.css";

const MeetingPlanning = () => {
  const [date, setDate] = useState(new Date());
  const [form, setForm] = useState({
    time: "",
    reason: "",
    room: "",
  });

  const [meetings, setMeetings] = useState([]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = () => {
    if (!form.time || !form.reason || !form.room) {
      alert("Fill all details!");
      return;
    }

    setMeetings([
      ...meetings,
      {
        date: date.toDateString(),
        time: form.time,
        reason: form.reason,
        room: form.room,
      },
    ]);

    setForm({ time: "", reason: "", room: "" });
    alert("Meeting booked successfully!");
  };

  return (
    <div className="meeting-page">
      {/* Left: Meeting Form */}
      <div className="meeting-form">
        <h2>Book a Meeting</h2>

        <label>Select Date:</label>
        <Calendar value={date} onChange={setDate} />

        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleInputChange}
        />

        <label>Meeting Room:</label>
        <input
          type="text"
          name="room"
          placeholder="Eg: Hall A, Conference Room"
          value={form.room}
          onChange={handleInputChange}
        />

        <label>Meeting Reason:</label>
        <textarea
          name="reason"
          placeholder="What is this meeting about?"
          value={form.reason}
          onChange={handleInputChange}
        />

        <button onClick={handleBooking}>Book Meeting</button>
      </div>

      {/* Right: Scheduled meetings */}
      <div className="meeting-list">
        <h2>Scheduled Meetings</h2>
        {meetings.length === 0 ? (
          <p>No meetings booked yet.</p>
        ) : (
          <ul>
            {meetings.map((meet, index) => (
              <li key={index}>
                <strong>{meet.date}</strong> at <strong>{meet.time}</strong><br />
                Room: {meet.room}<br />
                Reason: {meet.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MeetingPlanning;

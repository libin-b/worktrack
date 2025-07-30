import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'; // For your custom styling

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());

  const handleDateChange = (date) => {
    setValue(date);
    console.log('Selected date:', date);
  };

  return (
    <div className="calendar-page">
      <h1>📅 HR Calendar</h1>
      <p>Select a date to view tasks, leaves, or shifts.</p>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={value}
        />
      </div>

      <div className="selected-date">
        <strong>Selected Date:</strong> {value.toDateString()}
      </div>
    </div>
  );
};

export default CalendarPage;

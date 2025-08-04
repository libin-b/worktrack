import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";

// Layout
import Layout from "./components/layout/Layout";

// Dashboards
import DashboardHR from "./pages/DashboardHR";
import DashboardManager from "./pages/DashboardManager";
import DashboardEmployee from "./pages/DashboardEmployee";

// Pages
import CalendarPage from "./pages/calendar/CalendarPage";
import AddEmployee from "./pages/employees/AddEmployee";
import EmployeesList from "./pages/employees/EmployeesList";
import LeaveManagement from "./pages/leaves/LeaveManagement";
import MeetingPlanning from "./pages/meetings/MeetingPlanning";
import AssignShift from "./pages/shift/AssignShift";
import ViewShift from "./pages/shift/ViewShift";
import EmployeePerformance from "./pages/performance/EmployeePerformance";
import TaskManagement from "./pages/tasks/TaskManagement";

// Placeholder
const Placeholder = ({ title }) => (
  <div style={{ padding: "20px" }}>
    <h2>{title}</h2>
    <p>This page is still in progress.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Layout><DashboardHR /></Layout>} />
        <Route path="/dashboard/manager" element={<Layout><DashboardManager /></Layout>} />
        <Route path="/dashboard/employee" element={<Layout><DashboardEmployee /></Layout>} />

        {/* Manager Sub Pages */}
        <Route path="/tasks" element={<Layout><TaskManagement /></Layout>} />
        <Route path="/meetings" element={<Layout><MeetingPlanning /></Layout>} />
        <Route path="/performance" element={<Layout><EmployeePerformance /></Layout>} />

        {/* HR Pages */}
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/employees" element={<Layout><EmployeesList /></Layout>} />
        <Route path="/employees/add" element={<Layout><AddEmployee /></Layout>} />
        <Route path="/add-employee" element={<Layout><AddEmployee /></Layout>} />
        <Route path="/leave" element={<Layout><LeaveManagement /></Layout>} />

        {/* Shift Management */}
        <Route path="/shift" element={<Layout><ViewShift /></Layout>} />
        <Route path="/shift/assign" element={<Layout><AssignShift /></Layout>} />

        {/* Misc / Placeholder Routes */}
        <Route path="/messages" element={<Layout><Placeholder title="Messages from Employees" /></Layout>} />
        <Route path="/kpi" element={<Layout><Placeholder title="KRA/KPI Page" /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

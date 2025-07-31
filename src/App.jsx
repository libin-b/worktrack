import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import DashboardHR from "./pages/DashboardHR";
import DashboardManager from "./pages/DashboardManager";
import DashboardEmployee from "./pages/DashboardEmployee";
import CalendarPage from "./pages/calendar/CalendarPage";
import AddEmployee from "./pages/employees/AddEmployee";
import EmployeesList from "./pages/employees/EmployeesList";
import LeaveManagement from "./pages/leaves/LeaveManagement";
import MeetingPlanning from "./pages/meetings/MeetingPlanning";




// Placeholder for in-progress pages
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

        {/* HR Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardHR />
            </Layout>
          }
        />

        {/* Manager Dashboard */}
        <Route
          path="/dashboard/manager"
          element={
            <Layout>
              <DashboardManager />
            </Layout>
          }
        />

        {/* Manager Sub Pages (placeholders) */}
        <Route
          path="/tasks"
          element={
            <Layout>
              <Placeholder title="Task Assignment" />
            </Layout>
          }
        />
        <Route
          path="/meetings"
          element={
            <Layout>
              <Placeholder title="Meeting Planning" />
            </Layout>
          }
        />
        <Route
  path="/meetings"
  element={
    <Layout>
      <MeetingPlanning />
    </Layout>
  }
/>

        <Route
          path="/performance"
          element={
            <Layout>
              <Placeholder title="Employee Performance" />
            </Layout>
          }
        />

        {/* Employee Dashboard */}
        <Route
          path="/dashboard/employee"
          element={
            <Layout>
              <DashboardEmployee />
            </Layout>
          }
        />

        {/* Calendar */}
        <Route
          path="/calendar"
          element={
            <Layout>
              <CalendarPage />
            </Layout>
          }
        />

        {/* Employees */}
        <Route
          path="/employees"
          element={
            <Layout>
              <EmployeesList />
            </Layout>
          }
        />
        <Route
          path="/employees/add"
          element={
            <Layout>
              <AddEmployee />
            </Layout>
          }
        />
        <Route
          path="/add-employee"
          element={
            <Layout>
              <AddEmployee />
            </Layout>
          }
        />

        {/* Leave Management */}
        <Route
          path="/leave"
          element={
            <Layout>
              <LeaveManagement />
            </Layout>
          }
        />

        {/* Common Placeholder Pages */}
        <Route
          path="/messages"
          element={
            <Layout>
              <Placeholder title="Messages from Employees" />
            </Layout>
          }
        />
        <Route
          path="/kpi"
          element={
            <Layout>
              <Placeholder title="KRA/KPI Page" />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

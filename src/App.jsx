import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import DashboardHR from "./pages/DashboardHR";
import DashboardManager from "./pages/DashboardManager";
import DashboardEmployee from "./pages/DashboardEmployee";
import CalendarPage from "./pages/calendar/CalendarPage"; // calendar component
import AddEmployee from "./pages/employees/AddEmployee";
import EmployeesList from "./pages/employees/EmployeesList";
import LeaveManagement from "./pages/leaves/LeaveManagement";
// Placeholder for other routes
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
        <Route
          path="/dashboard/manager"
          element={
            <Layout>
              <DashboardManager />
            </Layout>
          }
        />
        <Route
          path="/dashboard/employee"
          element={
            <Layout>
              <DashboardEmployee />
            </Layout>
          }
        />

        {/*  Real Calendar Page */}
        <Route
          path="/calendar"
          element={
            <Layout>
              <CalendarPage />
            </Layout>
          }
        />

        {/* Employees Routes */}
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
        <Route
          path="/leave"
          element={
            <Layout>
              <LeaveManagement />
            </Layout>
          }
        />
        <Route
          path="/messages"
          element={
            <Layout>
              <Placeholder title="Messages from Employees" />
            </Layout>
          }
        />
        <Route
          path="/performance"
          element={
            <Layout>
              <Placeholder title="Performance Summary" />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

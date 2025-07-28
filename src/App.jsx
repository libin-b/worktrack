import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';
import DashboardHR from './pages/DashboardHR';
import CalendarPage from './pages/CalendarPage'; // calendar component

// Placeholder for other routes
const Placeholder = ({ title }) => (
  <div style={{ padding: '20px' }}>
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

        {/*  Real Calendar Page */}
        <Route
          path="/calendar"
          element={
            <Layout>
              <CalendarPage />
            </Layout>
          }
        />

        {/* Other placeholders */}
        <Route
          path="/employees"
          element={
            <Layout>
              <Placeholder title="Overall Employees" />
            </Layout>
          }
        />
        <Route
          path="/add-employee"
          element={
            <Layout>
              <Placeholder title="Add New Employee" />
            </Layout>
          }
        />
        <Route
          path="/leave"
          element={
            <Layout>
              <Placeholder title="Leave Management" />
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

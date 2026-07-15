import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['USER']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <PrivateRoute roles={['USER']}>
                <NewComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/:id"
            element={
              <PrivateRoute>
                <ComplaintDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <PrivateRoute roles={['AGENT']}>
                <AgentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<div className="text-center py-5"><h3>404 - Page not found</h3></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;

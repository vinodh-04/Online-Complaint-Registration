import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-5">
      <h1 className="fw-bold" style={{ color: 'var(--brand)' }}>
        Online Complaint Registration &amp; Management System
      </h1>
      <p className="lead text-muted mt-3 mx-auto" style={{ maxWidth: 640 }}>
        Register complaints, track their progress in real time, chat with your
        assigned agent, and share feedback once resolved — all from one
        centralized platform.
      </p>

      {!user && (
        <div className="mt-4 d-flex gap-3 justify-content-center">
          <Link to="/register" className="btn btn-brand px-4">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-secondary px-4">
            Login
          </Link>
        </div>
      )}

      <div className="row mt-5 g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📝 Submit &amp; Track</h5>
              <p className="card-text text-muted">
                Log complaints in seconds and follow their status from open to resolved.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🔀 Smart Routing</h5>
              <p className="card-text text-muted">
                Complaints are automatically routed to the agent with the lightest workload.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📊 Insights</h5>
              <p className="card-text text-muted">
                Admins get real-time analytics on volume, categories, and resolution time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

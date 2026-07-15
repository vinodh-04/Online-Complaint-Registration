import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/complaints');
        setComplaints(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = complaints.filter((c) => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(c.status));
  const closed = complaints.filter((c) => ['RESOLVED', 'CLOSED', 'REJECTED'].includes(c.status));

  return (
    <div>
      <h3 className="mb-4">Assigned Complaints</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h5 className="text-muted">Active ({active.length})</h5>
          <div className="row g-3 mb-4">
            {active.map((c) => (
              <div className="col-md-6" key={c._id}>
                <Link to={`/complaints/${c._id}`} className="text-decoration-none text-dark">
                  <div className="card card-complaint shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h6>{c.title}</h6>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="small text-muted mb-1">From: {c.user.name}</p>
                      <p className="small mb-0">{c.description.slice(0, 90)}...</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            {active.length === 0 && <p className="text-muted">No active complaints assigned.</p>}
          </div>

          <h5 className="text-muted">Closed / Resolved ({closed.length})</h5>
          <div className="row g-3">
            {closed.map((c) => (
              <div className="col-md-6" key={c._id}>
                <Link to={`/complaints/${c._id}`} className="text-decoration-none text-dark">
                  <div className="card shadow-sm h-100" style={{ opacity: 0.75 }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h6>{c.title}</h6>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="small text-muted mb-0">From: {c.user.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AgentDashboard;

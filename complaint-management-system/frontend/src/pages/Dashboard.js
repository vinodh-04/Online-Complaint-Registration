import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = filter === 'ALL' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3>My Complaints</h3>
        <Link to="/complaints/new" className="btn btn-brand">
          + New Complaint
        </Link>
      </div>

      <div className="mb-3">
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visible.length === 0 ? (
        <p className="text-muted">No complaints yet. Create one to get started.</p>
      ) : (
        <div className="row g-3">
          {visible.map((c) => (
            <div className="col-md-6" key={c._id}>
              <Link to={`/complaints/${c._id}`} className="text-decoration-none text-dark">
                <div className="card card-complaint shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{c.title}</h5>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="card-text text-muted small mb-1">{c.category.replace('_', ' ')}</p>
                    <p className="card-text">{c.description.slice(0, 100)}{c.description.length > 100 ? '...' : ''}</p>
                    <p className="card-text small text-muted mb-0">
                      Agent: {c.agent ? c.agent.name : 'Not yet assigned'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

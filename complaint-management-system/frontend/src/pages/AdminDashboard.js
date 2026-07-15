import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const tabs = ['Overview', 'Complaints', 'Agents & Users'];

const AdminDashboard = () => {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '', phone: '' });

  const loadAll = async () => {
    const [statsRes, complaintsRes, usersRes] = await Promise.all([
      api.get('/users/stats'),
      api.get('/complaints'),
      api.get('/users'),
    ]);
    setStats(statsRes.data);
    setComplaints(complaintsRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const agents = users.filter((u) => u.role === 'AGENT');

  const assignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      await api.put(`/complaints/${complaintId}/assign`, { agentId });
      toast.success('Agent assigned');
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign agent');
    }
  };

  const toggleActive = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive });
      loadAll();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const createAgent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { ...agentForm, role: 'AGENT' });
      toast.success('Agent created');
      setAgentForm({ name: '', email: '', password: '', phone: '' });
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create agent');
    }
  };

  return (
    <div>
      <h3 className="mb-4">Admin Dashboard</h3>

      <ul className="nav nav-tabs mb-4">
        {tabs.map((t) => (
          <li className="nav-item" key={t}>
            <button className={`nav-link ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'Overview' && stats && (
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h2>{stats.totalUsers}</h2>
              <p className="text-muted mb-0">Users</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h2>{stats.totalAgents}</h2>
              <p className="text-muted mb-0">Agents</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h2>{stats.totalComplaints}</h2>
              <p className="text-muted mb-0">Complaints</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center p-3">
              <h2>{stats.avgResolutionHours}h</h2>
              <p className="text-muted mb-0">Avg. Resolution Time</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h6>By Status</h6>
              {stats.statusCounts.map((s) => (
                <div className="d-flex justify-content-between border-bottom py-1" key={s._id}>
                  <span>{s._id.replace('_', ' ')}</span>
                  <strong>{s.count}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm p-3">
              <h6>By Category</h6>
              {stats.categoryCounts.map((c) => (
                <div className="d-flex justify-content-between border-bottom py-1" key={c._id}>
                  <span>{c._id.replace('_', ' ')}</span>
                  <strong>{c.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Complaints' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white shadow-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Reassign</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link to={`/complaints/${c._id}`}>{c.title}</Link>
                  </td>
                  <td>{c.user.name}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>{c.agent ? c.agent.name : '—'}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      defaultValue=""
                      onChange={(e) => assignAgent(c._id, e.target.value)}
                    >
                      <option value="" disabled>
                        Assign agent...
                      </option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.activeComplaintCount} active)
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Agents & Users' && (
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm p-3">
              <h6>Create New Agent</h6>
              <form onSubmit={createAgent}>
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Temporary password"
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  minLength={6}
                  required
                />
                <button className="btn btn-brand w-100">Create Agent</button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="table-responsive">
              <table className="table table-hover align-middle bg-white shadow-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.isActive ? 'Active' : 'Deactivated'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleActive(u._id, u.isActive)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [fbComment, setFbComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const pollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
    } catch (err) {
      toast.error('Could not load complaint');
    }
  }, [id]);

  useEffect(() => {
    load();
    // simple polling to emulate real-time chat updates
    pollRef.current = setInterval(load, 8000);
    return () => clearInterval(pollRef.current);
  }, [load]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const { data } = await api.post(`/complaints/${id}/comments`, { message });
      setComplaint(data);
      setMessage('');
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const updateStatus = async (status) => {
    try {
      const { data } = await api.put(`/complaints/${id}/status`, { status });
      setComplaint(data);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', { complaintId: id, rating, comment: fbComment });
      toast.success('Thanks for your feedback!');
      setFeedbackSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  if (!complaint) return <p>Loading...</p>;

  const canChat = true;
  const canUpdateStatus = user.role === 'AGENT' || user.role === 'ADMIN';
  const canGiveFeedback =
    user.role === 'USER' &&
    complaint.user._id === user._id &&
    ['RESOLVED', 'CLOSED'].includes(complaint.status) &&
    !feedbackSent;

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <h4>{complaint.title}</h4>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-muted small mb-2">
              {complaint.category.replace('_', ' ')} • Priority: {complaint.priority}
            </p>
            <p>{complaint.description}</p>
            <hr />
            <p className="small mb-1">
              <strong>Submitted by:</strong> {complaint.user.name} ({complaint.user.email})
            </p>
            <p className="small mb-0">
              <strong>Assigned agent:</strong> {complaint.agent ? complaint.agent.name : 'Not yet assigned'}
            </p>
          </div>
        </div>

        {canUpdateStatus && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6>Update Status</h6>
              <div className="d-flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${complaint.status === s ? 'btn-brand' : 'btn-outline-secondary'}`}
                    onClick={() => updateStatus(s)}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {canGiveFeedback && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6>Leave Feedback</h6>
              <form onSubmit={submitFeedback}>
                <div className="mb-2">
                  <label className="form-label">Rating</label>
                  <select className="form-select w-auto" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} ⭐
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    placeholder="Comments (optional)"
                    value={fbComment}
                    onChange={(e) => setFbComment(e.target.value)}
                  />
                </div>
                <button className="btn btn-brand btn-sm">Submit Feedback</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="col-lg-5">
        <div className="card shadow-sm h-100 d-flex flex-column">
          <div className="card-header">Conversation</div>
          <div className="card-body flex-grow-1" style={{ overflowY: 'auto', maxHeight: 400 }}>
            {complaint.comments.length === 0 && <p className="text-muted small">No messages yet.</p>}
            {complaint.comments.map((c, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${c.sender && c.sender._id === user._id ? 'mine' : 'theirs'}`}
              >
                <div className="small fw-bold">{c.senderRole}</div>
                <div>{c.message}</div>
              </div>
            ))}
          </div>
          {canChat && (
            <div className="card-footer">
              <form onSubmit={sendMessage} className="d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-brand">Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;

import React from 'react';

const statusColors = {
  OPEN: 'secondary',
  IN_PROGRESS: 'primary',
  RESOLVED: 'success',
  CLOSED: 'dark',
  REJECTED: 'danger',
};

const StatusBadge = ({ status }) => (
  <span className={`badge bg-${statusColors[status] || 'secondary'} badge-status`}>
    {status.replace('_', ' ')}
  </span>
);

export default StatusBadge;

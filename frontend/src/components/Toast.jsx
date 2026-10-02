// FreshFlow Floating Toast Notification Component
import React from 'react';

function Toast({ toast }) {
  if (!toast) return null;

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
    delete: 'fa-trash'
  };

  return (
    <div className={`floating-toast toast-${toast.type || 'info'}`} role="status">
      <i className={`fa-solid ${iconMap[toast.type] || 'fa-bell'}`}></i>
      <span className="toast-text">{toast.message}</span>
    </div>
  );
}

export default Toast;

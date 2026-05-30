import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-alert">
      <div className="error-alert-content">
        <AlertCircle size={18} className="error-alert-icon" />
        <span className="error-alert-text">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="error-alert-close">
          <X size={16} />
        </button>
      )}
      <style>{`
        .error-alert {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--color-danger-light);
          border: 1px solid var(--color-danger);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          margin-bottom: 16px;
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .error-alert-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .error-alert-icon {
          color: var(--color-danger);
          flex-shrink: 0;
        }
        .error-alert-text {
          font-weight: 500;
        }
        .error-alert-close {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .error-alert-close:hover {
          background-color: rgba(239, 68, 68, 0.2);
          color: var(--color-danger);
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;

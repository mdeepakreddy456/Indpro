import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/modal.css';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Effect to populate form when editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      
      if (task.dueDate) {
        // Format to YYYY-MM-DD for date input
        const dateObj = new Date(task.dueDate);
        const formattedDate = dateObj.toLocaleDateString('en-CA'); // Outputs YYYY-MM-DD in local time
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
    } else {
      // Clear form for creation mode
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task Details' : 'Create New Task'}</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              className="form-input-no-icon"
              placeholder="e.g. Design API routes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-input"
              placeholder="Provide a detailed task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Stage</label>
              <select
                id="task-status"
                className="filter-select"
                style={{ width: '100%', padding: '12px' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="filter-select"
                style={{ width: '100%', padding: '12px' }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              className="form-input-no-icon"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn submit">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .modal-error-message {
          background-color: var(--color-danger-light);
          border: 1px solid var(--color-danger);
          color: var(--text-primary);
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;

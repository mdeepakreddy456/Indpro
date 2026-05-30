import React from 'react';
import { Calendar, Edit3, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import '../styles/card.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!dueDate || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  // Move helpers
  const handleMoveForward = () => {
    if (status === 'todo') onStatusChange(_id, 'in_progress');
    else if (status === 'in_progress') onStatusChange(_id, 'done');
  };

  const handleMoveBackward = () => {
    if (status === 'in_progress') onStatusChange(_id, 'todo');
    else if (status === 'done') onStatusChange(_id, 'in_progress');
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', _id);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div 
      className="task-card animate-fade-in" 
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ contentVisibility: 'auto' }}
    >
      <div className="card-top">
        <span className={`priority-badge ${priority}`}>{priority}</span>
        <div className="card-actions">
          <button 
            className="card-action-btn" 
            onClick={() => onEdit(task)} 
            title="Edit Task"
          >
            <Edit3 size={14} />
          </button>
          <button 
            className="card-action-btn delete" 
            onClick={() => onDelete(_id)} 
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="card-title">{title}</h3>
      {description && <p className="card-desc">{description}</p>}

      <div className="card-footer">
        <div className={`card-date ${isOverdue() ? 'overdue' : ''}`}>
          {dueDate ? (
            <>
              <Calendar size={13} />
              <span>{formatDate(dueDate)} {isOverdue() ? '(Overdue)' : ''}</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>No due date</span>
          )}
        </div>

        <div className="card-move-controls">
          {status !== 'todo' && (
            <button 
              className="move-btn" 
              onClick={handleMoveBackward} 
              title={status === 'done' ? 'Move to In Progress' : 'Move to Todo'}
            >
              <ArrowLeft size={11} />
              <span>{status === 'done' ? 'Reopen' : 'Back'}</span>
            </button>
          )}

          {status !== 'done' && (
            <button 
              className="move-btn" 
              onClick={handleMoveForward} 
              title={status === 'todo' ? 'Move to In Progress' : 'Move to Done'}
            >
              <span>{status === 'todo' ? 'Start' : 'Done'}</span>
              {status === 'in_progress' ? <Check size={11} /> : <ArrowRight size={11} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

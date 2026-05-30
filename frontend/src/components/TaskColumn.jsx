import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

const TaskColumn = ({ title, icon, tasks = [], status, onEdit, onDelete, onStatusChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const getHeaderClass = () => {
    if (status === 'todo') return 'todo';
    if (status === 'in_progress') return 'progress';
    return 'done';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div 
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className={`column-title ${getHeaderClass()}`}>
          {icon}
          <span>{title}</span>
        </div>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="empty-column">
            <Inbox className="empty-column-icon" size={24} />
            <p>No tasks in this stage</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;

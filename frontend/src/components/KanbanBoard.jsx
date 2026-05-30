import React from 'react';
import TaskColumn from './TaskColumn';
import { ClipboardList, TrendingUp, CheckCheck } from 'lucide-react';
import '../styles/board.css';

const KanbanBoard = ({ tasks = [], onEdit, onDelete, onStatusChange }) => {
  // Filter tasks into their respective status columns
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const progressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="kanban-board">
      <TaskColumn
        title="To Do"
        icon={<ClipboardList size={18} />}
        tasks={todoTasks}
        status="todo"
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />

      <TaskColumn
        title="In Progress"
        icon={<TrendingUp size={18} />}
        tasks={progressTasks}
        status="in_progress"
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />

      <TaskColumn
        title="Completed"
        icon={<CheckCheck size={18} />}
        tasks={doneTasks}
        status="done"
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default KanbanBoard;

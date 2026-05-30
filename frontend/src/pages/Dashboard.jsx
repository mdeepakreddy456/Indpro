import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Plus, 
  Search, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  FolderOpen 
} from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'due_date', 'alphabetical'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // If set, we are editing. If null, we are creating.

  // Fetch tasks helper
  const fetchTasks = async () => {
    try {
      setApiError('');
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve tasks from server');
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Something went wrong while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Create or Update task handler
  const handleSaveTask = async (taskData) => {
    try {
      setApiError('');
      const url = activeTask ? `${API_URL}/tasks/${activeTask._id}` : `${API_URL}/tasks`;
      const method = activeTask ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(taskData)
      });

      const savedTask = await res.json();

      if (!res.ok) {
        throw new Error(savedTask.message || 'Failed to save task');
      }

      if (activeTask) {
        // Edit mode: replace task in list
        setTasks(tasks.map(t => t._id === savedTask._id ? savedTask : t));
      } else {
        // Creation mode: prepend task
        setTasks([savedTask, ...tasks]);
      }
      
      setIsModalOpen(false);
      setActiveTask(null);
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    }
  };

  // Delete task handler
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setApiError('');
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete task');
      }

      // Remove from state
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    }
  };

  // Quick move status update handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic UI update
      const originalTasks = [...tasks];
      setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));

      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const data = await res.json();
        // Rollback state if server error
        setTasks(originalTasks);
        throw new Error(data.message || 'Failed to update task status');
      }
    } catch (err) {
      console.error(err);
      setApiError(err.message);
    }
  };

  // Modal controls
  const openCreateModal = () => {
    setActiveTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  // Metrics computation
  const totalTasks = tasks.length;
  const todoTasksCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneTasksCount = tasks.filter(t => t.status === 'done').length;

  // Filter and Sort implementation
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // 1. Search Query filter
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Priority filter
      const matchesPriority = 
        priorityFilter === 'all' || 
        task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      if (sortBy === 'due_date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      {loading ? (
        <LoadingSpinner fullPage={true} />
      ) : (
        <main className="dashboard-content">
          {/* Header Area */}
          <div className="dashboard-header">
            <div className="header-welcome">
              <h1>Welcome, {user.username}!</h1>
              <p>Keep track of your projects and execute tasks smoothly.</p>
            </div>
            <div className="header-actions">
              <button className="add-task-btn" onClick={openCreateModal}>
                <Plus size={18} />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <FolderOpen size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-count">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon todo">
                <Briefcase size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-count">{todoTasksCount}</span>
                <span className="stat-label">To Do</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon progress">
                <Clock size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-count">{inProgressTasksCount}</span>
                <span className="stat-label">In Progress</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon done">
                <CheckCircle size={20} />
              </div>
              <div className="stat-details">
                <span className="stat-count">{doneTasksCount}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>

          {/* Error Message banner */}
          <ErrorMessage message={apiError} onClose={() => setApiError('')} />

          {/* Filter Controls Bar */}
          <div className="filters-bar">
            <span className="filters-title">Filter By:</span>
            
            <div className="filter-controls">
              <div className="search-input-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort tasks by"
              >
                <option value="recent">Sort by: Recent</option>
                <option value="due_date">Sort by: Due Date</option>
                <option value="alphabetical">Sort by: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Kanban Board */}
          <KanbanBoard 
            tasks={filteredAndSortedTasks} 
            onEdit={openEditModal} 
            onDelete={handleDeleteTask} 
            onStatusChange={handleStatusChange}
          />
        </main>
      )}

      {/* Task Modal (Create/Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setActiveTask(null); }}
        onSubmit={handleSaveTask}
        task={activeTask}
      />

      <footer className="dashboard-footer">
        <div className="footer-content">
          <span>&copy; {new Date().getFullYear()} TaskManager. All rights reserved.</span>
          <span className="footer-divider">|</span>
          <span className="footer-handcrafted">Handcrafted for INDPRO</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

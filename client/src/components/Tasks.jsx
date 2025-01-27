import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalTasks: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const fetchTasks = async (page = pagination.currentPage, limit = pagination.limit) => {
    try {
      setLoading(true);
      const res = await api.get('/tasks', {
        params: {
          page,
          limit
        }
      });

      setTasks(res.data.tasks);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        limit: res.data.pagination.limit,
        totalPages: res.data.pagination.totalPages,
        totalTasks: res.data.pagination.totalTasks
      });
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '' });
      // Refresh tasks and reset to first page
      await fetchTasks(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handlePaginationChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchTasks(newPage);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit }));
    fetchTasks(1, newLimit);
  };

  return (
    <div className="tasks-container">
      <h2>Your Tasks ({pagination.totalTasks})</h2>
      
      {/* Create Task Form */}
      <form onSubmit={handleTaskSubmit} className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Task'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-meta">
              <span>Status: {task.status}</span>
              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            <button onClick={() => navigate(`/tasks/${task._id}`)}>View Task</button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button 
          onClick={() => handlePaginationChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </button>
        
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        
        <button
          onClick={() => handlePaginationChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>

        <select 
          value={pagination.limit} 
          onChange={handleLimitChange}
          className="limit-select"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Tasks;
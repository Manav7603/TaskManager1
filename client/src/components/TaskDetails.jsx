import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams(); // Task ID from URL
  const navigate = useNavigate();

  // Axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status || '',
        });
      } catch (err) {
        setError('Failed to fetch task details');
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/tasks/${id}`, formData);
      alert('Task updated successfully');
      navigate('/tasks'); // Redirect to tasks page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await api.delete(`/tasks/${id}`);
        alert('Task deleted successfully');
        navigate('/tasks'); // Redirect to tasks page
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!task) {
    return <div>Loading task details...</div>;
  }

  return (
    <div className="task-details-container">
      <h2>Task Details</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Task'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="delete-button"
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Task'}
      </button>

      <button
        onClick={() => navigate('/tasks')}
        className="back-button"
      >
        Back to Tasks
      </button>
    </div>
  );
};

export default TaskDetails;

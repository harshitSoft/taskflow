import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Loader, ListTodo, ClipboardList } from 'lucide-react';
import api from '../api';

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const { data } = await api.get('/tasks/pending');
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      setError("Failed to load tasks. Please refresh or verify your session.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setIsAdding(true);
    setError('');
    try {
      const { data } = await api.post('/tasks', {
        title: newTaskTitle,
        description: newTaskDesc
      });
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error("Failed to add task", err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to add task. Please try again.';
      setError(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      setError('');
      await api.patch(`/tasks/${id}/complete`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Failed to complete task", err);
      setError("Failed to complete task.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      setError('');
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
      setError("Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader size={32} className="lucide-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', fontWeight: 600 }}>Add New Task</h2>
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Task Title (required)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="Task Description (optional)"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isAdding || !newTaskTitle.trim()}>
            <Plus size={18} />
            {isAdding ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ListTodo size={20} />
          Pending Tasks
        </h2>
        
        {tasks.length === 0 ? (
          <div className="card empty-state">
            <ClipboardList size={48} className="empty-icon" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No pending tasks</h3>
            <p>You've completed all your tasks or haven't added any yet.</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-meta">
                    Added: {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    className="btn btn-outline"
                    style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                    onClick={() => handleCompleteTask(task.id)}
                    title="Mark as completed"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    className="btn btn-outline"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

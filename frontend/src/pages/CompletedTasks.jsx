import { useState, useEffect } from 'react';
import { Trash2, Loader, CheckCircle2 } from 'lucide-react';
import api from '../api';

export const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const { data } = await api.get('/tasks/completed');
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
      setError("Failed to load completed tasks. Please refresh or verify your session.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this completed task?")) return;
    
    try {
      setError('');
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
      setError("Failed to delete completed task.");
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
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
          Completed Tasks
        </h1>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {tasks.length === 0 ? (
        <div className="card empty-state">
          <CheckCircle2 size={48} className="empty-icon" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>No completed tasks</h3>
          <p>You haven't completed any tasks yet.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item" style={{ opacity: 0.8 }}>
              <div className="task-content">
                <h3 className="task-title" style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  {task.title}
                </h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-meta">
                  Completed: {new Date(task.completedAt).toLocaleString()}
                </div>
              </div>
              <div className="task-actions">
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
  );
};

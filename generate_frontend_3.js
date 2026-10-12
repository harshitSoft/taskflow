const fs = require('fs');
const path = require('path');

const files = {
    "frontend/src/pages/CompletedTasks.jsx": `import { useState, useEffect } from 'react';
import { Trash2, Loader, CheckCircle2 } from 'lucide-react';
import api from '../api';

export const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/completed');
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch completed tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this completed task?")) return;
    
    try {
      await api.delete(\`/tasks/\${id}\`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task", error);
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
`,
    "frontend/src/pages/AdminDashboard.jsx": `import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, CheckSquare, ListTodo, Loader } from 'lucide-react';
import api from '../api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader size={32} className="lucide-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <Users size={24} style={{ color: 'var(--primary)' }} />
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Active Users</div>
              <div className="stat-value">{stats.activeUsers}</div>
            </div>
            <UserCheck size={24} style={{ color: 'var(--success)' }} />
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Inactive Users</div>
              <div className="stat-value">{stats.inactiveUsers}</div>
            </div>
            <UserX size={24} style={{ color: 'var(--danger)' }} />
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Total Tasks</div>
              <div className="stat-value">{stats.totalTasks}</div>
            </div>
            <ListTodo size={24} style={{ color: 'var(--primary)' }} />
          </div>
        </div>
        
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Completed Tasks</div>
              <div className="stat-value">{stats.totalCompletedTasks}</div>
            </div>
            <CheckSquare size={24} style={{ color: 'var(--success)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
`,
    "frontend/src/pages/AdminUsers.jsx": `import { useState, useEffect } from 'react';
import { Plus, Power, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/admin/users', newUser);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'USER' });
      fetchUsers(); // Refresh list to get proper stats
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create user. Please check the inputs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(\`/admin/users/\${userId}/status\`, { active: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, active: !currentStatus } : u));
    } catch (err) {
      alert("Failed to update user status.");
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
        <h1 className="page-title">User Management</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Tasks (Total / Done)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={\`badge \${u.role === 'ADMIN' ? 'badge-warning' : 'badge-success'}\`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: u.active ? 'var(--success)' : 'var(--danger)' }}>
                    {u.active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {u.active ? 'Active' : 'Inactive'}
                  </div>
                </td>
                <td>{u.totalTasks} / {u.completedTasks}</td>
                <td>
                  <button 
                    className={\`btn \${u.active ? 'btn-danger' : 'btn-primary'}\`}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleToggleStatus(u.id, u.active)}
                    disabled={u.id === currentUser.id}
                    title={u.id === currentUser.id ? "Cannot deactivate yourself" : "Toggle active status"}
                  >
                    <Power size={14} />
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password (min 6 chars)</label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="role">Role</label>
                  <select
                    id="role"
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
`
};

for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(process.cwd(), filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log("Created: " + fullPath);
}

import { useState, useEffect } from 'react';
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

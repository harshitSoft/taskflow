import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  LayoutDashboard, 
  CheckCircle2, 
  LogOut, 
  Users, 
  Settings,
  Menu,
  X,
  ListTodo
} from 'lucide-react';
import { useState } from 'react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'ADMIN' 
    ? [
        { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/dashboard', icon: ListTodo, label: 'My Tasks' },
        { to: '/completed', icon: CheckCircle2, label: 'Completed Tasks' },
      ]
    : [
        { to: '/dashboard', icon: LayoutDashboard, label: 'My Tasks' },
        { to: '/completed', icon: CheckCircle2, label: 'Completed Tasks' },
      ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : 'mobile-closed'}`} style={{ display: window.innerWidth > 768 || mobileMenuOpen ? 'flex' : 'none' }}>
        <div className="sidebar-header">
          <CheckSquare size={24} />
          <span>TaskFlow</span>
          {window.innerWidth <= 768 && (
            <button onClick={toggleMobileMenu} style={{ marginLeft: 'auto' }}>
              <X size={20} />
            </button>
          )}
        </div>
        <nav className="nav-links">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item w-full" style={{ width: '100%' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          {window.innerWidth <= 768 && (
            <button onClick={toggleMobileMenu} style={{ marginRight: 'auto' }}>
              <Menu size={24} />
            </button>
          )}
          <div className="user-info">
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user?.name}</span>
            <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>{user?.role}</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
